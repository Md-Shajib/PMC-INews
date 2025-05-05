import { PartialType } from '@nestjs/swagger';
import { CreateReactDto } from './create-react.dto';

export class UpdateReactDto extends PartialType(CreateReactDto) {}
