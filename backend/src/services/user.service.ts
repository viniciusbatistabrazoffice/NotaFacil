import bcrypt from 'bcryptjs';
import { User } from '../entities/tenant/User';
import {
  emailExistsInAnyTenant,
  getUserRepository,
} from '../repositories/user.repository';

type CreateUserInput = Pick<User, 'name' | 'email' | 'password'>;
type UpdateUserInput = Partial<CreateUserInput>;

const SALT_ROUNDS = 10;

export class UserService {
  async findAll(schemaName: string): Promise<Omit<User, 'password'>[]> {
    const userRepository = await getUserRepository(schemaName);
    const users = await userRepository.find({ order: { name: 'ASC' } });
    return users.map(({ password: _password, ...user }) => user);
  }

  async findById(schemaName: string, id: string): Promise<User> {
    const userRepository = await getUserRepository(schemaName);
    const user = await userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async findPublicById(schemaName: string, id: string): Promise<Omit<User, 'password'>> {
    const { password: _password, ...user } = await this.findById(schemaName, id);
    return user;
  }

  async create(schemaName: string, data: CreateUserInput): Promise<Omit<User, 'password'>> {
    const userRepository = await getUserRepository(schemaName);
    const email = data.email.trim().toLowerCase();
    if (await emailExistsInAnyTenant(email)) {
      throw new Error('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = userRepository.create({ ...data, email, password: hashedPassword });
    const saved = await userRepository.save(user);
    const { password: _password, ...userWithoutPassword } = saved;
    return userWithoutPassword;
  }

  async update(
    schemaName: string,
    id: string,
    data: UpdateUserInput,
  ): Promise<Omit<User, 'password'>> {
    const userRepository = await getUserRepository(schemaName);
    const user = await this.findById(schemaName, id);
    if (data.email) {
      data.email = data.email.trim().toLowerCase();
    }
    if (data.email && data.email !== user.email) {
      if (await emailExistsInAnyTenant(data.email)) {
        throw new Error('Email already in use');
      }
    }
    const updateData = data.password
      ? { ...data, password: await bcrypt.hash(data.password, SALT_ROUNDS) }
      : data;
    userRepository.merge(user, updateData);
    const saved = await userRepository.save(user);
    const { password: _password, ...userWithoutPassword } = saved;
    return userWithoutPassword;
  }

  async delete(schemaName: string, id: string, currentUserId?: string): Promise<void> {
    if (currentUserId && id === currentUserId) {
      throw new Error('Cannot delete your own account');
    }
    const userRepository = await getUserRepository(schemaName);
    const user = await this.findById(schemaName, id);
    await userRepository.remove(user);
  }
}
