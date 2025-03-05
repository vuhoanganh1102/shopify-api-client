import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FacebookMemberTokenService } from './facebook-member-token.service';
import { CreateFacebookMemberTokenDto } from './dto/create-facebook-member-token.dto';
import { UpdateFacebookMemberTokenDto } from './dto/update-facebook-member-token.dto';

@Controller('facebook-member-token')
export class FacebookMemberTokenController {
  constructor(
    private readonly facebookMemberTokenService: FacebookMemberTokenService,
  ) {}

  @Post()
  create(@Body() createFacebookMemberTokenDto: CreateFacebookMemberTokenDto) {
    return this.facebookMemberTokenService.create(createFacebookMemberTokenDto);
  }

  @Get()
  findAll() {
    return this.facebookMemberTokenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facebookMemberTokenService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFacebookMemberTokenDto: UpdateFacebookMemberTokenDto,
  ) {
    return this.facebookMemberTokenService.update(
      +id,
      updateFacebookMemberTokenDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facebookMemberTokenService.remove(+id);
  }
}
