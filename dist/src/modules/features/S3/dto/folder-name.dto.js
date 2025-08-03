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
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3FolderNameDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const folder_name_enum_1 = require("../enums/folder-name.enum");
class S3FolderNameDto {
}
exports.S3FolderNameDto = S3FolderNameDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "folder",
        enum: folder_name_enum_1.FolderName,
        description: "Name of the folder where you want to upload the file",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(folder_name_enum_1.FolderName),
    __metadata("design:type", String)
], S3FolderNameDto.prototype, "folder", void 0);
//# sourceMappingURL=folder-name.dto.js.map