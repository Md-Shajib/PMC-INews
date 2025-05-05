import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ){}

  async create(createCategoryDto: CreateCategoryDto):Promise<Category> {
    try{
      const newCategory = this.categoryRepository.create(createCategoryDto);
      const saveCategory = await this.categoryRepository.save(newCategory);
      return saveCategory as Category;
    }catch(e){
      if (e.code === '23505') {
        throw new ConflictException('This category already exists');
      }
      throw new Error(`Failed to create post: ${e.message}`)
    }
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne(id: string) {
    return await this.categoryRepository.findOne({
      where: {id}
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    if(!category){
      throw new NotFoundException();
    }
    Object.assign(category, updateCategoryDto)
    return await this.categoryRepository.save(category)
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    if(!category){
      throw new NotFoundException();
    }
    return this.categoryRepository.remove(category);
  }
}
