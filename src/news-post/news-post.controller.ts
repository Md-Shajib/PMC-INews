import { Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { NewsPostService } from './news-post.service';
import { CreateNewsPostDto } from './dto/create-news-post.dto';
import { UpdateNewsPostDto } from './dto/update-news-post.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enume';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';


@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Roles(Role.Admin, Role.Author)
@Controller('news-post')
export class NewsPostController {
  constructor(private readonly newsPostService: NewsPostService) {}

  @Post()
  create(@Body() createNewsPostDto: CreateNewsPostDto) {
    return this.newsPostService.create(createNewsPostDto);
  }

  @Get('all')
  findAll() {
    return this.newsPostService.findAll();
  }

  @Get('count/total')
  @Roles(Role.Admin)
  countPost(){
    return this.newsPostService.countPost()
  }

  @Get('topview/:daysAgo')
  getTopViewFromDaysAgo(@Param('daysAgo') daysAgo: number ){
    return this.newsPostService.getTopViewFromDaysAgo(daysAgo);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsPostService.findOne(id);
  }

  @Get(':authorId/count/total')
  countAuthorPost(@Param('authorId') authorId: string){
    return this.newsPostService.countAuthorPost(authorId);
  }

  @Get(':authorId/posts/all')
  authorPosts(@Param('authorId') authorId: string){
    return this.newsPostService.authorPosts(authorId);
  }

  @Get(':id/views')
  getViesw(@Param('id') id: string){
    return this.newsPostService.views(id);
  }

  @Post(':id/view/increment')
  @Roles(Role.Admin, Role.Author, Role.User)
  viewIncrement(@Param('id') id: string){
    return this.newsPostService.viewIncrement(id);
  }

  @Patch(':id/update')
  update(@Param('id') id: string, @Body() updateNewsPostDto: UpdateNewsPostDto) {
    return this.newsPostService.update(id, updateNewsPostDto);
  }

  @Delete(':id/delete')
  remove(@Param('id') id: string) {
    return this.newsPostService.remove(id);
  }
}