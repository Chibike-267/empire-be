import { Module } from '@nestjs/common';
import { FileUploadService } from '../service/multer.service';
import { FileUploadController } from '../controller/multer.controller';

@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
