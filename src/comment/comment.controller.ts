import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto, CreateReplayDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiResponse } from '@nestjs/swagger';
import { CREATE_COMMENT, CREATE_REPLAY, UPDATE_COMMENT } from './responses/replay.response';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiResponse(CREATE_COMMENT)
  @Post('add')
  createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(createCommentDto);
  }

  @ApiResponse(CREATE_REPLAY)
  @Post('replay/add')
  createReplay(@Body() createReplayDto:  CreateReplayDto){
    return this.commentService.createReplay(createReplayDto);
  }

  @Get(':post_id/comments')
  findAll(@Param('post_id') post_id: string) {
    return this.commentService.findAll(post_id);
  }

  @Get(':comment_id/replies')
  findAllReplay(
    @Param('comment_id') comment_id: string
  ){
    return this.commentService.findAllReplay(comment_id);
  }

  @Get(':comment_id')
  findOne(@Param('comment_id') comment_id: string) {
    return this.commentService.findOne(comment_id);
  }

  @ApiResponse(UPDATE_COMMENT)
  @Patch(':comment_id/edit')
  update(@Param('comment_id') comment_id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(comment_id, updateCommentDto);
  }

  @Delete(':comment_id/delete')
  remove(@Param('comment_id') comment_id: string) {
    return this.commentService.remove(comment_id);
  }
}
