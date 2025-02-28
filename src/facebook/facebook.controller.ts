import { Controller, Get, Req, Res } from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { Request, Response } from 'express';

@Controller('facebook')
export default class FacebookController {
  constructor(private readonly fbService: FacebookService) {}

  @Get('/auth')
  async checkAuth(@Req() req: Request, @Res() res: Response) {
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${this.fbService.facebookApi.clientId}&redirect_uri=${this.fbService.facebookApi.redirectUri}&scope=business_management,ads_management,pages_show_list`;
    res.redirect(authUrl);
  }

  @Get('/auth/callback')
  async getAccessToken(@Req() req: Request, @Res() res: Response) {
    return this.fbService.getAccessToken(req, res);
  }
}
