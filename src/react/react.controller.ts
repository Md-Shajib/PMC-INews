import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReactService } from './react.service';
import { CreateReactDto } from './dto/create-react.dto';
import { UpdateReactDto } from './dto/update-react.dto';

@Controller('react')
export class ReactController {
  constructor(private readonly reactService: ReactService) {}

  @Post('add')
  create(@Body() createReactDto: CreateReactDto) {
    return this.reactService.create(createReactDto);
  }

  @Get(':post_id/react')
  findAll(@Param('post_id') post_id: string) {
    return this.reactService.findAll(post_id);
  }

  @Get(':post_id/:user_id/react')
  findOne(
    @Param('post_id') post_id: string,
    @Param('user_id') user_id: string,
  ) {
    return this.reactService.findOne(post_id, user_id);
  }

  @Patch(':post_id/:user_id/update')
  update(
    @Param('post_id') post_id: string,
    @Param('user_id') user_id: string,
    @Body() updateReactDto: UpdateReactDto
  ) {
    return this.reactService.update(post_id, user_id, updateReactDto);
  }

  @Delete(':post_id/:user_id/delete')
  remove(
    @Param('post_id') post_id: string,
    @Param('user_id') user_id: string,
  ) {
    return this.reactService.remove(post_id, user_id);
  }
}
