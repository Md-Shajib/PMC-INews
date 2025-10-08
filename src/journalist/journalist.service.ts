import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJournalistDto } from './dto/create-journalist.dto';
import { UpdateJournalistDto } from './dto/update-journalist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Journalist } from './entities/journalist.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Role } from 'src/auth/enum/role.enume';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class JournalistService {
  constructor(
    @InjectRepository(Journalist)
    private journalistRepository: Repository<Journalist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Journalist>> {
    return paginate<Journalist>(this.journalistRepository, options);
  }

  async create(createJournalistDto: CreateJournalistDto): Promise<Journalist> {
    try {
      const journalistEmail = createJournalistDto.email;

      const isJournalist = await this.journalistRepository.findOne({
        where: { email: journalistEmail },
      });

      const isUser = await this.userRepository.findOne({
        where: { email: journalistEmail },
      });

      if (isJournalist?.email === journalistEmail) {
        throw new ConflictException('Email already journalist');
      }

      if (isUser) {
        isUser.role = Role.Journalist;
        await this.userRepository.save(isUser);

        const newJournalist = this.journalistRepository.create(
          createJournalistDto,
        );

        const saveJournalist = await this.journalistRepository.save(
          newJournalist,
        );
        return saveJournalist as Journalist;

      } else {
        const newUser = this.userRepository.create({
          name: createJournalistDto.name,
          email: journalistEmail,
          password: createJournalistDto.password,
          image_url: createJournalistDto.image_url,
          role: Role.Journalist,
        });
        await this.userRepository.save(newUser);

        const newJournalist = this.journalistRepository.create(
          createJournalistDto,
        );
        const saveJournalist = await this.journalistRepository.save(
          newJournalist,
        );
        return saveJournalist as Journalist;
      }
    } catch (error) {
      if (error.code === '23505') {
        // PostgreSQL unique violation error code
        throw new ConflictException('Email already in use');
      }
      throw new Error(`Failed to create journalist: ${error.message}`);
    }
  }

  async findAll() {
    return await this.journalistRepository.find();
  }

  async findOne(id: string) {
    const journalist = await this.journalistRepository.findOne({
      where: { id },
    });
    if (!journalist) {
      throw new NotFoundException('Can not found journalist');
    }
    return journalist;
  }

  async countJournalist() {
    return this.journalistRepository.count();
  }

  async update(id: string, updateJournalistDto: UpdateJournalistDto) {
    const journalist = await this.findOne(id);
    const user = await this.userRepository.findOne({ where: { email: journalist.email } });

    if (!journalist || !user) {
      throw new NotFoundException();
    }
    
    const { password, ...journalistData } = updateJournalistDto;
    await this.journalistRepository.update(id, journalistData);

    const updatedUser: any = {};
    if (updateJournalistDto.name) updatedUser.name = updateJournalistDto.name;
    if (updateJournalistDto.email) updatedUser.email = updateJournalistDto.email;
    if (updateJournalistDto.password) updatedUser.password = await bcrypt.hash(updateJournalistDto.password, 7); // ⚠️ Hash if needed
    if (updateJournalistDto.image_url) updatedUser.image_url = updateJournalistDto.image_url;
    await this.userRepository.update(user?.id, updatedUser);
    
    return this.findOne(id);
  }

  async remove(id: string) {
    const journalist = await this.findOne(id);
    const user = await this.userRepository.findOne({ where: { email: journalist.email } });
    if (!journalist && !user) {
      throw new NotFoundException();
    }
    await this.journalistRepository.remove(journalist as Journalist);
    await this.userRepository.remove(user as User);

    return { message: "Delete successfully: ", journalist };
  }
}
