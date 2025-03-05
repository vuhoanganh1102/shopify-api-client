import { PartialType } from '@nestjs/mapped-types';
import { CreateFacebookMemberTokenDto } from './create-facebook-member-token.dto';

export class UpdateFacebookMemberTokenDto extends PartialType(
  CreateFacebookMemberTokenDto,
) {}
