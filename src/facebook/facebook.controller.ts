import { Controller, Get, Req, Res } from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { Request, Response } from 'express';

@Controller('facebook')
export default class FacebookController {
  constructor(private readonly fbService: FacebookService) {}

  @Get('/auth')
  async checkAuth(@Req() req: Request, @Res() res: Response) {
    return await this.fbService.checkAuth(req, res);
  }

  @Get('/auth/callback')
  async getAccessToken(@Req() req: Request, @Res() res: Response) {
    return this.fbService.getAccessToken(req, res);
  }

  @Get('/connect')
  async getConnection(@Req() req: Request, @Res() res: Response) {
    console.log(res);
  }
}
