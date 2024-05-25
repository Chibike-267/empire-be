import { Module } from '@nestjs/common';
import { JwtService } from '../service/jwt.service';
import { JwtAuthGuard } from '../guard/jwt.guard';

@Module({
  providers: [JwtService, JwtAuthGuard],
  exports: [JwtService],
})
export class JwtModule {}
