import { Injectable } from '@nestjs/common';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamMember } from './entities/team-member.entity';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class TeamMemberService {
  constructor(
    @InjectRepository(TeamMember)
    private teamMemberRepository: Repository<TeamMember>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<TeamMember>> {
    return paginate<TeamMember>(this.teamMemberRepository, options);
  }
  
  async create(createTeamMemberDto: CreateTeamMemberDto) {
    try {
      const teamMember = this.teamMemberRepository.create(createTeamMemberDto);
      return await this.teamMemberRepository.save(teamMember);
    } catch (error) {
      throw new Error('Error creating team member');
    }
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<Pagination<TeamMember>> {
    const queryBuilder = this.teamMemberRepository.createQueryBuilder('team_member');
    queryBuilder.orderBy('team_member.created_at', 'DESC');
    const paginatedResult = await paginate<TeamMember>(queryBuilder, {
      page,
      limit,
    });
    if (!paginatedResult.items.length) {
      throw new Error('No Team Members found');
    }
    return paginatedResult;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} teamMember`;
  // }

  async update(id: string, updateTeamMemberDto: UpdateTeamMemberDto) {
    const teamMember = await this.teamMemberRepository.findOne({ where: { id } });
    if (!teamMember) {
      throw new Error('Team Member not found');
    }
    Object.assign(teamMember, updateTeamMemberDto);
    return this.teamMemberRepository.save(teamMember);
  }

  async remove(id: string) {
    const teamMember = await this.teamMemberRepository.findOne({ where: { id } });
    if (!teamMember) {
      throw new Error('Team Member not found');
    }
    const result = await this.teamMemberRepository.delete(id);
    if (!result.affected) {
      throw new Error('Team Member not found');
    }
    return { message: 'Team Member deleted successfully with Name: ' + teamMember.name };
  }
}
