import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataResolver } from './data.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Data as data } from './entity/data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([data])],
  providers: [DataResolver, DataService],
})
export class DataModule {}
