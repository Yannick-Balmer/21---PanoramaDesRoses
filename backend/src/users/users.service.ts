import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // 🟢 CREATE
  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  // 🟢 READ ALL
  async findAll() {
    return this.prisma.user.findMany();
  }

  // 🟢 READ ONE
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  // 🟢 UPDATE
  async update(id: number, updateUserDto: UpdateUserDto) {
    // Vérifie que l'utilisateur existe avant la mise à jour
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  // 🟢 DELETE
  async remove(id: number) {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }

   // 🟢 FIND BY EMAIL
  async findOneByEmail(email: string) {
    try {
      const data = await this.prisma.user.findUnique({
        where: { email }
      });
      return data;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
