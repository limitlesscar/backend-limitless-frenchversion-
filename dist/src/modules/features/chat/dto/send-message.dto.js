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
exports.ISendMessageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ISendMessageDto {
}
exports.ISendMessageDto = ISendMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "message",
        example: "Hello this is my first chat message",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Message cannot be empty" }),
    (0, class_validator_1.IsString)({ message: "Message should be of type string" }),
    __metadata("design:type", String)
], ISendMessageDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "sender_id",
        example: 1,
        description: "Id of the sender",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Sender Id cannot be empty" }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: "Sender id should be a valid number" }),
    __metadata("design:type", Number)
], ISendMessageDto.prototype, "sender_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "chat_id",
        example: 2,
        description: "Id of the chat",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Chat Id cannot be empty" }),
    (0, class_validator_1.IsNumber)({}, { message: "Chat Id should be a valid number" }),
    __metadata("design:type", Number)
], ISendMessageDto.prototype, "chat_id", void 0);
//# sourceMappingURL=send-message.dto.js.map