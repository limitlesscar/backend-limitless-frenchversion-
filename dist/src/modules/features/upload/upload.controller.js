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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const s3_service_1 = require("../S3/s3.service");
const platform_express_1 = require("@nestjs/platform-express");
const folder_name_dto_1 = require("../S3/dto/folder-name.dto");
let UploadController = class UploadController {
    constructor(s3Service) {
        this.s3Service = s3Service;
    }
    async uploadImageFiles(files, s3FolderName) {
        console.log("Files", files);
        const uploadPromises = files.map((file) => this.s3Service.uploadImages(file, s3FolderName));
        const results = await Promise.all(uploadPromises);
        const imageUrls = results.map((result) => result.image);
        return imageUrls;
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Upload media" }),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.Post)(""),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("files", 7, {
        limits: {
            fileSize: 1024 * 1024 * 100,
        },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, folder_name_dto_1.S3FolderNameDto]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadImageFiles", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.Controller)("upload"),
    (0, swagger_1.ApiTags)("Upload"),
    __metadata("design:paramtypes", [s3_service_1.S3Service])
], UploadController);
//# sourceMappingURL=upload.controller.js.map