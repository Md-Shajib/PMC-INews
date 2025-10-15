import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/auth/enum/role.enume';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateJournalistDto } from './dto/create-journalist.dto';
import { UpdateJournalistDto } from './dto/update-journalist.dto';
import { Journalist, JournalistStatus } from './entities/journalist.entity';

@Injectable()
export class JournalistService {
  constructor(
    @InjectRepository(Journalist)
    private journalistRepository: Repository<Journalist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

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
        isUser.name = createJournalistDto.name;
        isUser.image_url = createJournalistDto.image_url || isUser.image_url;
        if (createJournalistDto.password) {
          isUser.password = await bcrypt.hash(createJournalistDto.password, 7);
        }
        await this.userRepository.save(isUser);

        const newJournalist =
          this.journalistRepository.create(createJournalistDto);

        const saveJournalist =
          await this.journalistRepository.save(newJournalist);
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

        const newJournalist =
          this.journalistRepository.create(createJournalistDto);
        const saveJournalist =
          await this.journalistRepository.save(newJournalist);
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

  async paginateFindAll(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{
    data: (Journalist & { total_news: number })[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const skip = (page - 1) * limit;

    const query = this.journalistRepository
      .createQueryBuilder('journalist')
      .leftJoin('journalist.news_posts', 'news_post')
      .addSelect('COUNT(news_post.id)', 'total_news')
      .groupBy('journalist.id')
      .orderBy('journalist.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      query.andWhere(
        '(journalist.name ILIKE :search OR journalist.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Execute query and get entities + raw counts
    const [data, total] = await query.getManyAndCount();

    // Map total_news manually using getRawMany
    const raw = await query.getRawMany();
    const items = data.map((journalist, index) => ({
      ...journalist,
      total_news: Number(raw[index]?.total_news ?? 0),
    }));

    return {
      data: items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllMinimal() {
    const journalists = await this.journalistRepository.find({
      select: ['id', 'name'],
      where: { status: JournalistStatus.ACTIVE },
      order: { name: 'ASC' },
    });
    if (journalists.length === 0) {
      throw new NotFoundException('No journalist found!');
    }
    return journalists;
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
    const user = await this.userRepository.findOne({
      where: { email: journalist.email },
    });

    if (!journalist || !user) {
      throw new NotFoundException();
    }

    const { password, ...journalistData } = updateJournalistDto;
    await this.journalistRepository.update(id, journalistData);

    const updatedUser: any = {};
    if (updateJournalistDto.name) updatedUser.name = updateJournalistDto.name;
    if (updateJournalistDto.email)
      updatedUser.email = updateJournalistDto.email;
    if (updateJournalistDto.password)
      updatedUser.password = await bcrypt.hash(updateJournalistDto.password, 7);
    if (updateJournalistDto.image_url)
      updatedUser.image_url = updateJournalistDto.image_url;
    await this.userRepository.update(user?.id, updatedUser);

    return this.findOne(id);
  }

  async remove(id: string) {
    const journalist = await this.findOne(id);
    const user = await this.userRepository.findOne({
      where: { email: journalist.email },
    });
    if (!journalist && !user) {
      throw new NotFoundException();
    }
    await this.journalistRepository.remove(journalist as Journalist);
    await this.userRepository.remove(user as User);

    return { message: 'Delete successfully: ', journalist };
  }
}
