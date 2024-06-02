import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../entity/reservation.entity';
import { ReservationController } from '../controller/reservation.controller';
import { TaskService } from '../service/task.service';
import { ReservationService } from '../service/reservation.service';
import { UnitModule } from '../../unit/module/unit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), UnitModule],
  controllers: [ReservationController],
  providers: [ReservationService, TaskService],
  exports: [ReservationService, TypeOrmModule],
})
export class ReservationModule {}
