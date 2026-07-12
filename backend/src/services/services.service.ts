import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';
import { ServiceQueryDto } from './dto/service-query.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    const service = this.servicesRepository.create({
      ...createServiceDto,
      price: createServiceDto.price.toFixed(2),
    });

    const savedService = await this.servicesRepository.save(service);

    return {
      success: true,
      message: 'Service created successfully',
      data: savedService,
    };
  }

  async findAll(query: ServiceQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const queryBuilder = this.servicesRepository
      .createQueryBuilder('service')
      .orderBy('service.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (query.search?.trim()) {
      const search = `%${query.search.trim().toLowerCase()}%`;

      queryBuilder.andWhere(
        `(
        LOWER(service.title) LIKE :search
        OR LOWER(service.description) LIKE :search
      )`,
        { search },
      );
    }

    if (query.isActive !== undefined) {
      queryBuilder.andWhere('service.isActive = :isActive', {
        isActive: query.isActive,
      });
    }

    const [services, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: services,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
  async findOne(id: string) {
    const service = await this.servicesRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return {
      success: true,
      data: service,
    };
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.servicesRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const updateData = {
      ...updateServiceDto,
      ...(updateServiceDto.price !== undefined && {
        price: updateServiceDto.price.toFixed(2),
      }),
    };

    Object.assign(service, updateData);

    const updatedService = await this.servicesRepository.save(service);

    return {
      success: true,
      message: 'Service updated successfully',
      data: updatedService,
    };
  }

  async remove(id: string) {
    const service = await this.servicesRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    await this.servicesRepository.remove(service);

    return {
      success: true,
      message: 'Service deleted successfully',
    };
  }

  async findEntityById(id: string) {
    const service = await this.servicesRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async findActiveEntityById(id: string) {
    const service = await this.servicesRepository.findOne({
      where: {
        id,
        isActive: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Active service not found');
    }

    return service;
  }
}
