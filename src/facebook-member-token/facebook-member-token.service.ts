import { Injectable } from '@nestjs/common';
import { CreateFacebookMemberTokenDto } from './dto/create-facebook-member-token.dto';
import { UpdateFacebookMemberTokenDto } from './dto/update-facebook-member-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FacebookMemberToken } from '@app/mysql/entities/facebookMemberToken.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FacebookMemberTokenService {
  constructor(
    @InjectRepository(FacebookMemberToken)
    private readonly facebookMemberTokenRepo: Repository<FacebookMemberToken>,
  ) {}
  async create(createFacebookMemberTokenDto: CreateFacebookMemberTokenDto) {
    await this.facebookMemberTokenRepo.save(createFacebookMemberTokenDto);
    return 'This action adds a new facebookMemberToken';
  }

  async refreshToken(data: ){
    
  }
  findAll() {
    return `This action returns all facebookMemberToken`;
  }

  findOne(id: number) {
    return `This action returns a #${id} facebookMemberToken`;
  }

  update(
    id: number,
    updateFacebookMemberTokenDto: UpdateFacebookMemberTokenDto,
  ) {
    return `This action updates a #${id} facebookMemberToken`;
  }

  remove(id: number) {
    return `This action removes a #${id} facebookMemberToken`;
  }
}
