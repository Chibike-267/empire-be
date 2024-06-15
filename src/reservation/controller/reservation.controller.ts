import {
  Controller,
  Post,
  Body,
  Param,
  ValidationPipe,
  //Put,
  Delete,
  Get,
  HttpStatus,
  HttpCode,
  //HttpException,
  Patch,
  //HttpException,
  //Delete,
} from '@nestjs/common';
import { ReservationService } from '../service/reservation.service';
import { ReserveUnitDto, EditDto } from '../dto/reservation.dto';
import { Reservation } from '../entity/reservation.entity';
import { Unit } from '../../unit/entity/unit.entity';

@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post('reserve/:unitId')
  async reserveUnit(
    @Param('unitId') unitId: string,
    @Body(ValidationPipe) reserveUnitDto: ReserveUnitDto,
  ) {
    return await this.reservationService.reserveUnit(reserveUnitDto, unitId);
  }

  @Patch('edit/:id')
  async editReservation(
    @Param('id') reservationId: string,
    @Body() editDto: EditDto,
  ) {
    return await this.reservationService.editReservation(
      editDto,
      reservationId,
    );
  }

  @Delete('cancel/:id')
  async cancelReservation(@Param('id') reservationId: string): Promise<any> {
    return await this.reservationService.cancelReservation(reservationId);
  }

  @Get('all')
  async getAllReservations(): Promise<Reservation[]> {
    return await this.reservationService.getAllReservations();
  }

  @Get('history/:id')
  async getReservationHistory(@Param('id') unitId: string) {
    return await this.reservationService.getReservationHistory(unitId);
  }

  @Get('single/:id')
  async getOneReservation(
    @Param('id') reservationId: string,
  ): Promise<{ reservation: Reservation; unit: Unit }> {
    return await this.reservationService.getOneReservation(reservationId);
  }

  @Post('check-in/:id')
  async checkIn(@Param('id') reservationId: string): Promise<any> {
    return await this.reservationService.checkIn(reservationId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('check-out/:id')
  async checkOut(@Param('id') reservationId: string) {
    return await this.reservationService.checkOut(reservationId);
  }

  @Post('update-status')
  async updateReservationStatus(): Promise<void> {
    await this.reservationService.updateReservationStatus();
    return;
  }
}
