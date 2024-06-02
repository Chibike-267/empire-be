import {
  Controller,
  Post,
  Body,
  Get,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  Query,
  Param,
  Patch,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { UnitService } from '../service/unit.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AddUnitDto, EditUnitDto } from '../dto/unit.dto';

@Controller('unit')
export class UnitController {
  constructor(private unitService: UnitService) {}

  @Post('add-unit')
  @UsePipes(new ValidationPipe({ transform: true }))
  async addUnit(@Body() addUnitDto: AddUnitDto) {
    return await this.unitService.addUnit(addUnitDto);
  }

  @Post('image-upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    return await this.unitService.uploadImages(files);
  }

  @Get('/all')
  async getAllUnits() {
    return await this.unitService.getAllUnits();
  }

  //   @Get('/filter')
  //   async filterUnits(
  //     @Query('location') location: string,
  //     @Query('status') status: string,
  //   ) {
  //     return await this.unitService.filterUnits(location, status);
  //   }

  @Get('/filter')
  async filterUnits(
    @Query('location') location?: string,
    @Query('status') status?: string,
  ) {
    return await this.unitService.filterUnits(location, status);
  }

  @Get('single-unit/:id')
  async getSingleUnit(@Param('id', ParseUUIDPipe) id: string) {
    return await this.unitService.getSingleUnit(id);
  }

  @Patch('edit-unit/:id')
  async editUnit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) editUnitDto: EditUnitDto,
  ) {
    return await this.unitService.editUnit(id, editUnitDto);
  }

  @Get('dashboard')
  async getDashboardAnalytics() {
    return await this.unitService.getDashboardAnalytics();
  }

  @Get('location')
  async getUniqueUnitLocations() {
    return await this.unitService.getDashboardAnalytics();
  }
}
