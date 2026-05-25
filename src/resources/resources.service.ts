import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { FindResourcesQueryDto } from './dto/find-resources-query.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Injectable()
export class ResourcesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createResourceDto: CreateResourceDto) {
    try {
      return await this.prisma.resource.create({
        data: {
          ...createResourceDto,
          userId,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(query: FindResourcesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const where: Prisma.ResourceWhereInput = {};

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    const [data, total] = await Promise.all([
      this.prisma.resource.findMany({
        where,
        orderBy: {
          id: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.resource.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    return resource;
  }

  async update(
    id: number,
    user: AuthenticatedUser,
    updateResourceDto: UpdateResourceDto,
  ) {
    await this.ensureCanModify(id, user);

    try {
      return await this.prisma.resource.update({
        where: { id },
        data: updateResourceDto,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: number, user: AuthenticatedUser) {
    await this.ensureCanModify(id, user);

    try {
      return await this.prisma.resource.delete({
        where: { id },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Resource not found');
      }

      if (error.code === 'P2003') {
        throw new NotFoundException('Related record not found');
      }
    }

    throw error;
  }

  private async ensureCanModify(
    id: number,
    user: AuthenticatedUser,
  ): Promise<void> {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
      select: {
        userId: true,
      },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    if (user.role !== Role.ADMIN && resource.userId !== user.userId) {
      throw new ForbiddenException('Insufficient permissions');
    }
  }
}
