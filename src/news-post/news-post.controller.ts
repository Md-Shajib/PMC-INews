import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NewsPostService } from './news-post.service';
import { CreateNewsPostDto } from './dto/create-news-post.dto';
import { UpdateNewsPostDto } from './dto/update-news-post.dto';

@Controller('news-post')
export class NewsPostController {
  constructor(private readonly newsPostService: NewsPostService) {}

  @Post()
  create(@Body() createNewsPostDto: CreateNewsPostDto) {
    return this.newsPostService.create(createNewsPostDto);
  }

  @Get()
  findAll() {
    return this.newsPostService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsPostService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsPostDto: UpdateNewsPostDto) {
    return this.newsPostService.update(id, updateNewsPostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsPostService.remove(id);
  }
}