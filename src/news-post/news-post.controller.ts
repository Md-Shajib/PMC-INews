import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NewsPostService } from './news-post.service';
import { CreateNewsPostDto } from './dto/create-news-post.dto';
import { UpdateNewsPostDto } from './dto/update-news-post.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/enum/role.enume';
import { AuthGuard } from 'src/auth/auth.guard';


@UseGuards(AuthGuard)
@Controller('news-post')
export class NewsPostController {
  constructor(private readonly newsPostService: NewsPostService) {}

  @Post()
  @Roles(Role.Author)
  create(@Body() createNewsPostDto: CreateNewsPostDto) {
    console.log();
    
    return this.newsPostService.create(createNewsPostDto);
  }

  @Get('all')
  findAll() {
    return this.newsPostService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsPostService.findOne(id);
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