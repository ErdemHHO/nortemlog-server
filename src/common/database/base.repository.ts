import {
  DeepPartial,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';
import { SORT_ORDER } from '../constants/database.constants.js';
import { BaseEntity } from './base.entity.js';

export abstract class BaseRepository<T extends BaseEntity> {
  protected constructor(protected readonly repository: Repository<T>) {}

  async createAndSave(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    const defaultOrder = {
      createdAt: SORT_ORDER.DESC,
    } as FindOptionsOrder<T>;

    return this.repository.find({
      order: defaultOrder,
      ...options,
    });
  }

  async findOneById(id: string): Promise<T | null> {
    const where = { id } as FindOptionsWhere<T>;
    return this.repository.findOne({ where });
  }

  async findOneBy(where: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOne({ where });
  }

  async updateById(
    id: string,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<boolean> {
    const where = { id } as FindOptionsWhere<T>;
    const result = await this.repository.update(where, partialEntity);
    return (result.affected ?? 0) > 0;
  }

  async softDeleteById(id: string): Promise<boolean> {
    const where = { id } as FindOptionsWhere<T>;
    const result = await this.repository.softDelete(where);
    return (result.affected ?? 0) > 0;
  }

  async hardDeleteById(id: string): Promise<boolean> {
    const where = { id } as FindOptionsWhere<T>;
    const result = await this.repository.delete(where);
    return (result.affected ?? 0) > 0;
  }

  async existsBy(where: FindOptionsWhere<T>): Promise<boolean> {
    return this.repository.exists({ where });
  }
}
