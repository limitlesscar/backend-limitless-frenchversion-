import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { S3Service } from "../S3/s3.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { S3FolderNameDto } from "../S3/dto/folder-name.dto";

@Controller("upload")
@ApiTags("Upload")
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}
  // ==============================================================Upload Image=============================================================
  /**
   * Uploads a file to S3 storage for the logged-in user.
   *
   * @param id - The ID of the logged-in user.
   * @param file - The file to be uploaded.
   * @returns A promise that resolves to the result of the file upload operation.
   */
  @ApiOperation({ summary: "Upload media" })
  @ApiBody({
    required: true,
    type: "multipart/form-data",
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
  })
  @ApiConsumes("multipart/form-data")
  @Post("")
  @UseInterceptors(
    FilesInterceptor("files", 7, {
      limits: {
        fileSize: 1024 * 1024 * 100, // 100MB limit
      },
    }),
  )
  async uploadImageFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query() s3FolderName: S3FolderNameDto,
  ): Promise<string[]> {
    console.log("Files", files);
    const uploadPromises = files.map((file) =>
      this.s3Service.uploadImages(file, s3FolderName),
    );

    const results = await Promise.all(uploadPromises);
    const imageUrls = results.map((result) => result.image);

    return imageUrls;
  }
}
