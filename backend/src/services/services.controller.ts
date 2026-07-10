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
@UseGuards(JwtAuthGuard)
export class ServicesController {
    constructor(
        private readonly servicesService: ServicesService,
    ) { }

    @Post()
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
        return this.servicesService.create(
            createServiceDto,
        );
    }

    @Get()
    findAll(
        @Query() query: ServiceQueryDto,
    ) {
        return this.servicesService.findAll(query);
    }

    @Get(':id')
    findOne(
        @Param('id', ParseUUIDPipe)
        id: string,
    ) {
        return this.servicesService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe)
        id: string,

        @Body()
        updateServiceDto: UpdateServiceDto,
    ) {
        return this.servicesService.update(
            id,
            updateServiceDto,
        );
    }

    @Delete(':id')
    remove(
        @Param('id', ParseUUIDPipe)
        id: string,
    ) {
        return this.servicesService.remove(id);
    }
}