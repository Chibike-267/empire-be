import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
// import { Request, Response } from 'express';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { Unit } from '../../unit/entity/unit.entity';
import { CheckInResponse, InvalidStatusException } from '../type/checkIn.type';
import { Reservation } from '../entity/reservation.entity';
import { EditDto, ReserveUnitDto } from '../dto/reservation.dto';
import { Status } from '../enum/reservation.enum';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
  ) {}

  async reserveUnit(
    reserveUnitDto: ReserveUnitDto,
    unitId: string,
  ): Promise<Reservation> {
    try {
      const unit = await this.unitRepository.findOne({ where: { id: unitId } });
      if (!unit) {
        throw new NotFoundException('Unit not found');
      }

      const currentDate = new Date();
      const checkIn = new Date(reserveUnitDto.checkInDate);
      if (checkIn < currentDate) {
        throw new BadRequestException('Cannot reserve for past dates');
      }

      const checkOut = new Date(reserveUnitDto.checkOutDate);
      if (checkOut <= checkIn) {
        throw new BadRequestException(
          'Check-out date must be after check-in date',
        );
      }

      const existingReservation = await this.reservationRepository.findOne({
        where: {
          unit: { id: unitId },
          checkInDate: Between(checkIn, checkOut),
          checkOutDate: Between(checkIn, checkOut),
        },
      });

      if (existingReservation) {
        throw new BadRequestException(
          'This unit is already reserved for the specified dates',
        );
      }

      const id = uuidv4();
      const reservation = this.reservationRepository.create({
        id,
        ...reserveUnitDto,
        unit,
      });
      await this.reservationRepository.save(reservation);
      return reservation;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async editReservation(editDto: EditDto, id: string): Promise<any> {
    try {
      const reserveUnit = await this.reservationRepository.findOne({
        where: { id: id },
      });

      if (!reserveUnit) {
        throw new NotFoundException('Reservation not found');
      }

      const updatedReservation = await this.reservationRepository.update(
        id,
        editDto,
      );

      return {
        msg: 'Reservation edited successfully',
        editedReservation: updatedReservation,
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async cancelReservation(id: string): Promise<any> {
    try {
      const reservation = await this.reservationRepository.findOne({
        where: { id },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      const updatedReservation = await this.reservationRepository.update(
        { id },
        { status: Status.CANCEL },
      );

      if (updatedReservation.affected === 0) {
        throw new BadRequestException('Failed to cancel reservation');
      }

      const cancelledReservation = await this.reservationRepository.findOne({
        where: { id },
      });

      return cancelledReservation;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getAllReservations(): Promise<Reservation[]> {
    try {
      const reservations = await this.reservationRepository.find();
      return reservations;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getReservationHistory(unitId: string): Promise<Reservation[]> {
    try {
      const unit = await this.unitRepository.findOne({ where: { id: unitId } });
      if (!unit) {
        throw new NotFoundException('Unit not found');
      }

      const reservations = await this.reservationRepository.find({
        where: { unit },
      });

      if (!reservations || reservations.length === 0) {
        throw new NotFoundException(
          'No reservation history found for this unit',
        );
      }
      return reservations;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getOneReservation(
    reservationId: string,
  ): Promise<{ reservation: Reservation; unit: Unit }> {
    try {
      const reservation = await this.reservationRepository.findOne({
        where: { id: reservationId },
        relations: ['unit'],
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      const unit = reservation.unit;

      if (!unit) {
        throw new NotFoundException('Unit not found');
      }

      return { unit, reservation };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async checkIn(reservationId: string): Promise<CheckInResponse | never> {
    try {
      const reservation = await this.reservationRepository.findOne({
        where: { id: reservationId },
        relations: ['unit'],
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (reservation.status !== Status.VACANCY) {
        throw new InvalidStatusException();
      }

      const reservationUpdateResult = await this.reservationRepository.update(
        reservation.id,
        { status: Status.OCCUPPIED, checkInDate: new Date() },
      );

      if (reservationUpdateResult[0] === 0) {
        throw new BadRequestException('Failed to check in reservation');
      }

      const unitUpdateResult = await this.unitRepository.update(
        reservation.unit.id,
        { status: Status.OCCUPPIED },
      );

      if (unitUpdateResult[0] === 0) {
        throw new BadRequestException('Failed to update unit status');
      }

      return { msg: 'Reservation checked in successfully' };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async checkOut(
    reservationId: string,
  ): Promise<{ msg: string } | { error: string }> {
    try {
      const reservation = await this.reservationRepository.findOne({
        where: { id: reservationId },
        relations: ['unit'],
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      const updatedReservationCount = await this.reservationRepository.update(
        reservation.id,
        {
          status: Status.STAYED,
          checkOutDate: new Date(),
        },
      );

      if (!updatedReservationCount) {
        throw new BadRequestException('Failed to check out reservation');
      }

      const updatedUnitCount = await this.unitRepository.update(
        reservation.unit.id,
        {
          status: Status.AVAILABLE,
        },
      );

      if (!updatedUnitCount) {
        throw new BadRequestException('Failed to update unit status');
      }

      return { msg: 'Reservation checked out successfully' };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateReservationStatus(): Promise<void> {
    try {
      const reservations = await this.reservationRepository.find({
        relations: ['unit'],
      });

      for (const reservation of reservations) {
        const checkInDate = new Date(reservation.checkInDate);
        const checkOutDate = new Date(reservation.checkOutDate);
        const currentDate = new Date();
        const status = reservation.status;

        if (
          checkInDate <= currentDate &&
          currentDate <= checkOutDate &&
          status !== Status.CANCELLED
        ) {
          await this.reservationRepository.update(
            { status: Status.VACANCY },
            { id: reservation.id },
          );
          await this.unitRepository.update(
            { status: Status.OCCUPPIED },
            { id: reservation.unit.id },
          );
        } else if (currentDate > checkOutDate && status !== Status.CANCELLED) {
          await this.reservationRepository.update(
            { status: Status.STAYED },
            { id: reservation.id },
          );
          await this.unitRepository.update(
            { status: Status.AVAILABLE },
            { id: reservation.unit.id },
          );
        }
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
