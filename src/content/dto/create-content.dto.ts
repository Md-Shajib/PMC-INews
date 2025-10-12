
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateContentDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'header_logo_url must be a valid URL' })
  header_logo_url: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'footer_logo_url must be a valid URL' })
  footer_logo_url: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'app_qr_url must be a valid URL' })
  app_qr_url: string;

  @IsString()
  @IsNotEmpty({ message: 'Footer text is required' })
  footer_text: string;

  @IsString()
  @IsNotEmpty({ message: 'Our mission is required' })
  our_mission: string;

  @IsString()
  @IsNotEmpty({ message: 'History is required' })
  history: string;
}
