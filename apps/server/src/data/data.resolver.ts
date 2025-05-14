import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { DataService } from './data.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { DataResult, AllDataResult } from './entity/dataResult.entity';

@Resolver(() => DataResult)
@UseGuards(JwtAuthGuard)
export class DataResolver {
  constructor(private readonly dataService: DataService) {}

  @Query(() => AllDataResult)
  async getData() {
    const result = await this.dataService.getData();
    if (result) {
      return {
        code: 200,
        message: 'Data retrieved successfully.',
        data: result,
      };
    }
    return { code: 404, message: 'Failed to find data.', data: [] };
  }

  @Query(() => DataResult)
  async getVisitCount() {
    const result = await this.dataService.getVisitCount();
    if (result !== null) {
      return {
        code: 200,
        message: 'Visit count retrieved successfully.',
        data: result,
      };
    }
    return { code: 404, message: 'Failed to find visit count.', data: [] };
  }

  @Query(() => DataResult)
  async getLikeCount() {
    const result = await this.dataService.getLikeCount();
    if (result !== null) {
      return {
        code: 200,
        message: 'Like count retrieved successfully.',
        data: result,
      };
    }
    return { code: 404, message: 'Failed to find like count.', data: [] };
  }

  @Mutation(() => DataResult)
  async addOneVisitCount() {
    const result = await this.dataService.addOneVisitCount();
    if (result !== null) {
      return {
        code: 200,
        message: 'Visit count incremented successfully.',
        data: result,
      };
    }
    return {
      code: 500,
      message: 'Failed to increment visit count.',
      data: [],
    };
  }

  @Mutation(() => DataResult)
  async addOneLikeCount() {
    const result = await this.dataService.addOneLikeCount();
    if (result !== null) {
      return {
        code: 200,
        message: 'Like count incremented successfully.',
        data: result,
      };
    }
    return {
      code: 500,
      message: 'Failed to increment like count.',
      data: [],
    };
  }

  @Mutation(() => DataResult)
  async resetVisitCount() {
    const result = await this.dataService.resetVisitCount();
    if (result !== null) {
      return {
        code: 200,
        message: 'Visit count reset successfully.',
        data: result,
      };
    }
    return { code: 500, message: 'Failed to reset visit count.', data: [] };
  }

  @Mutation(() => DataResult)
  async resetLikeCount() {
    const result = await this.dataService.resetLikeCount();
    if (result !== null) {
      return {
        code: 200,
        message: 'Like count reset successfully.',
        data: result,
      };
    }
    return { code: 500, message: 'Failed to reset like count.', data: [] };
  }
}
