import { Unit } from '../entity/unit.entity';

export interface AddUnitResponse {
  message: string;
  addedUnit: Unit;
}

export interface UnitInfoResponse {
  message: string;
  unitInfo: Unit;
}

export interface FilteredUnitsResponse {
  message: string;
  filteredUnits: Unit[];
}

export interface UploadImagesResponse {
  images: string[];
}
