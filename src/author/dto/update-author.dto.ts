import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateAuthorDto } from './create-author.dto';

export class UpdateAuthorDto extends PartialType(OmitType(CreateAuthorDto, ['email'] as const)) {}
