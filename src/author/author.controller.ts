import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ApiResponse } from '@nestjs/swagger';
import { CREATE_AUTHOR_RES } from './response/author.response';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enume';

@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post('create')
  @Roles(Role.Admin)
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get('all')
  @Roles(Role.Admin)
  findAll() {
    return this.authorService.findAll();
  }

  @Get(':author_id')
  @Roles(Role.Admin, Role.Author)
  findOne(@Param('author_id') author_id: string) {
    return this.authorService.findOne(author_id);
  }

  @Patch(':author_id/update')
  @Roles(Role.Admin, Role.Author)
  update(@Param('author_id') author_id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorService.update(author_id, updateAuthorDto);
  }

  @Delete(':author_id/delete')
  @Roles(Role.Admin, Role.Author)
  remove(@Param('author_id') author_id: string) {
    return this.authorService.remove(author_id);
  }
}
