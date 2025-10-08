import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsPostDto } from './dto/create-news-post.dto';
import { UpdateNewsPostDto } from './dto/update-news-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsPost } from './entities/news-post.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import {
  paginate,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class NewsPostService {
  constructor(
    @InjectRepository(NewsPost)
    private newsPostRepository: Repository<NewsPost>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<NewsPost>> {
    return paginate<NewsPost>(this.newsPostRepository, options);
  }

  async create(createNewsPostDto: CreateNewsPostDto): Promise<NewsPost> {
    try {
      const newPost = this.newsPostRepository.create(createNewsPostDto);
      const savedPost = await this.newsPostRepository.save(newPost);
      return savedPost as NewsPost;
    } catch (error) {
      throw new Error(`Failed to create post: ${error.message}`);
    }
  }

  async findAll() {
    return await this.newsPostRepository.find();
  }

  async findOne(id: string) {
    return await this.newsPostRepository.findOne({
      where: { id },
    });
  }

  async countPost() {
    const totalPost = this.newsPostRepository.count();
    if (!totalPost) {
      throw new NotFoundException('No post yet!');
    }
    return totalPost;
  }

  async views(id: string) {
    const postViews = await this.newsPostRepository.findOne({
      select: ['views'],
      where: { id },
    });
    if (!postViews) {
      throw new NotFoundException('No view yet');
    }
    return postViews;
  }

  async viewIncrement(id: string): Promise<number | null> {
    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    post.views += 1;
    await this.newsPostRepository.save(post);
    return post.views;
  }

  async countAuthorPost(journalistId: string) {
    const totalPosts = await this.newsPostRepository.count({
      where: { journalist_id: journalistId },
    });
    if (!totalPosts) {
      throw new NotFoundException('No post yet!');
    }
    return totalPosts;
  }

  async paginatePublished(
    status: string,
    options: IPaginationOptions,
  ): Promise<Pagination<NewsPost>> {
    const queryBuilder = this.newsPostRepository.createQueryBuilder('news');
    // Use alias `news` here
    queryBuilder.where('news.news_status = :status', { status });
    // Order by post_date or created column
    queryBuilder.orderBy('news.post_date', 'DESC');
    return paginate<NewsPost>(queryBuilder, options);
  }

  async journalistPosts(journalistId: string) {
    const posts = await this.newsPostRepository.find({
      where: { journalist_id: journalistId },
    });
    if (!posts) {
      throw new NotFoundException('No post yet!');
    }
    return posts;
  }

  async getTopViewFromDaysAgo(daysAgo: number) {
    daysAgo = Number(daysAgo);
    if (typeof daysAgo !== 'number' || isNaN(daysAgo)) {
      throw new Error('Invalid daysAgo value');
    }
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - daysAgo);
    return await this.newsPostRepository.findOne({
      where: {
        created_at: MoreThanOrEqual(fromDate),
      },
      order: { views: 'DESC' },
    });
  }

  async update(id: string, updateNewsPostDto: UpdateNewsPostDto) {
    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException();
    }
    Object.assign(post, updateNewsPostDto);
    return await this.newsPostRepository.save(post);
  }

  async remove(id: string) {
    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException();
    }
    return this.newsPostRepository.remove(post);
  }
}
