import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto, CreateReplayDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment, CommentStatus, CommentType } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Role } from 'src/auth/enum/role.enume';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      const newComment = this.commentRepository.create(createCommentDto);
      const saveComment = await this.commentRepository.save(newComment);
      return saveComment as Comment;
    } catch (error) {
      throw new Error(`Failed to create comment: ${error.message}`);
    }
  }

  async createReplay(createReplayDto: CreateReplayDto): Promise<Comment> {
    try {
      const replyData = {
        ...createReplayDto,
        type: CommentType.REPLAY,
      };
      const newReplay = this.commentRepository.create(replyData);
      const saveReplay = await this.commentRepository.save(newReplay);
      return saveReplay as Comment;
    } catch (error) {
      throw new Error(`Failed to create replay: ${error.message}`);
    }
  }

  async findAllComments(
    news_id: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const query = this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.news_id = :news_id', { news_id })
      .andWhere('comment.type = :type', { type: CommentType.COMMENT });

    if (search) {
      query.andWhere('comment.comment ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [comments, total] = await query
      .orderBy('comment.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    if (!comments || comments.length === 0) {
      throw new NotFoundException(
        'No comments found for this news id: ' + news_id,
      );
    }

    return {
      data: comments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllReplay(
    news_id: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const query = this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.news_id = :news_id', { news_id })
      .andWhere('comment.type = :type', { type: CommentType.REPLAY });

    if (search) {
      query.andWhere('comment.comment ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [replies, total] = await query
      .orderBy('comment.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    if (!replies || replies.length === 0) {
      throw new NotFoundException(
        'No replies found for this news id: ' + news_id,
      );
    }

    return {
      data: replies,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllCommentAndReplay(
    news_id: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    // Step 1: Fetch all active comments
    const query = this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.news_id = :news_id', { news_id })
      .andWhere('comment.status = :status', { status: CommentStatus.ACTIVE })
      .andWhere('comment.type = :type', { type: CommentType.COMMENT });

    if (search) {
      query.andWhere('comment.comment ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [comments, total] = await query
      .orderBy('comment.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    if (!comments || comments.length === 0) {
      throw new NotFoundException(
        'No comments or replies found for this news id: ' + news_id,
      );
    }

    // Step 2: Get all active replies for the fetched comments
    const parentIds = comments.map((c) => c.id);
    const replies = await this.commentRepository
      .createQueryBuilder('reply')
      .where('reply.parent_id IN (:...parentIds)', { parentIds })
      .andWhere('reply.status = :status', { status: CommentStatus.ACTIVE })
      .andWhere('reply.type = :type', { type: CommentType.REPLAY })
      .orderBy('reply.created_at', 'ASC')
      .getMany();

    // Step 3: Group replies under their parent comment
    const commentsWithReplies = comments.map((comment) => {
      const commentReplies = replies.filter(
        (reply) => reply.parent_id === comment.id,
      );
      return {
        id: comment.id,
        comment: comment.comment,
        created_at: comment.created_at,
        Replies: commentReplies.map((r) => ({
          id: r.id,
          comment: r.comment,
          created_at: r.created_at,
        })),
      };
    });

    // Step 4: Return structured response with pagination
    return {
      data: commentsWithReplies,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllReplayOfComment(comment_id: string) {
    return await this.commentRepository.find({
      where: {
        parent_id: comment_id,
      },
    });
  }

  async findOne(comment_id: string) {
    return await this.commentRepository.findOne({
      where: { id: comment_id },
    });
  }

  async update(
    comment_id: string,
    updateCommentDto: UpdateCommentDto,
    currentUser: any,
  ) {
    const comment = await this.findOne(comment_id);
    delete updateCommentDto.type;
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (currentUser.role !== Role.Admin) {
      delete updateCommentDto.status;
    }
    Object.assign(comment, updateCommentDto);
    return await this.commentRepository.save(comment);
  }

  async remove(comment_id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id: comment_id },
      relations: ['replies'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.parent_id) {
      await this.commentRepository.delete(comment_id);
      return { message: 'Reply deleted successfully' };
    }
    const msg = await this.commentRepository.delete(comment_id);
    return { message: 'Comment and its replies deleted successfully', details: msg }
  }
}
