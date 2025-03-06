import { IsString, IsOptional, IsInt } from 'class-validator';

export class RefreshTokenDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsInt()
  expiresIn?: number;
}
