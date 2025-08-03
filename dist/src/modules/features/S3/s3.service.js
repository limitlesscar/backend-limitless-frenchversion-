"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const config = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const axios_1 = require("axios");
const httpException_1 = require("../../../utils/app/httpException");
const error_messages_enum_1 = require("../../../types/enums/user/error-messages.enum");
let S3Service = class S3Service {
    constructor(configService) {
        this.configService = configService;
        this.AWS_S3_BUCKET = this.configService.getOrThrow("AWS_BUCKET_NAME");
        this.AWS_REGION = this.configService.getOrThrow("AWS_REGION");
        this.s3Client = new client_s3_1.S3Client({
            region: this.AWS_REGION,
            credentials: {
                accessKeyId: this.configService.getOrThrow("AWS_ACCESS_KEY_ID"),
                secretAccessKey: this.configService.getOrThrow("AWS_SECRET_ACCESS_KEY"),
            },
        });
    }
    async uploadImages(file, s3FolderName) {
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
                (0, httpException_1.throwHttpException)(["Invalid file format. Only images are allowed."], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
            }
            const maxSize = 1 * 1024 * 1024;
            if (file.size > maxSize) {
                (0, httpException_1.throwHttpException)(["File size too large. Maximum size is 1MB."], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
            }
            const s3Response = await this.s3_imageUpload(file, s3FolderName, originalname);
            if (s3Response) {
                const location = `https://${this.AWS_S3_BUCKET}.s3.${this.AWS_REGION}.amazonaws.com/${s3FolderName.folder}/${originalname}`;
                return { image: location };
            }
            else {
                (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.ERROR_IN_UPLOADING_IMAGE], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
            }
        }
        catch (err) {
            (0, httpException_1.throwHttpException)([err.message], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async s3_imageUpload(file, { folder }, originalname) {
        const { buffer, mimetype } = file;
        const folderPath = `${folder}`;
        const params = {
            Bucket: this.AWS_S3_BUCKET,
            Key: `${folderPath}/${originalname}`,
            Body: buffer,
            ContentType: mimetype,
        };
        try {
            const command = new client_s3_1.PutObjectCommand(params);
            return await this.s3Client.send(command);
        }
        catch (e) {
            console.error("ERROR", e);
            (0, httpException_1.throwHttpException)([error_messages_enum_1.ErrorMessages.ERROR_IN_UPLOADING_IMAGE], axios_1.HttpStatusCode.BadRequest, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config !== "undefined" && config.ConfigService) === "function" ? _a : Object])
], S3Service);
//# sourceMappingURL=s3.service.js.map