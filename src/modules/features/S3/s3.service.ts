// Common Imports
import {
  HttpStatus,
  // HttpException,
  // HttpStatus,
  Injectable,
} from "@nestjs/common";

// Config Imports
import * as config from "@nestjs/config";

// AWS Imports
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Features Imports

// Entity Imports

import axios, { HttpStatusCode } from "axios";
import { S3FolderNameDto } from "./dto/folder-name.dto";
import { throwHttpException } from "src/utils/app/httpException";
import { ErrorMessages } from "src/types/enums/user/error-messages.enum";

@Injectable()
/**
 * Uploads a file to an S3 bucket and updates the user's profile picture.
 *
 * @param file - The file to be uploaded.
 * @param userId - The ID of the user whose profile picture is being updated.
 * @returns An object containing a success message and the updated user object without the password.
 * @throws {BadRequestException} If there is an error uploading the file or updating the user's profile picture.
 */
export class S3Service {
  constructor(private readonly configService: config.ConfigService) {}

  AWS_S3_BUCKET = this.configService.getOrThrow("AWS_BUCKET_NAME");
  AWS_REGION = this.configService.getOrThrow("AWS_REGION");
  s3Client = new S3Client({
    region: this.AWS_REGION,
    credentials: {
      accessKeyId: this.configService.getOrThrow("AWS_ACCESS_KEY_ID"),
      secretAccessKey: this.configService.getOrThrow("AWS_SECRET_ACCESS_KEY"),
    },
  });

  // ============================================= UPLOAD FILE =============================================
  /**
   * Uploads a file to an S3 bucket and updates the user's profile picture.
   *
   * @param file - The file to be uploaded.
   * @param userId - The ID of the user whose profile picture is being updated.
   * @returns An object containing a success message and the updated user object without the password.
   * @throws {BadRequestException} If there is an error uploading the file or updating the user's profile picture.
   */
  async uploadImages(
    file: Express.Multer.File,
    s3FolderName: S3FolderNameDto,
  ): Promise<{ image: string }> {
    try {
      const { originalname, buffer, mimetype } = file;

      buffer;
      mimetype;
      const allowedImageFormats = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
        "image/bmp",
      ];

      if (!allowedImageFormats.includes(file.mimetype)) {
        throwHttpException(
          ["Invalid file format. Only images are allowed."],
          HttpStatusCode.BadRequest,
          HttpStatus.BAD_REQUEST,
        );
      }

      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        throwHttpException(
          ["File size too large. Maximum size is 1MB."],
          HttpStatusCode.BadRequest,
          HttpStatus.BAD_REQUEST,
        );
      }

      const s3Response = await this.s3_imageUpload(
        file,
        s3FolderName,
        originalname,
      );

      if (s3Response) {
        const location = `https://${this.AWS_S3_BUCKET}.s3.${this.AWS_REGION}.amazonaws.com/${s3FolderName.folder}/${originalname}`;
        return { image: location };
      } else {
        throwHttpException(
          [ErrorMessages.ERROR_IN_UPLOADING_IMAGE],
          HttpStatusCode.BadRequest,
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      throwHttpException(
        [err.message],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ============================================= UPLOAD FILE =============================================
  /**
   * Uploads a file to an S3 bucket.
   *
   * @param file - The file to be uploaded.
   * @param name - The name to give the uploaded file.
   * @param mimetype - The MIME type of the file being uploaded.
   * @returns The response from the S3 upload operation.
   * @throws {Error} If there is an error uploading the file to S3.
   */ // async copyImageFromUrl(
  //   url: string,
  //   filename: string,
  //   mimetype: string
  // ): Promise<string> {
  //   const response = await axios.get(url, { responseType: "arraybuffer" });
  //   const data = response.data;
  //   const s3Response = await this.s3_imageUpload({
  //     buffer: Buffer.from(data),
  //     mimetype,
  //     originalname: filename,
  //   } as Express.Multer.File);

  //   if (s3Response) {
  //     const location = `https://${this.AWS_S3_BUCKET}.s3.amazonaws.com/images/${filename}`;

  //     return location;
  //   } else {
  //     throw new BadRequestException("File upload failed");
  //   }
  // }
  async s3_imageUpload(
    file: Express.Multer.File,
    { folder }: S3FolderNameDto,
    originalname: string,
  ): Promise<object> {
    const { buffer, mimetype } = file;
    const folderPath = `${folder}`;
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: `${folderPath}/${originalname}`,
      Body: buffer,
      ContentType: mimetype,
    };

    try {
      const command = new PutObjectCommand(params);
      return await this.s3Client.send(command);
    } catch (e) {
      console.error("ERROR", e);
      throwHttpException(
        [ErrorMessages.ERROR_IN_UPLOADING_IMAGE],
        HttpStatusCode.BadRequest,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
