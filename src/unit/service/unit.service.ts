import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
//import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { CloudinaryService } from '../../cloudinary/service/cloudinary.service';
import { AddUnitDto, EditUnitDto } from '../dto/unit.dto';
import { Unit } from '../entity/unit.entity';
import { Status } from '../enum/unit.enum';
import {
  AddUnitResponse,
  FilteredUnitsResponse,
  UnitInfoResponse,
  UploadImagesResponse,
} from '../type/unit.type';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async addUnit(addUnitDto: AddUnitDto): Promise<AddUnitResponse> {
    try {
      const newUnit = this.unitRepository.create(addUnitDto);
      const addedUnit = await this.unitRepository.save(newUnit);
      return {
        message: 'Unit added successfully',
        addedUnit,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Unit error');
    }
  }

  async uploadImages(
    files: Express.Multer.File[],
  ): Promise<UploadImagesResponse> {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files uploaded');
      }

      const uploadedImages: string[] = [];

      for (const file of files) {
        const uploadResult = await this.cloudinaryService.uploadImage(file);

        if ('secure_url' in uploadResult) {
          const uploadResponse = uploadResult as UploadApiResponse;
          uploadedImages.push(uploadResponse.secure_url);
        } else {
          const errorResponse = uploadResult as UploadApiErrorResponse;
          console.error('Image upload failed:', errorResponse.error);
        }
      }

      return { images: uploadedImages };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Image upload failed');
    }
  }

  async getAllUnits(): Promise<{ message: string; units: Unit[] }> {
    try {
      const units = await this.unitRepository.find();
      return { message: 'Units found successfully', units };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error fetching units');
    }
  }

  async filterUnits(
    location?: string,
    status?: string,
  ): Promise<FilteredUnitsResponse> {
    try {
      const queryBuilder = this.unitRepository.createQueryBuilder('unit');

      if (location) {
        queryBuilder.where('unit.location = :location', { location });
      } else if (status) {
        queryBuilder.where('unit.status = :status', { status });
      } else {
        throw new BadRequestException(
          'Please provide either location or status in the query parameters',
        );
      }

      queryBuilder.orderBy(location ? 'unit.location' : 'unit.status', 'DESC');

      const filteredUnits = await queryBuilder.getMany();
      return { message: 'Units found successfully', filteredUnits };
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Error fetching filtered units',
      );
    }
  }

  async getSingleUnit(
    unitId: string,
  ): Promise<{ message: string; unit: Unit }> {
    try {
      const unit: Unit = await this.unitRepository.findOne({
        where: { id: unitId },
        relations: ['reservations'],
      });

      if (!unit) {
        throw new NotFoundException('Unit not found');
      }

      return { message: 'Unit found successfully', unit };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch unit:', error);
    }
  }

  async editUnit(
    id: string,
    editUnitDto: EditUnitDto,
  ): Promise<UnitInfoResponse> {
    try {
      const unitInfo: Unit = await this.unitRepository.findOne({
        where: { id },
      });
      if (!unitInfo) {
        throw new NotFoundException('Unit cannot be found');
      }

      await this.unitRepository.update(id, editUnitDto);

      Object.assign(unitInfo, editUnitDto);

      return { message: 'Unit edited successfully', unitInfo };
    } catch (error) {
      throw new InternalServerErrorException('Error in editing unit', error);
    }
  }

  async getDashboardAnalytics() {
    try {
      const [totalProperty, Available, Occupied, TopUnit] = await Promise.all([
        this.unitRepository.findAndCount(),
        this.unitRepository.findAndCount({
          where: { status: Status.AVAILABLE },
        }),
        this.unitRepository.findAndCount({
          where: { status: Status.OCCUPPIED },
        }),
        this.unitRepository.find({ order: { price: 'DESC' }, take: 2 }),
      ]);

      return {
        message: 'Dashboard Analytics',
        totalProperty,
        Available,
        Occupied,
        TopUnit,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to fetch dashboard analytics',
      );
    }
  }

  async getUniqueUnitLocations(): Promise<string[]> {
    try {
      const locations = await this.unitRepository
        .createQueryBuilder('unit')
        .select('DISTINCT unit.location', 'uniqueLocation')
        .getRawMany();

      return locations.map((location) => location.uniqueLocation);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error fetching unique unit locations',
      );
    }
  }
}
