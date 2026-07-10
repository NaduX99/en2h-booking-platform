import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service)
        private readonly servicesRepository: Repository<Service>,
    ) { }

    async create(createServiceDto: CreateServiceDto) {
        const service = this.servicesRepository.create({
            ...createServiceDto,
            price: createServiceDto.price.toFixed(2),
        });

        const savedService =
            await this.servicesRepository.save(service);

        return {
            success: true,
            message: 'Service created successfully',
            data: savedService,
        };
    }

    async findAll() {
        const services = await this.servicesRepository.find({
            order: {
                createdAt: 'DESC',
            },
        });

        return {
            success: true,
            data: services,
        };
    }

    async findOne(id: string) {
        const service =
            await this.servicesRepository.findOne({
                where: { id },
            });

        if (!service) {
            throw new NotFoundException(
                'Service not found',
            );
        }

        return {
            success: true,
            data: service,
        };
    }

    async update(
        id: string,
        updateServiceDto: UpdateServiceDto,
    ) {
        const service =
            await this.servicesRepository.findOne({
                where: { id },
            });

        if (!service) {
            throw new NotFoundException(
                'Service not found',
            );
        }

        const updateData = {
            ...updateServiceDto,
            ...(updateServiceDto.price !== undefined && {
                price: updateServiceDto.price.toFixed(2),
            }),
        };

        Object.assign(service, updateData);

        const updatedService =
            await this.servicesRepository.save(service);

        return {
            success: true,
            message: 'Service updated successfully',
            data: updatedService,
        };
    }

    async remove(id: string) {
        const service =
            await this.servicesRepository.findOne({
                where: { id },
            });

        if (!service) {
            throw new NotFoundException(
                'Service not found',
            );
        }

        await this.servicesRepository.remove(service);

        return {
            success: true,
            message: 'Service deleted successfully',
        };
    }
}