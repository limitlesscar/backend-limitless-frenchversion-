import { S3Service } from "../S3/s3.service";
import { S3FolderNameDto } from "../S3/dto/folder-name.dto";
export declare class UploadController {
    private readonly s3Service;
    constructor(s3Service: S3Service);
    uploadImageFiles(files: Express.Multer.File[], s3FolderName: S3FolderNameDto): Promise<string[]>;
}
