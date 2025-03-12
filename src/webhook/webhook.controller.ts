import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DelInterface, WebhookService } from './webhook.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { webhookCreator } from '@app/shopify-api-client/interface/productApi';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async create(@Body() createWebhookDto: any) {
    return this.webhookService.createWebhook(createWebhookDto);
  }

  @Post('/del')
  async del(@Body() body: DelInterface) {
    return this.webhookService.webhookDeleteSub(body);
  }
  // @Get()
  // findAll() {
  //   return this.webhookService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.webhookService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWebhookDto: UpdateWebhookDto) {
  //   return this.webhookService.update(+id, updateWebhookDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.webhookService.remove(+id);
  // }
}
