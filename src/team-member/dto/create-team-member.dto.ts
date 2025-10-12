import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { MemberStatus, TeamRole } from '../entities/team-member.entity';

export class CreateTeamMemberDto {
  @IsOptional()
  @IsUrl({}, { message: 'image_url must be a valid URL' })
  image_url?: string;

  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email?: string;

  @IsEnum(TeamRole, {
    message: 'role must be one of: editor, publisher, or moderator',
  })
  @IsOptional()
  role?: TeamRole;

  @IsEnum(MemberStatus, {
    message: 'status must be one of: active or inactive',
  })
  @IsOptional()
  status?: MemberStatus;

  @IsOptional()
  @IsUrl({}, { message: 'facebook_url must be a valid URL' })
  facebook_url?: string;

  @IsOptional()
  @IsUrl({}, { message: 'twitter_url must be a valid URL' })
  twitter_url?: string;

  @IsOptional()
  @IsUrl({}, { message: 'youTube_url must be a valid URL' })
  youTube_url?: string;

  @IsOptional()
  @IsUrl({}, { message: 'linkedin_url must be a valid URL' })
  linkedin_url?: string;
}
