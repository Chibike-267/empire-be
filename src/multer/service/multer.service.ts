import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FileUploadService {
  constructor() {}
  private maxFileSize = 20 * 1024 * 1024;

  async handleFileUpload(file: Express.Multer.File): Promise<string> {
    try {
      if (!file) {
        throw new Error('No file uploaded');
      }

      if (file.size > this.maxFileSize) {
        throw new Error(`File size exceeds the maximum limit of 20MB`);
      }

      const fileName = `${Date.now()}-${file.originalname}`;

      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, fileName);
      await fs.promises.writeFile(filePath, file.buffer);

      return `File ${file.originalname} uploaded successfully. Saved as ${fileName}`;
    } catch (error) {
      throw new Error(`File to upload failed: ${error.message}`);
    }
  }
}
