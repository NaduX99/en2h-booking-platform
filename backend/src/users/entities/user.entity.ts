import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 100,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 150,
        unique: true,
    })
    email: string;

    @Column({
        name: 'password_hash',
        type: 'varchar',
    })
    passwordHash: string;

    @Column({
        name: 'refresh_token_hash',
        type: 'varchar',
        nullable: true,
        select: false,
    })
    refreshTokenHash: string | null;

    @CreateDateColumn({
        name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
    })
    updatedAt: Date;
}