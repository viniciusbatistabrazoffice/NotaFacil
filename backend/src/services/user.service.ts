import bcrypt from 'bcryptjs';
import { User } from '../entities/tenant/User';
import { getUserRepository } from '../repositories/user.repository';

type CreateUserInput = Pick<User, 'name' | 'email' | 'password'>;
type UpdateUserInput = Partial<CreateUserInput>;

const SALT_ROUNDS = 10;

export class UserService {
  async findAll(schemaName: string): Promise<User[]> {
    const userRepository = await getUserRepository(schemaName);
    return userRepository.find();
  }

  async findById(schemaName: string, id: string): Promise<User> {
    const userRepository = await getUserRepository(schemaName);
    const user = await userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async create(schemaName: string, data: CreateUserInput): Promise<User> {
    const userRepository = await getUserRepository(schemaName);
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = userRepository.create({ ...data, password: hashedPassword });
    return userRepository.save(user);
  }

  async update(schemaName: string, id: string, data: UpdateUserInput): Promise<User> {
    const userRepository = await getUserRepository(schemaName);
    const user = await this.findById(schemaName, id);
    const updateData = data.password
      ? { ...data, password: await bcrypt.hash(data.password, SALT_ROUNDS) }
      : data;
    userRepository.merge(user, updateData);
    return userRepository.save(user);
  }

  async delete(schemaName: string, id: string): Promise<void> {
    const userRepository = await getUserRepository(schemaName);
    const user = await this.findById(schemaName, id);
    await userRepository.remove(user);
  }
}
