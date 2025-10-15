import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { JournalistService } from './journalist.service';
import { CreateJournalistDto } from './dto/create-journalist.dto';
import { UpdateJournalistDto } from './dto/update-journalist.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enume';
import { User } from 'src/users/entities/user.entity';

@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Controller('journalist')
export class JournalistController {
  constructor(private readonly journalistService: JournalistService) {}

  // create journalist api
  @Post()
  @Roles(Role.Admin)
  create(@Body() createJournalistDto: CreateJournalistDto) {
    return this.journalistService.create(createJournalistDto);
  }

  // get all journalist api
  @Get()
  @Roles(Role.Admin)
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.journalistService.paginateFindAll(page, limit, search);
  }

  @Get('minimal')
  @Roles(Role.Admin)
  findAllMinimal() {
    return this.journalistService.findAllMinimal();
  }

  // get total journalist api
  @Get('/total')
  @Roles(Role.Admin)
  countJournalist() {
    const totalJournalist = this.journalistService.countJournalist();
    return totalJournalist;
  }

  // get journalist by id api
  @Get(':id')
  @Roles(Role.Admin, Role.Journalist)
  findOne(@Param('id') id: string) {
    return this.journalistService.findOne(id);
  }

  // update journalist by id api
  @Patch(':id')
  @Roles(Role.Admin, Role.Journalist)
  update(@Param('id') id: string, @Body() updateJournalistDto: UpdateJournalistDto) {
    return this.journalistService.update(id, updateJournalistDto);
  }

  // delete journalist by id api
  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.journalistService.remove(id);
  }
}
