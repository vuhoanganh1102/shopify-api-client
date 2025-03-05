import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateFacebookMemberTokenDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsInt()
  expiresIn?: number;
}
