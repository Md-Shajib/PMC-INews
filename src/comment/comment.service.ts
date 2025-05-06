import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto, CreateReplayDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment, CommentType } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {

  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>
  ){}

  async createComment(createCommentDto: CreateCommentDto):Promise<Comment> {
    try{
      const newComment = this.commentRepository.create(createCommentDto);
      const saveComment = await this.commentRepository.save(newComment);
      return saveComment as Comment;
    }catch(error){
      throw new Error(`Failed to create comment: ${error.message}`)
    }
  }

  async createReplay(createReplayDto: CreateReplayDto): Promise<Comment>{
    try{
      const replyData = {
        ...createReplayDto,
        type: CommentType.REPLY,
      };
      const newReplay = this.commentRepository.create(replyData);
      const saveReplay = await this.commentRepository.save(newReplay);
      return saveReplay as Comment;
    }catch(error){
      throw new Error(`Failed to create replay: ${error.message}`)
    }
  }

  async findAll(post_id: string) {
    return await this.commentRepository.find({
      where: {
        post_id,
        type: CommentType.COMMENT,
      }
    })
  }

  async findAllReplay(comment_id: string){
    return await this.commentRepository.find({
      where: {
        parent_id: comment_id,
      }
    })
  }

  async findOne(comment_id: string) {
    return await this.commentRepository.findOne({
      where: {id: comment_id}
    })
  }

  async update(comment_id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.findOne(comment_id);
    if(!comment){
      throw new NotFoundException();
    }
    Object.assign(comment, updateCommentDto)
    return await this.commentRepository.save(comment)
  }

  async remove(comment_id: string) {
    const comment = await this.findOne(comment_id);
    if(!comment){
      throw new NotFoundException();
    }
    return this.commentRepository.remove(comment)
  }
}
