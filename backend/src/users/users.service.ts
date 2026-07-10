import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    findByEmail(email: string) {
        return this.usersRepository.findOne({
            where: {
                email: email.toLowerCase(),
            },
        });
    }

    findById(id: string) {
        return this.usersRepository.findOne({
            where: { id },
        });
    }

    create(data: {
        name: string;
        email: string;
        passwordHash: string;
    }) {
        const user = this.usersRepository.create({
            name: data.name,
            email: data.email.toLowerCase(),
            passwordHash: data.passwordHash,
        });

        return this.usersRepository.save(user);
    }
}