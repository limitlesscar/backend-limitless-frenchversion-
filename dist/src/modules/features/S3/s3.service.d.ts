import * as config from "@nestjs/config";
import { S3FolderNameDto } from "./dto/folder-name.dto";
export declare class S3Service {
    private readonly configService;
    constructor(configService: config.ConfigService);
    AWS_S3_BUCKET: any;
    AWS_REGION: any;
    s3Client: any;
    uploadImages(file: Express.Multer.File, s3FolderName: S3FolderNameDto): Promise<{
        image: string;
    }>;
    s3_imageUpload(file: Express.Multer.File, { folder }: S3FolderNameDto, originalname: string): Promise<object>;
}
