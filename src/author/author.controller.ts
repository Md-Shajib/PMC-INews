import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ApiResponse } from '@nestjs/swagger';
import { CREATE_AUTHOR_RES } from './response/author.response';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enume';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Author } from './entities/author.entity';

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
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit : number = 10,
  ): Promise<Pagination<Author>> {
    limit = limit > 100 ? 100 : limit;
    return this.authorService.paginate({page, limit});
  }

  @Get('count/total')
  @Roles(Role.Admin)
  countAuthor(){
    const totalAuthor = this.authorService.countAuthor();
    return totalAuthor;
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
