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
import { NewsPostService } from './news-post.service';
import { CreateNewsPostDto } from './dto/create-news-post.dto';
import { UpdateNewsPostDto } from './dto/update-news-post.dto';
import { Public, Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enume';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { NewsPost } from './entities/news-post.entity';

@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Roles(Role.Admin, Role.Journalist)
@Controller('news')
export class NewsPostController {
  constructor(private readonly newsPostService: NewsPostService) {}

  @Post()
  create(@Body() createNewsPostDto: CreateNewsPostDto) {
    return this.newsPostService.create(createNewsPostDto);
  }

  @Public()
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<NewsPost>> {
    limit = limit > 100 ? 100 : limit; // optional max limit safeguard
    return this.newsPostService.paginate({ page, limit });
  }

  // admin (all published)
  @Get('published')
  @Roles(Role.Admin)
  async findAllPublished(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit; // safety check
    return this.newsPostService.paginatePublished('published', { page, limit });
  }

  // admin (all drafts)
  @Get('draft')
  @Roles(Role.Admin)
  async findAllDrafts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit; // safety check
    return this.newsPostService.paginatePublished('draft', { page, limit });
  }

  // admin (all archived)
  // @Get('archived')
  // @Roles(Role.Admin)
  // async findAllArchived(
  //   @Query('page') page: number = 1,
  //   @Query('limit') limit: number = 10,
  // ) {
  //   limit = limit > 100 ? 100 : limit; // safety check
  //   return this.newsPostService.paginatePublished('archived', { page, limit });
  // }

   // admin (all archived)
  @Get('banned')
  @Roles(Role.Admin)
  async findAllBanned(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit; // safety check
    return this.newsPostService.paginatePublished('banned', { page, limit });
  }

  @Get('total')
  @Roles(Role.Admin)
  countPost() {
    return this.newsPostService.countPost();
  }

  @Get('topview/:daysAgo')
  getTopViewFromDaysAgo(@Param('daysAgo') daysAgo: number) {
    return this.newsPostService.getTopViewFromDaysAgo(daysAgo);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsPostService.findOne(id);
  }

  @Get(':authorId/count/total')
  countAuthorPost(@Param('authorId') authorId: string) {
    return this.newsPostService.countAuthorPost(authorId);
  }

  @Get(':authorId/posts/all')
  authorPosts(@Param('authorId') authorId: string) {
    return this.newsPostService.journalistPosts(authorId);
  }

  @Get(':id/views')
  getViesw(@Param('id') id: string) {
    return this.newsPostService.views(id);
  }

  @Post(':id/view/increment')
  @Roles(Role.Admin, Role.Journalist, Role.User)
  viewIncrement(@Param('id') id: string) {
    return this.newsPostService.viewIncrement(id);
  }

  @Patch(':id/update')
  update(
    @Param('id') id: string,
    @Body() updateNewsPostDto: UpdateNewsPostDto,
  ) {
    return this.newsPostService.update(id, updateNewsPostDto);
  }

  @Delete(':id/delete')
  remove(@Param('id') id: string) {
    return this.newsPostService.remove(id);
  }
}
