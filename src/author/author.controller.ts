import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ApiResponse } from '@nestjs/swagger';
import { CREATE_AUTHOR_RES } from './response/author.response';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @ApiResponse(CREATE_AUTHOR_RES)
  @Post('create')
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get('all')
  findAll() {
    return this.authorService.findAll();
  }

  @Get(':author_id')
  findOne(@Param('author_id') author_id: string) {
    return this.authorService.findOne(author_id);
  }

  @Patch(':author_id/update')
  update(@Param('author_id') author_id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorService.update(author_id, updateAuthorDto);
  }

  @Delete(':author_id/delete')
  remove(@Param('author_id') author_id: string) {
    return this.authorService.remove(author_id);
  }
}
