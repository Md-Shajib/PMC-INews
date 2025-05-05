import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReactDto } from './dto/create-react.dto';
import { UpdateReactDto } from './dto/update-react.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { React } from './entities/react.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReactService {
  constructor(
    @InjectRepository(React)
    private reactRepository: Repository<React>
  ){}

  async create(createReactDto: CreateReactDto): Promise<React> {
    try{
      const newReact = this.reactRepository.create(createReactDto);
      const saveReact = await this.reactRepository.save(newReact);
      return saveReact as React;
    }catch(e){
      throw new Error(`Failed to adding react: ${e.message}`)
    }
  }

  async findAll(post_id: string) {
    return await this.reactRepository.find({
      where: {post_id}
    });
  }

  async findOne(post_id: string, user_id: string) {
    return await this.reactRepository.findOne({
      where: {user_id, post_id}
    })
  }

  async update(post_id: string, user_id: string, updateReactDto: UpdateReactDto) {
    const react = await this.findOne(post_id, user_id);
    if(!react){
      throw new NotFoundException();
    }
    Object.assign(react, updateReactDto)
    return await this.reactRepository.save(react)
  }

  async remove(post_id: string, user_id: string) {
    const react = await this.findOne(post_id, user_id);
    if(!react){
      throw new NotFoundException();
    }
    return this.reactRepository.remove(react)
  }
}