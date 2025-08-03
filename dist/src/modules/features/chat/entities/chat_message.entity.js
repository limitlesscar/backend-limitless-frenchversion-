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
exports.ChatMessageEntity = void 0;
const abstract_entity_1 = require("../../../database/abstract.entity");
const typeorm_1 = require("typeorm");
const chat_entity_1 = require("./chat.entity");
const user_entity_1 = require("../../user/entities/user.entity");
let ChatMessageEntity = class ChatMessageEntity extends abstract_entity_1.AbstractEntity {
};
exports.ChatMessageEntity = ChatMessageEntity;
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], ChatMessageEntity.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chat_entity_1.ChatEntity, (chat) => chat.messages),
    (0, typeorm_1.JoinColumn)({ name: "chat_id", referencedColumnName: "id" }),
    __metadata("design:type", chat_entity_1.ChatEntity)
], ChatMessageEntity.prototype, "chat", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (sender) => sender.messages),
    (0, typeorm_1.JoinColumn)({ name: "sender_id", referencedColumnName: "id" }),
    __metadata("design:type", user_entity_1.UserEntity)
], ChatMessageEntity.prototype, "sender", void 0);
exports.ChatMessageEntity = ChatMessageEntity = __decorate([
    (0, typeorm_1.Entity)("chat_message")
], ChatMessageEntity);
//# sourceMappingURL=chat_message.entity.js.map