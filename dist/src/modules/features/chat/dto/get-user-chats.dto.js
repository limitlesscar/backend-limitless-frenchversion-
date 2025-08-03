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
exports.FetchUserChatsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_dto_1 = require("../../../../types/pagination/common.dto");
const chat_type_enum_1 = require("../enums/chat-type.enum");
const class_validator_1 = require("class-validator");
class FetchUserChatsDto extends common_dto_1.PaginationDto {
}
exports.FetchUserChatsDto = FetchUserChatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "chat_type",
        enum: [chat_type_enum_1.ChatType.AS_CUSTOMER, chat_type_enum_1.ChatType.AS_HOST],
    }),
    (0, class_validator_1.IsEnum)(chat_type_enum_1.ChatType),
    (0, class_validator_1.IsNotEmpty)({ message: "Chat type cannot be empty" }),
    __metadata("design:type", String)
], FetchUserChatsDto.prototype, "chat_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "search",
        example: "Usaid",
        description: "search by name",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FetchUserChatsDto.prototype, "search", void 0);
//# sourceMappingURL=get-user-chats.dto.js.map