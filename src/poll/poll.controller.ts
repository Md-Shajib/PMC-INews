import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enume';

@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Roles(Role.Admin)
  @Post()
  createPoll(@Body() createPollDto: CreatePollDto) {
    return this.pollService.createPoll(createPollDto);
  }

  @Roles(Role.Admin)
  @Get()
  findPollList(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.pollService.findPollList( page, limit, search, status );
  }

  //Get Poll detail by ID
  @Roles(Role.Admin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollService.findOneById(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePollDto: UpdatePollDto) {
    return this.pollService.update(id, updatePollDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  deletePoll(@Param('id') id: string) {
    return this.pollService.deletePoll(id);
  }

  @Roles(Role.User, Role.Journalist, Role.Admin)
  @Post(':option_id/vote')
  vote(
    @Param('option_id') optionId: string,
    @Body('user_id') userId: string,
  ) {
    return this.pollService.vote(userId, optionId); // userId first, then optionId
  }
}
