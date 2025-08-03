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
exports.GetDbUsersDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_role_enum_1 = require("../../user/enums/user-role.enum");
const class_transformer_1 = require("class-transformer");
class GetDbUsersDTO {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.GetDbUsersDTO = GetDbUsersDTO;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "No of pages you want to display",
        example: 1,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GetDbUsersDTO.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "No of entries you want to display by default it is 10",
        example: "10",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GetDbUsersDTO.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "search",
        description: "Search for users by name, email, or phone number",
        example: "John Doe",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetDbUsersDTO.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "role",
        description: "Filter users by role",
        enum: user_role_enum_1.USER_TYPE_ENUM,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetDbUsersDTO.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "status",
        description: "Filter users by status",
        example: ["Approved", "Pending", "Rejected"],
        default: "Approved",
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetDbUsersDTO.prototype, "status", void 0);
//# sourceMappingURL=get-db-users.dto.js.map