import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Faq } from './entities/faq.entity';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Faq>> {
    return paginate<Faq>(this.faqRepository, options);
  }

  create(createFaqDto: CreateFaqDto): Promise<Faq> {
    try {
      const newFaq = this.faqRepository.create(createFaqDto);
      return this.faqRepository.save(newFaq);
    } catch (error) {
      throw new Error(`Failed to create FAQ: ${error.message}`);
    }
  }

  async findAll({
    page = 1,
    limit = 10,
    search,
    status,
  }: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
  }): Promise<Pagination<Faq>> {
    const queryBuilder = this.faqRepository.createQueryBuilder('faq');

    // Search by title (case-insensitive)
    // faq.title ILIKE :search OR faq.description ILIKE :search
    if (search) {
      queryBuilder.andWhere('(faq.title ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    // Filter by status
    if (status) {
      queryBuilder.andWhere('faq.status = :status', { status });
    }

    // Default sorting (newest first)
    queryBuilder.orderBy('faq.created_at', 'DESC');

    // Run pagination using the query builder
    const paginatedResult = await paginate<Faq>(queryBuilder, { page, limit });

    // If no FAQ found
    if (!paginatedResult.items.length) {
      throw new NotFoundException('No FAQs found');
    }

    return paginatedResult;
  }

  async findOne(id: string) {
    const faq = await this.faqRepository.findOne({ where: { id } });
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    return faq;
  }

  async update(id: string, updateFaqDto: UpdateFaqDto) {
    const faq = await this.faqRepository.findOne({ where: { id } });
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    Object.assign(faq, updateFaqDto);
    faq.updated_at = new Date();
    return this.faqRepository.save(faq);
  }

  async remove(id: string) {
    const result = await this.faqRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    return {
      message: `FAQ with ID ${id} has been successfully deleted`,
    };
  }
}
