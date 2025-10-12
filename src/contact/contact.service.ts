import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Contact>> {
    return paginate<Contact>(this.contactRepository, options);
  }

  async create(createContactDto: CreateContactDto) {
    try {
      const contact = this.contactRepository.create(createContactDto);
      return this.contactRepository.save(contact);
    } catch (error) {
      throw new Error('Error creating contact form: ' + error.message);
    }
  }

  async findAll({
    page = 1,
    limit = 10,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<Pagination<Contact>> {
    const queryBuilder = this.contactRepository.createQueryBuilder('contact');
    queryBuilder.orderBy('contact.created_at', 'DESC');
    if (search) {
      queryBuilder.andWhere(
        '(contact.email ILIKE :search OR contact.title ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    queryBuilder.orderBy('contact.created_at', 'DESC');
    const paginatedResult = await paginate<Contact>(queryBuilder, {
      page,
      limit,
    });
    if (!paginatedResult.items.length) {
      throw new Error('No Contacts found');
    }
    return paginatedResult;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} contact`;
  // }

  async update(id: string, updateContactDto: UpdateContactDto) {
    const contact = await this.contactRepository.findOneBy({ id });
    if (!contact) {
      throw new Error('Contact not found');
    }
    Object.assign(contact, updateContactDto);
    return this.contactRepository.save(contact);
  }

  async remove(id: string) {
    const contact = await this.contactRepository.findOneBy({ id });
    if (!contact) {
      throw new Error('Contact not found');
    }
    const result = await this.contactRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Error deleting contact');
    }
    return { message: 'Contact deleted successfully with email: ' + contact.email };
  }
}
