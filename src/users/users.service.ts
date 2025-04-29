import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ){}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try{
      // Create a new user entity with the DTO data
      const newUser = this.usersRepository.create(createUserDto);

      // console.log(newUser);

      // Save the user to the database
      const savedUser = await this.usersRepository.save(newUser);

      // Return the saved user (typically without the password)
      // You may want to exclude sensitive fields before returning
      const { password, ...result } = savedUser;
      return result as User;

    }catch(error){
      if (error.code === '23505') { // PostgreSQL unique violation code
        throw new Error('User with this email already exists');
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: string) {
    return await this.usersRepository.findOne({
      where: { id }
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if(!user){
      throw new NotFoundException();
    }

    Object.assign(user, updateUserDto);

    return await this.usersRepository.save(user);
  }

 async remove(id: string) {
    const user = await this.findOne(id);
    if(!user){
      throw new NotFoundException();
    }
    return this.usersRepository.remove(user);
 }
}
