import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { User } from '../entities/tenant/User';
import { Tenant } from '../entities/public/Tenant';
import {
  emailExistsInAnyTenant,
  findUsersByEmailInSchema,
  getUserRepository,
} from '../repositories/user.repository';
import { tenantRepository } from '../repositories/tenant.repository';
import { TenantService } from './tenant.service';
import { signToken } from '../utils/jwt';
import { sendPasswordResetEmail } from '../utils/mailer';
import { env } from '../config/env';
import { MessageResponse } from '../dto/message-response.dto';

interface RegisterInput {
  companyName: string;
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  tenant?: string;
  email: string;
  password: string;
}

interface AuthResult {
  user: Omit<User, 'password'>;
  tenant: Pick<Tenant, 'id' | 'name' | 'slug'>;
  token: string;
}

interface TenantSelectionResult {
  requiresTenantSelection: true;
  tenants: Array<Pick<Tenant, 'id' | 'name' | 'slug'>>;
}

interface ForgotPasswordResult extends MessageResponse {
  resetToken?: string;
  resetUrl?: string;
}

const SALT_ROUNDS = 10;
const RESET_TOKEN_EXPIRES_MS = 60 * 60 * 1000;
const FORGOT_PASSWORD_MESSAGE = 'If the email exists, a reset link has been sent';

const tenantService = new TenantService();

export class AuthService {
  async register(data: RegisterInput): Promise<AuthResult> {
    if (!data.companyName || !data.name || !data.email || !data.password) {
      throw new Error('Company name, name, email and password are required');
    }

    const email = data.email.trim().toLowerCase();
    if (await emailExistsInAnyTenant(email)) {
      throw new Error('Email already in use');
    }

    const tenant = await tenantService.create(data.companyName);

    try {
      const userRepository = await getUserRepository(tenant.schemaName);
      const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
      const user = userRepository.create({
        name: data.name,
        email,
        password: hashedPassword,
      });
      const saved = await userRepository.save(user);

      const { password: _password, ...userWithoutPassword } = saved;
      return {
        user: userWithoutPassword,
        tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug },
        token: signToken({ sub: saved.id, tenantId: tenant.id, schema: tenant.schemaName }),
      };
    } catch (error) {
      await tenantService.destroy(tenant);
      throw error;
    }
  }

  async login(data: LoginInput): Promise<AuthResult | TenantSelectionResult> {
    if (!data.email || !data.password) {
      throw new Error('Email and password are required');
    }

    const email = data.email.trim().toLowerCase();

    if (data.tenant) {
      const tenant = await tenantService.findBySlug(data.tenant);
      if (!tenant) {
        throw new Error('Invalid credentials');
      }
      const result = await this.tryTenantLogin(tenant, email, data.password);
      if (!result) {
        throw new Error('Invalid credentials');
      }
      return result;
    }

    const tenants = await tenantRepository.find();
    const matches: AuthResult[] = [];
    for (const tenant of tenants) {
      const result = await this.tryTenantLogin(tenant, email, data.password);
      if (result) {
        matches.push(result);
      }
    }

    if (matches.length === 0) {
      throw new Error('Invalid credentials');
    }
    if (matches.length > 1) {
      return {
        requiresTenantSelection: true,
        tenants: matches.map((match) => match.tenant),
      };
    }
    return matches[0];
  }

  private async tryTenantLogin(
    tenant: Tenant,
    email: string,
    password: string,
  ): Promise<AuthResult | null> {
    const users = await findUsersByEmailInSchema(tenant.schemaName, email);
    for (const user of users) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        continue;
      }

      const { password: _password, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword,
        tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug },
        token: signToken({ sub: user.id, tenantId: tenant.id, schema: tenant.schemaName }),
      };
    }
    return null;
  }

  async forgotPassword(tenantSlug: string | undefined, email: string): Promise<ForgotPasswordResult> {
    if (!email) {
      throw new Error('Email is required');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const tenants = tenantSlug
      ? [await tenantService.findBySlug(tenantSlug)].filter((t): t is Tenant => Boolean(t))
      : await tenantRepository.find();

    const result: ForgotPasswordResult = { message: FORGOT_PASSWORD_MESSAGE };

    for (const tenant of tenants) {
      const existingUsers = await findUsersByEmailInSchema(tenant.schemaName, normalizedEmail);
      const userRepository = await getUserRepository(tenant.schemaName);

      for (const existing of existingUsers) {
        const user = await userRepository.findOneBy({ id: existing.id });
        if (!user) {
          continue;
        }

        const token = randomBytes(32).toString('hex');
        user.resetToken = createHash('sha256').update(token).digest('hex');
        user.resetTokenExpires = new Date(Date.now() + RESET_TOKEN_EXPIRES_MS);
        await userRepository.save(user);

        const resetUrl = `${env.frontendUrl}/reset-password?token=${token}&tenant=${tenant.slug}`;
        await sendPasswordResetEmail(user.email, resetUrl);

        if (env.nodeEnv === 'development' && !result.resetToken) {
          result.resetToken = token;
          result.resetUrl = resetUrl;
        }
      }
    }

    return result;
  }

  async resetPassword(
    tenantSlug: string,
    token: string,
    password: string,
  ): Promise<MessageResponse> {
    if (!tenantSlug || !token || !password) {
      throw new Error('Tenant, token and password are required');
    }

    const tenant = await tenantService.findBySlug(tenantSlug);
    if (!tenant) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedToken = createHash('sha256').update(token).digest('hex');
    const userRepository = await getUserRepository(tenant.schemaName);
    const user = await userRepository
      .createQueryBuilder('user')
      .addSelect('user.resetToken')
      .addSelect('user.resetTokenExpires')
      .where('user.resetToken = :hashedToken', { hashedToken })
      .getOne();

    if (!user || !user.resetTokenExpires || user.resetTokenExpires.getTime() < Date.now()) {
      throw new Error('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(password, SALT_ROUNDS);
    user.resetToken = null;
    user.resetTokenExpires = null;
    await userRepository.save(user);

    return { message: 'Password updated successfully' };
  }
}
