import { Injectable } from '@nestjs/common';
import { CloudinaryProvider } from '../provider/cloudinary.provider';
import {
  UploadApiResponse,
  UploadApiErrorResponse,
  UploadStream,
} from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(private cloudinaryProvider: CloudinaryProvider) {}

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const cloudinary = this.cloudinaryProvider.instance;

    try {
      return new Promise<UploadApiResponse | UploadApiErrorResponse>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'my-uploads',
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) {
                console.error('Error uploading file:', error);
                reject(error);
              } else {
                resolve(result as UploadApiResponse);
              }
            },
          );

          this.processUploadStream(stream, file.buffer)
            .then(resolve)
            .catch(reject);
        },
      );
    } catch (error) {
      console.error('Error uploading file:', error);
      return error as UploadApiErrorResponse;
    }
  }

  private processUploadStream(
    stream: UploadStream,
    fileBuffer: Buffer,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const readable = Readable.from(fileBuffer);

      readable.pipe(stream);

      stream.on('error', (error) => {
        console.error('Error uploading file:', error);
        reject(error);
      });

      stream.on('file', (fileObj) => {
        console.log('File uploaded:', fileObj);
        resolve(fileObj as UploadApiResponse);
      });

      stream.on('end', () => {
        console.log('Upload completed.');
      });
    });
  }
}
