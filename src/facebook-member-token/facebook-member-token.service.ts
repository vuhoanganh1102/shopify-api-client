import { Injectable } from '@nestjs/common';
import { CreateFacebookMemberTokenDto } from './dto/create-facebook-member-token.dto';
import { UpdateFacebookMemberTokenDto } from './dto/update-facebook-member-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FacebookMemberToken } from '@app/mysql/entities/facebookMemberToken.entity';
import { Repository } from 'typeorm';
import { FacebookService } from 'src/facebook/facebook.service';
import axios from 'axios';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class FacebookMemberTokenService {
  constructor(
    @InjectRepository(FacebookMemberToken)
    private readonly facebookMemberTokenRepo: Repository<FacebookMemberToken>,
    private readonly facebookService: FacebookService,
  ) {}
  async create(createFacebookMemberTokenDto: CreateFacebookMemberTokenDto) {
    await this.facebookMemberTokenRepo.save(createFacebookMemberTokenDto);
    return 'This action adds a new facebookMemberToken';
  }

  // async refreshToken(tokens: Array<RefreshTokenInterface>, ids: Array<number>) {
  //   // lay token long-lived
  //   // for (let i = 0; i < tokens.length; i++) {
  //   //   const longLivedToken = await axios.get(
  //   //     `${this.facebookService.facebookApi.graphApiDomain}/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.facebookService.facebookApi.clientId}&client_secret=${this.facebookService.facebookApi.clientSecret}&fb_exchange_token=${data.token}`,
  //   //   );
  //   //   tokens[i].token = longLivedToken?.data?.access_token;
  //   //   tokens[i].expiresIn = longLivedToken?.data?.expires_in;
  //   // }

  //   const getNewTokens = await Promise.allSettled(
  //     tokens.map(async (e) => {
  //       try {
  //         const res = await axios.get(
  //           `${this.facebookService.facebookApi.graphApiDomain}/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.facebookService.facebookApi.clientId}&client_secret=${this.facebookService.facebookApi.clientSecret}&fb_exchange_token=${e.token}`,
  //         );
  //         return {
  //           id: e.id,
  //           token: res?.data?.access_token,
  //           expiresIn: res?.data?.expires_in,
  //         };
  //       } catch {
  //         console.log(`id: ${e.id} cant finish progress.`);
  //         return null;
  //       }
  //     }),
  //   );
  //   // 🔥 Lọc ra chỉ những token hợp lệ (fulfilled và không null)
  //   const validTokens = getNewTokens
  //     .filter(
  //       (
  //         result,
  //       ): result is PromiseFulfilledResult<{
  //         id: number;
  //         token: any;
  //         expiresIn: any;
  //       }> => result.status === 'fulfilled' && result.value !== null,
  //     )
  //     .map((result) => result.value);

  //   // cap nhat du lieu vao db
  //   await this.facebookMemberTokenRepo.update(
  //     { id: In(ids) },
  //     {
  //       token: () =>
  //         `CASE ${validTokens
  //           .map((item) => `WHEN id=${item.id} THEN '${item.token}'`)
  //           .join(' ')} ELSE token END`,
  //       expiresIn: () =>
  //         `CASE ${validTokens
  //           .map((item) => `WHEN id=${item.id} THEN '${item.expiresIn}'`)
  //           .join(' ')} ELSE expires_in END`,
  //     },
  //   );
  //   // cap nhat du lieu cache
  //   return {};
  // }
  async refreshToken(token: RefreshTokenDto) {
    const res = await axios.get(
      `${this.facebookService.facebookApi.graphApiDomain}/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.facebookService.facebookApi.clientId}&client_secret=${this.facebookService.facebookApi.clientSecret}&fb_exchange_token=${token.token}`,
    );

    await this.facebookMemberTokenRepo.update(
      { id: token.id },
      {
        id: res?.data?.id,
        token: res?.data?.token,
        expiresIn: res?.data.expires_in,
      },
    );
    return { successfull: true };
  }
  async getItemsToExpire() {
    return this.facebookMemberTokenRepo
      .createQueryBuilder('fmt')
      .select(['fmt.id id', 'fmt.token token', 'fmt.expiresIn expiresIn'])
      .where('DATEDIFF(NOW(), fmt.createdAt) + 1 = fmt.expiresIn')
      .orderBy('fmt.updatedAt', 'ASC')
      .getRawMany();
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
    console.log(updateFacebookMemberTokenDto);
    return `This action updates a #${id} facebookMemberToken`;
  }

  remove(id: number) {
    return `This action removes a #${id} facebookMemberToken`;
  }
}
