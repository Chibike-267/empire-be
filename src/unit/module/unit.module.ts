import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit } from '../entity/unit.entity';
import { UnitController } from '../controller/unit.controller';
import { UnitService } from '../service/unit.service';
import { CloudinaryModule } from '../../cloudinary/module/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Unit]), CloudinaryModule],
  controllers: [UnitController],
  providers: [UnitService],
  exports: [UnitService, TypeOrmModule],
})
export class UnitModule {}
