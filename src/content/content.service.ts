import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
  ) {}

  async create(createContentDto: CreateContentDto) {
    const content = this.contentRepository.create(createContentDto);
    return this.contentRepository.save(content);
  }

  async findOne() {
    const latestContent = await this.contentRepository
      .createQueryBuilder('content')
      .orderBy('content.updated_at', 'DESC')
      .limit(1)
      .getOne();

    if (!latestContent) {
      throw new NotFoundException('No content found');
    }

    return latestContent;
  }

  async findAll() {
    const contents = await this.contentRepository
      .createQueryBuilder('content')
      .orderBy('content.updated_at', 'DESC')
      .getMany();
    if (!contents) {
      throw new NotFoundException('No content found');
    }
    return contents;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} content`;
  // }

  async update(id: string, updateContentDto: UpdateContentDto) {
    const content = await this.contentRepository.findOneBy({ id });
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    Object.assign(content, updateContentDto);
    return this.contentRepository.save(content);
  }

  async remove(id: string) {
    const content = await this.contentRepository.findOneBy({ id });
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    const result = await this.contentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    return { message: `Content with ID ${id} has been deleted` };
  }
}
