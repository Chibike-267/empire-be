import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReservationService } from './reservation.service';

@Injectable()
export class TaskService {
  constructor(private reservationService: ReservationService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async updateReservationStatus() {
    await this.reservationService.updateReservationStatus();
  }
}
