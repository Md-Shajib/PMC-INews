import { PartialType } from '@nestjs/swagger';
import { CreateTeamMemberDto } from './create-team-member.dto';

export class UpdateTeamMemberDto extends PartialType(CreateTeamMemberDto) {}
