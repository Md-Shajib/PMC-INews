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

  async views(id: string){
    const postViews = await this.newsPostRepository.findOne({
      select: ['view_count'],
      where: {id},
    })
    if(!postViews){
      throw new NotFoundException("No view yet");
    }
    return postViews;
  }

  // async viewIncrement(id: string): Promise<number | null> {
  //   const post = await this.views(id); // ✅ Await the post
  //   if (!post) return null;
  //   console.log(post)
  //   post.view_count += 1;
  //   await this.newsPostRepository.save(post); // ✅ Save the updated post
  //   return post.view_count;
  // }

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