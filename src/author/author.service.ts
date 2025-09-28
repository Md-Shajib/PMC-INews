import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/enum/role.enume';
import { paginate ,IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class AuthorService {

  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,

    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Author>> {
    return paginate<Author>(this.authorRepository, options);
  }

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    try{
      const authorEmail = createAuthorDto.email;

      const isUser = await this.userRepository.findOne({
        where: {email: authorEmail}
      })
      if(!isUser){
        throw new NotFoundException("This email is not user yet");
      }
      isUser.role = Role.Author;
      await this.userRepository.save(isUser);

      const newAuthor = this.authorRepository.create(createAuthorDto);
      const saveAuthor = await this.authorRepository.save(newAuthor);
      return saveAuthor as Author;
    }catch(error){
      if (error.code === '23505') { // PostgreSQL unique violation error code
        throw new ConflictException('Email already author');
      }
      throw new Error(`Failed to create post: ${error.message}`);
    }
  }

  async findAll() {
    return await this.authorRepository.find();
  }

  async findOne(author_id: string) {
    const author = await this.authorRepository.findOne({
      where: {author_id}
    })
    if(!author){
      throw new NotFoundException("Can not found author");
    }
    return author;
  }

  async countAuthor(){
    return this.authorRepository.count();
  }

  async update(author_id: string, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.findOne(author_id);
    if(!author){
      throw new NotFoundException();
    }
    Object.assign(author, updateAuthorDto);
    return await this.authorRepository.save(author)
  }

  async remove(author_id: string) {
    const author = await this.findOne(author_id);
    if(!author){
      throw new NotFoundException();
    }
    return this.authorRepository.remove(author);
  }
}
