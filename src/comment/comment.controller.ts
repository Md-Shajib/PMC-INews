import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto, CreateReplayDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiResponse } from '@nestjs/swagger';
import {
  CREATE_COMMENT,
  CREATE_REPLAY,
  UPDATE_COMMENT,
} from './responses/replay.response';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Public, Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enume';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // @ApiResponse(CREATE_COMMENT)
  @Post()
  @Roles(Role.Admin, Role.Journalist, Role.User)
  createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(createCommentDto);
  }

  // @ApiResponse(CREATE_REPLAY)
  @Post('replay')
  @Roles(Role.Admin, Role.Journalist, Role.User)
  createReplay(@Body() createReplayDto: CreateReplayDto) {
    return this.commentService.createReplay(createReplayDto);
  }

  @Get(':news_id/c')
  @Roles(Role.Admin, Role.Journalist, Role.User)
  findAllComments(
    @Param('news_id') news_id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ) {
    return this.commentService.findAllComments(news_id, page, limit, search);
  }

  @Get(':news_id/r')
  @Roles(Role.Admin)
  findAllReplay(
    @Param('news_id') news_id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ){
    return this.commentService.findAllReplay(news_id, page, limit, search);
  }

  @Public()
  @Get(':news_id/cr')
  findAllCommentAndReplay(
    @Param('news_id') news_id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ) {
    return this.commentService.findAllCommentAndReplay( news_id, page, limit, search );
  }

  @Get(':comment_id/c/r')
  @Roles(Role.Admin, Role.Journalist, Role.User)
  findAllReplayOfComment(@Param('comment_id') comment_id: string) {
    return this.commentService.findAllReplayOfComment(comment_id);
  }

  @Get(':comment_id')
  @Roles(Role.Admin, Role.Journalist, Role.User)
  findOne(@Param('comment_id') comment_id: string) {
    return this.commentService.findOne(comment_id);
  }

  @Patch(':comment_id')
  @Roles(Role.Admin, Role.Journalist, Role.User)
  update(
    @Param('comment_id') comment_id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.commentService.update(comment_id, updateCommentDto, currentUser);
  }

  @Delete(':comment_id')
  @Roles(Role.Admin, Role.Journalist, Role.User)
  remove(@Param('comment_id') comment_id: string) {
    return this.commentService.remove(comment_id);
  }
}
