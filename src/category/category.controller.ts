import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enume';

@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(Role.Admin, Role.Journalist)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @Roles(Role.Admin)
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ): Promise<any> {
    limit = limit > 100 ? 100 : limit;
    return this.categoryService.findAll({ page, limit, search, status });
  }

  @Get('total')
  @Roles(Role.Admin, Role.Journalist)
  countCategory() {
    return this.categoryService.countCategory();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Journalist)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Journalist)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Journalist)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
