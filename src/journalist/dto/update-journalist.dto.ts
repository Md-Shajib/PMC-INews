import { PartialType } from '@nestjs/swagger';
import { CreateJournalistDto } from './create-journalist.dto';

export class UpdateJournalistDto extends PartialType(CreateJournalistDto) {}
