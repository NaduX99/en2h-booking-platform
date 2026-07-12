import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';
import { ServiceQueryDto } from './dto/service-query.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Throttle({
    default: {
      limit: 20,
      ttl: 60_000,
    },
  })
  create(
    @Body()
    createServiceDto: CreateServiceDto,
  ) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: ServiceQueryDto) {
    return this.servicesService.findAll(query);
  }

  @Get('public/active')
  @Throttle({
    default: {
      limit: 50,
      ttl: 60_000,
    },
  })
  findPublicActive(@Query() query: ServiceQueryDto) {
    return this.servicesService.findAll({
      ...query,
      isActive: true,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseUUIDPipe)
    id: string,

    @Body()
    updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.servicesService.remove(id);
  }
}
