import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
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

  @Post('add')
  @Roles(Role.Admin, Role.Journalist)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get('all')
  @Roles(Role.Admin, Role.Journalist)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('count/total')
  @Roles(Role.Admin)
  countCategory() {
    return this.categoryService.countCategory();
  }

  @Get(':id/category')
  @Roles(Role.Admin, Role.Journalist)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id/update')
  @Roles(Role.Admin, Role.Journalist)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id/delete')
  @Roles(Role.Admin, Role.Journalist)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
