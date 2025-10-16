import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateNewsPostDto,
  CreateViewLogDto,
  NewsStatus,
} from './dto/create-news-post.dto';
import { UpdateNewsPostDto } from './dto/update-news-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsPost } from './entities/news-post.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import {
  paginate,
  IPaginationOptions,
  Pagination,
} from 'nestjs-typeorm-paginate';
import {
  Journalist,
  JournalistStatus,
} from 'src/journalist/entities/journalist.entity';
import { User, UserStatus } from 'src/users/entities/user.entity';
import { ViewLog } from './entities/view-logs.entity';

@Injectable()
export class NewsPostService {
  constructor(
    @InjectRepository(NewsPost)
    private newsPostRepository: Repository<NewsPost>,

    @InjectRepository(Journalist)
    private journalistRepository: Repository<Journalist>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(ViewLog)
    private viewLogRepository: Repository<ViewLog>,
  ) {}

  async paginateFindAll(
    page = 1,
    limit = 10,
    search?: string,
    status?: string,
  ): Promise<{
    data: any[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const skip = (page - 1) * limit;

    const query = this.newsPostRepository
      .createQueryBuilder('news_post')
      .leftJoin('news_post.journalist', 'journalist')
      .loadRelationCountAndMap('news_post.comment_count', 'news_post.comments')
      .loadRelationCountAndMap('news_post.review_count', 'news_post.reviews')
      .select([
        'news_post.id',
        'news_post.category_id',
        'news_post.journalist_id',
        'news_post.news_type',
        'news_post.news_title',
        'news_post.news_body',
        'news_post.media_link',
        'news_post.views',
        'news_post.status',
        'news_post.created_at',
        'news_post.updated_at',
      ])
      .addSelect([
        'journalist.name',
        'journalist.email',
        'journalist.image_url',
        'journalist.status',
      ])
      .orderBy('news_post.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      query.andWhere(
        '(news_post.news_title ILIKE :search OR news_post.news_body ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      query.andWhere('news_post.status = :status', { status });
    }

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
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

  async createViewLog(createViewLogDto: CreateViewLogDto): Promise<any> {
    let result: any = null;
    const { news_id, user_id } = createViewLogDto;
    if (!news_id) {
      throw new NotFoundException('News ID is required to log a view.');
    }

    const newsPost = await this.newsPostRepository.findOne({
      where: { id: createViewLogDto.news_id },
    });

    if (!newsPost) {
      throw new NotFoundException('News post not found.');
    }

    if (user_id) {
      const user = await this.userRepository.findOne({
        where: { id: user_id },
      });
      if (!user) {
        throw new NotFoundException('User not found.');
      }

      const logs = await this.viewLogRepository.findOne({
        where: { news_id, user_id },
      });

      if (logs) {
        throw new NotFoundException('View already logged for this user.');
      }

      const viewLog = this.viewLogRepository.create(createViewLogDto);
      result = await this.viewLogRepository.save(viewLog);

      user.views += 1;
      await this.userRepository.save(user);
    }

    newsPost.views += 1;
    await this.newsPostRepository.save(newsPost);

    if (!result) {
      result = { message: 'View logged for anonymous user.' };
    }

    return result;
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

  async dashboardStatistics(year: number) {
    // Basic counts
    const [
      totalNews,
      totalActiveNews,
      totalBannedNews,
      totalJournalists,
      totalBannedJournalists,
      totalUsers,
      totalBannedUsers,
    ] = await Promise.all([
      this.newsPostRepository.count(),
      this.newsPostRepository.count({
        where: { status: NewsStatus.PUBLISHED },
      }),
      this.newsPostRepository.count({ where: { status: NewsStatus.BANNED } }),
      this.journalistRepository.count(),
      this.journalistRepository.count({
        where: { status: JournalistStatus.BANNED },
      }),
      this.userRepository.count(),
      this.userRepository.count({ where: { status: UserStatus.BANNED } }),
    ]);

    // News statistics over the past 12 months
    const newsStats = await this.newsPostRepository
      .createQueryBuilder('news_post')
      .select(
        `TO_CHAR(DATE_TRUNC('month', news_post.created_at), 'YYYY-MM')`,
        'date',
      )
      .addSelect('COUNT(*)', 'total_posts')
      .where(`news_post.created_at >= NOW() - INTERVAL '12 months'`)
      .groupBy(`DATE_TRUNC('month', news_post.created_at)`)
      .orderBy(`DATE_TRUNC('month', news_post.created_at)`, 'ASC')
      .getRawMany();

    // Map results to ensure all 12 months are represented
    const newsStatistics = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      const monthKey = date.toISOString().slice(0, 7); // 'YYYY-MM'
      const monthData = newsStats.find((stat) => stat.date === monthKey);
      return {
        month: monthKey,
        total_posts: monthData ? parseInt(monthData.total_posts, 10) : 0,
      };
    });

    // Views statistics over the past 12 months or for the specified year
    // Create the base query
    const viewsQuery = this.newsPostRepository
      .createQueryBuilder('news_post')
      .select(
        `TO_CHAR(DATE_TRUNC('month', news_post.created_at), 'YYYY-MM')`,
        'date',
      )
      .addSelect('SUM(news_post.views)', 'total_views');
    // Apply year filter if provided
    if (year) {
      viewsQuery.where(`EXTRACT(YEAR FROM news_post.created_at) = :year`, {
        year,
      });
    } else {
      viewsQuery.where(`news_post.created_at >= NOW() - INTERVAL '12 months'`);
    }

    // Fetch the data
    const viewsStats = await viewsQuery
      .groupBy(`DATE_TRUNC('month', news_post.created_at)`)
      .orderBy(`DATE_TRUNC('month', news_post.created_at)`, 'ASC')
      .getRawMany();

    // Month keys for the specified year or past 12 months
    const months = year
      ? Array.from(
          { length: 12 },
          (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`,
        )
      : Array.from({ length: 12 }, (_, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - (11 - i));
          return d.toISOString().slice(0, 7); // YYYY-MM
        });

    // Map results to ensure all 12 months are represented
    const viewsStatistics = months.map((monthKey) => {
      const found = viewsStats.find((v) => v.date === monthKey);
      return {
        date: monthKey,
        total_views: found ? parseInt(found.total_views, 10) : 0,
      };
    });

    return {
      totalNews,
      totalActiveNews,
      totalBannedNews,
      totalJournalists,
      totalBannedJournalists,
      totalUsers,
      totalBannedUsers,
      newsStatistics,
      viewsStatistics,
    };
  }

  async paginatePublished(
    status: string,
    options: IPaginationOptions,
  ): Promise<Pagination<NewsPost>> {
    const queryBuilder = this.newsPostRepository.createQueryBuilder('news');
    // Use alias `news` here
    queryBuilder.where('news.status = :status', { status });
    // Order by post_date or created column
    queryBuilder.orderBy('news.created_at', 'DESC');
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
