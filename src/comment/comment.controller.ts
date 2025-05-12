import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto, CreateReplayDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiResponse } from '@nestjs/swagger';
import { CREATE_COMMENT, CREATE_REPLAY, UPDATE_COMMENT } from './responses/replay.response';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enume';

@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiResponse(CREATE_COMMENT)
  @Post('add')
  @Roles(Role.Admin, Role.Author, Role.User)
  createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(createCommentDto);
  }

  @ApiResponse(CREATE_REPLAY)
  @Post('replay/add')
  @Roles(Role.Admin, Role.Author, Role.User)
  createReplay(@Body() createReplayDto:  CreateReplayDto){
    return this.commentService.createReplay(createReplayDto);
  }

  @Get(':post_id/comments')
  @Roles(Role.Admin, Role.Author, Role.User)
  findAll(@Param('post_id') post_id: string) {
    return this.commentService.findAll(post_id);
  }

  @Get(':comment_id/replies')
  @Roles(Role.Admin, Role.Author, Role.User)
  findAllReplay(
    @Param('comment_id') comment_id: string
  ){
    return this.commentService.findAllReplay(comment_id);
  }

  @Get(':comment_id')
  @Roles(Role.Admin, Role.Author, Role.User)
  findOne(@Param('comment_id') comment_id: string) {
    return this.commentService.findOne(comment_id);
  }

  @ApiResponse(UPDATE_COMMENT)
  @Patch(':comment_id/edit')
  @Roles(Role.Admin, Role.Author, Role.User)
  update(@Param('comment_id') comment_id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(comment_id, updateCommentDto);
  }

  @Delete(':comment_id/delete')
  @Roles(Role.Admin, Role.Author, Role.User)
  remove(@Param('comment_id') comment_id: string) {
    return this.commentService.remove(comment_id);
  }
}
