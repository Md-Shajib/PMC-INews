import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TeamMemberService } from './team-member.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Public, Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enume';

@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Controller('team-member')
export class TeamMemberController {
  constructor(private readonly teamMemberService: TeamMemberService) {}

  @Roles(Role.Admin)
  @Post()
  create(@Body() createTeamMemberDto: CreateTeamMemberDto) {
    return this.teamMemberService.create(createTeamMemberDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.teamMemberService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.teamMemberService.findOne(+id);
  // }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamMemberDto: UpdateTeamMemberDto) {
    return this.teamMemberService.update(id, updateTeamMemberDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamMemberService.remove(id);
  }
}
