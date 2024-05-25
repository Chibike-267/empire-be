import { BadRequestException } from '@nestjs/common';

export interface CheckInResponse {
  msg: string;
}

export class InvalidStatusException extends BadRequestException {
  constructor() {
    super('Reservation cannot be checked in. Invalid status.');
  }
}
