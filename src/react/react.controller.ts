import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReactService } from './react.service';
import { CreateReactDto } from './dto/create-react.dto';
import { UpdateReactDto } from './dto/update-react.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enume';

@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Controller('react')
export class ReactController {
  constructor(private readonly reactService: ReactService) {}

  @Post('add')
  @Roles( Role.Admin, Role.Author, Role.User )
  create(@Body() createReactDto: CreateReactDto) {
    return this.reactService.create(createReactDto);
  }

  @Get(':post_id/react')
  @Roles( Role.Admin, Role.Author, Role.User )
  findAll(@Param('post_id') post_id: string) {
    return this.reactService.findAll(post_id);
  }

  @Get(':post_id/:user_id/react')
  @Roles( Role.Admin, Role.Author, Role.User )
  findOne(
    @Param('post_id') post_id: string,
    @Param('user_id') user_id: string,
  ) {
    return this.reactService.findOne(post_id, user_id);
  }

  @Patch(':post_id/:user_id/update')
  @Roles( Role.Admin, Role.Author, Role.User )
  update(
    @Param('post_id') post_id: string,
    @Param('user_id') user_id: string,
    @Body() updateReactDto: UpdateReactDto
  ) {
    return this.reactService.update(post_id, user_id, updateReactDto);
  }

  @Delete(':post_id/:user_id/delete')
  @Roles( Role.Admin, Role.Author, Role.User )
  remove(
    @Param('post_id') post_id: string,
    @Param('user_id') user_id: string,
  ) {
    return this.reactService.remove(post_id, user_id);
  }
}
