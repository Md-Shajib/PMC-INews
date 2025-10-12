import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriber } from './entities/subscriber.entity';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class SubscriberService {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Subscriber>> {
    return paginate<Subscriber>(this.subscriberRepository, options);
  }

  async create(createSubscriberDto: CreateSubscriberDto): Promise<Subscriber> {
    try {
      const existingSubscriber = await this.subscriberRepository.findOneBy({
        email: createSubscriberDto.email,
      });
      if (existingSubscriber) {
        throw new Error('Subscriber with this email already exists');
      }
      const subscriber = this.subscriberRepository.create(createSubscriberDto);
      return this.subscriberRepository.save(subscriber);
    } catch (error) {
      throw new Error('Failed to create subscriber: ' + error.message);
    }
  }

  async findAll({
    page = 1,
    limit = 10,
    search,
  }: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<Pagination<Subscriber>> {
    const queryBuilder =
      this.subscriberRepository.createQueryBuilder('subscriber');
    if (search) {
      queryBuilder.where('subscriber.email LIKE :search', {
        search: `%${search}%`,
      });
    }
    queryBuilder.orderBy('subscriber.created_at', 'DESC');
    const paginatedResult = await paginate<Subscriber>(queryBuilder, {
      page,
      limit,
    });
    if (!paginatedResult.items.length) {
      throw new NotFoundException('No Subscribers found');
    }
    return paginatedResult;
  }

  // findOne(id: string) {
  //   return this.subscriberRepository.findOneBy({ id });
  // }

  async update(id: string, updateSubscriberDto: UpdateSubscriberDto) {
    const subscriber = await this.subscriberRepository.findOneBy({ id });
    if (!subscriber) {
      throw new NotFoundException('Subscriber not found');
    }
    Object.assign(subscriber, updateSubscriberDto);
    subscriber.updated_at = new Date();
    return this.subscriberRepository.save(subscriber);
  }

  async remove(id: string) {
    const subscriber = await this.subscriberRepository.findOneBy({ id });
    if (!subscriber) {
      throw new NotFoundException('Subscriber not found');
    }
    const result = await this.subscriberRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Subscriber with ID ${id} not found`);
    }
    return {
      message: `Subscriber with Email: ${subscriber.email} successfully deleted`,
    };
  }
}
