import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<any> {
    return paginate(this.categoryRepository, options);
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const newCategory = this.categoryRepository.create(createCategoryDto);
      const saveCategory = await this.categoryRepository.save(newCategory);
      return saveCategory as Category;
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('This category already exists');
      }
      throw new Error(`Failed to create post: ${e.message}`);
    }
  }

  async findAll({
    page = 1,
    limit = 10,
    search,
    status,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) {
    const query = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('news_post', 'news', 'news.category_id = category.id')
      .select([
        'category.id AS id',
        'category.name AS name',
        'category.image_url AS image_url',
        'category.status AS status',
        'category.created_at AS created_at',
        'category.updated_at AS updated_at',
        'COUNT(news.id) AS news_count',
      ])
      .groupBy('category.id')
      .orderBy('category.created_at', 'DESC');

    if (search) {
      query.andWhere('category.name ILIKE :search', { search: `%${search}%` });
    }

    if (status) {
      query.andWhere('category.status = :status', { status });
    }

    const [categories, total] = await Promise.all([
      query
        .limit(limit)
        .offset((page - 1) * limit)
        .getRawMany(),
      query.getCount(),
    ]);

    if (categories.length === 0) {
      throw new NotFoundException('No category found!');
    }

    const formatted = categories.map((category) => ({
      ...category,
      news_count: parseInt(category.news_count, 10),
    }));

    return {
      categories: formatted,
      meta: {
        total: total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async countCategory() {
    const totalCategory = await this.categoryRepository.count();
    if (!totalCategory) {
      throw new NotFoundException('No category yet!');
    }
    return totalCategory;
  }

  async findOne(id: string) {
    return await this.categoryRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    if (!category) {
      throw new NotFoundException();
    }
    Object.assign(category, updateCategoryDto);
    category.updated_at = new Date();
    return await this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    if (!category) {
      throw new NotFoundException();
    }
    return this.categoryRepository.remove(category);
  }
}
