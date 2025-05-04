import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsPostDto } from './dto/create-news-post.dto';
import { UpdateNewsPostDto } from './dto/update-news-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsPost } from './entities/news-post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NewsPostService {

  constructor(
    @InjectRepository(NewsPost)
    private newsPostRepository: Repository<NewsPost>
  ){}

  async create(createNewsPostDto: CreateNewsPostDto): Promise<NewsPost> {
    try{
      const newPost = this.newsPostRepository.create(createNewsPostDto);
      const savedPost = await this.newsPostRepository.save(newPost);
      return savedPost as NewsPost;
    }catch(error){
      throw new Error(`Failed to create post: ${error.message}`)
    }
  }

  async findAll() {
    return await this.newsPostRepository.find();
  }

  async findOne(id: string) {
    return await this.newsPostRepository.findOne({
      where: {id}
    });
  }

  async update(id: string, updateNewsPostDto: UpdateNewsPostDto) {
    const post = await this.findOne(id);
    if(!post){
      throw new NotFoundException();
    }
    Object.assign(post, updateNewsPostDto);
    return await this.newsPostRepository.save(post);
  }

  async remove(id: string) {
    const post = await this.findOne(id);
    if(!post){
      throw new NotFoundException();
    }
    return this.newsPostRepository.remove(post);
  }
}