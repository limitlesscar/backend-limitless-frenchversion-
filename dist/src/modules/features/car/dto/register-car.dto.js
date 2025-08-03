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
exports.RegisterCarDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const brand_enum_1 = require("../enums/brand.enum");
const vehicle_type_enum_1 = require("../enums/vehicle-type.enum");
const engine_type_enum_1 = require("../enums/engine-type.enum");
const transmission_type_enum_1 = require("../enums/transmission-type.enum");
const features_enum_1 = require("../enums/features.enum");
class RegisterCarDto {
}
exports.RegisterCarDto = RegisterCarDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "name",
        description: "Name of the car",
        example: "Toyota Camry",
    }),
    (0, class_validator_1.IsString)({ message: "Car Name must be a string" }),
    (0, class_validator_1.MinLength)(1, {
        message: "Le nom de la voiture doit contenir au moins 4 caractères ",
    }),
    (0, class_validator_1.MaxLength)(5, {
        message: "Le nom de la voiture ne doit pas dépasser 15 caractères  ",
    }),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9 ]+$/, {
        message: "Le nom de la voiture ne doit contenir que des lettres, des chiffres et des espaces",
    }),
    __metadata("design:type", String)
], RegisterCarDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "images",
        description: "Images of the car",
        example: [
            "https://example.com/image1.jpg",
            "https://example.com/image2.jpg",
        ],
    }),
    (0, class_validator_1.IsArray)({
        message: "Les images doivent être un tableau de chaînes de caractères",
    }),
    (0, class_validator_1.IsString)({ each: true, message: "Images must be an array of strings" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Les images ne peuvent pas être vides" }),
    (0, class_validator_1.ArrayMinSize)(1, {
        message: "Il doit y avoir au moins une image de la voiture",
    }),
    (0, class_validator_1.ArrayMaxSize)(7, {
        message: "Le nombre d’images de la voiture ne doit pas dépasser 7",
    }),
    __metadata("design:type", Array)
], RegisterCarDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "brand",
        description: "Brand of the car",
        enum: brand_enum_1.CarBrand,
    }),
    (0, class_validator_1.IsEnum)(brand_enum_1.CarBrand, { message: "Marque de voiture invalide" }),
    (0, class_validator_1.IsNotEmpty)({ message: "La marque de la voiture ne peut pas être vide" }),
    __metadata("design:type", String)
], RegisterCarDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "description",
        description: "Description de la voiture",
        example: "Une voiture brillante avec un moteur puissant",
    }),
    (0, class_validator_1.IsString)({ message: "La description doit être une chaîne de caractères" }),
    (0, class_validator_1.MinLength)(10, {
        message: "La description doit contenir au moins 10 caractères",
    }),
    (0, class_validator_1.MaxLength)(255, {
        message: "La description ne doit pas dépasser 255 caractères",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "La description de la voiture ne peut pas être vide" }),
    __metadata("design:type", String)
], RegisterCarDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "price_per_day",
        description: "Prix par jour de la voiture en Euros",
        example: 100,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Le prix par jour ne peut pas être vide" }),
    (0, class_validator_1.IsInt)({ message: "Le prix par jour doit être un entier" }),
    __metadata("design:type", Number)
], RegisterCarDto.prototype, "price_per_day", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "price_per_hour",
        description: "Prix par heure de la voiture en Euros",
        example: 20,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Le prix par heure ne peut pas être vide" }),
    (0, class_validator_1.IsInt)({ message: "Le prix par heure doit être un entier" }),
    __metadata("design:type", Number)
], RegisterCarDto.prototype, "price_per_hour", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "vehicle_type",
        description: "Type de véhicule",
        enum: vehicle_type_enum_1.VehicleType,
    }),
    (0, class_validator_1.IsEnum)(vehicle_type_enum_1.VehicleType, { message: "Type de véhicule invalide" }),
    (0, class_validator_1.IsNotEmpty)({ message: "Le type de véhicule ne peut pas être vide" }),
    __metadata("design:type", String)
], RegisterCarDto.prototype, "vehicle_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "country_of_manufacture",
        description: "Pays de fabrication de la voiture",
        example: "USA",
    }),
    (0, class_validator_1.IsString)({
        message: "Le pays de fabrication doit être une chaîne de caractères",
    }),
    (0, class_validator_1.MinLength)(3, {
        message: "Le pays de fabrication doit contenir au moins 3 caractères",
    }),
    (0, class_validator_1.MaxLength)(255, {
        message: "Le pays de fabrication ne doit pas dépasser 255 caractères",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Le pays de fabrication ne peut pas être vide" }),
    __metadata("design:type", String)
], RegisterCarDto.prototype, "country_of_manufacture", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "city_of_registeration",
        description: "Ville d'enregistrement de la voiture",
        example: "New York",
    }),
    (0, class_validator_1.IsString)({
        message: "La ville d'enregistrement doit être une chaîne de caractères",
    }),
    (0, class_validator_1.MinLength)(3, {
        message: "La ville d'enregistrement doit contenir au moins 3 caractères",
    }),
    (0, class_validator_1.MaxLength)(255, {
        message: "La ville d'enregistrement ne doit pas dépasser 255 caractères",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "La ville d'enregistrement ne peut pas être vide" }),
    __metadata("design:type", String)
], RegisterCarDto.prototype, "city_of_registeration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "color_code",
        description: "Couleur de la voiture",
        example: "#FF0000",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "La couleur de la voiture ne peut pas être vide" }),
    (0, class_validator_1.IsString)({
        message: "La couleur de la voiture doit être une chaîne de caractères",
    }),
    __metadata("design:type", String)
], RegisterCarDto.prototype, "color_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "mileage",
        description: "Kilométrage de la voiture en km",
        example: 10000,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "Le kilométrage de la voiture ne peut pas être vide" }),
    (0, class_validator_1.IsInt)({ message: "Le kilométrage doit être un entier" }),
    __metadata("design:type", Number)
], RegisterCarDto.prototype, "mileage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "engine_type",
        description: "Type de moteur",
        enum: engine_type_enum_1.EngineType,
    }),
    (0, class_validator_1.IsEnum)(engine_type_enum_1.EngineType, { message: "Type de moteur invalide" }),
    (0, class_validator_1.IsNotEmpty)({
        message: "Le type de moteur de la voiture ne peut pas être vide",
    }),
    __metadata("design:type", String)
], RegisterCarDto.prototype, "engine_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "transmission_type",
        description: "Transmission type",
        enum: [
            transmission_type_enum_1.TransmissionType.Automatic_Transmission,
            transmission_type_enum_1.TransmissionType.Manual_Transmission,
            transmission_type_enum_1.TransmissionType.Continuously_Variable_Transmission,
            transmission_type_enum_1.TransmissionType.Dual_Clutch_Transmission,
        ],
    }),
    (0, class_validator_1.IsEnum)(transmission_type_enum_1.TransmissionType, { message: "Type de transmission invalide" }),
    (0, class_validator_1.IsNotEmpty)({
        message: "Le type de transmission de la voiture ne peut pas être vide",
    }),
    __metadata("design:type", String)
], RegisterCarDto.prototype, "transmission_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "fuel_economy",
        description: "Consommation de carburant de la voiture en km/l",
        example: 10,
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "La consommation de carburant de la voiture ne peut pas être vide",
    }),
    (0, class_validator_1.IsInt)({ message: "La consommation de carburant doit être un entier" }),
    __metadata("design:type", Number)
], RegisterCarDto.prototype, "fuel_economy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "available_start_date_time",
        description: "Date et heure de début de disponibilité de la voiture",
        example: "2024-12-25T12:00:00Z",
    }),
    (0, class_validator_1.IsString)({
        message: "La date et l'heure de début doivent être une chaîne valide",
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "La date de début de disponibilité de la voiture ne peut pas être vide",
    }),
    __metadata("design:type", String)
], RegisterCarDto.prototype, "available_start_date_time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "available_end_date_time",
        description: "Date et heure de fin de disponibilité de la voiture",
        example: "2024-12-26T12:00:00Z",
    }),
    (0, class_validator_1.IsString)({
        message: "La date et l’heure de fin doivent être une chaîne valide",
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "La date de fin de disponibilité de la voiture ne peut pas être vide",
    }),
    __metadata("design:type", String)
], RegisterCarDto.prototype, "available_end_date_time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "pickup_address",
        description: "L'adresse où vous devez prendre la voiture",
        example: "Lahore",
    }),
    (0, class_validator_1.IsString)({
        message: "L'adresse de prise en charge doit être une chaîne de caractères",
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "L'adresse de prise en charge de la voiture ne peut pas être vide",
    }),
    __metadata("design:type", String)
], RegisterCarDto.prototype, "pickup_address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "dropoff_address",
        description: "L'adresse où vous devez déposer la voiture",
        example: "Karachi",
    }),
    (0, class_validator_1.IsString)({
        message: "L'adresse de dépôt doit être une chaîne de caractères",
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "L'adresse de dépôt de la voiture ne peut pas être vide",
    }),
    __metadata("design:type", String)
], RegisterCarDto.prototype, "dropoff_address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "features",
        description: "List of car features",
        enum: features_enum_1.CarFeatures,
        isArray: true,
        required: true,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)({
        message: "Les caractéristiques de la voiture ne peuvent pas être vides",
    }),
    (0, class_validator_1.IsEnum)(features_enum_1.CarFeatures, { each: true }),
    __metadata("design:type", Array)
], RegisterCarDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "maximum_passengers",
        description: "Maximum passengers allowed in the car",
        example: 4,
        required: true,
    }),
    (0, class_validator_1.IsInt)({ message: "Le nombre maximum de passagers doit être un entier" }),
    (0, class_validator_1.IsNotEmpty)({
        message: "Le nombre maximum de passagers ne peut pas être vide",
    }),
    (0, class_validator_1.Max)(20, {
        message: "Le nombre maximum de passagers ne peut pas dépasser 20",
    }),
    (0, class_validator_1.Min)(2, { message: "Il doit y avoir au moins 2 passagers" }),
    __metadata("design:type", Number)
], RegisterCarDto.prototype, "maximum_passengers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "luggage_capacity",
        description: "Luggage Capacity in the car in Kg",
        example: 4,
        required: true,
    }),
    (0, class_validator_1.IsInt)({ message: "La capacité de bagages doit être un entier" }),
    (0, class_validator_1.IsNotEmpty)({ message: "La capacité de bagages ne peut pas être vide" }),
    (0, class_validator_1.Max)(150, { message: "La capacité de bagages ne peut pas dépasser 150 kg" }),
    (0, class_validator_1.Min)(1, { message: "La capacité de bagages doit être au moins de 1 kg" }),
    __metadata("design:type", Number)
], RegisterCarDto.prototype, "luggage_capacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "insurance_included",
        description: "Insurance inclusion of the car",
        example: true,
    }),
    (0, class_validator_1.IsBoolean)({
        message: "L'inclusion de l'assurance doit être de type booléen",
    }),
    (0, class_validator_1.IsNotEmpty)({ message: "L'inclusion de l'assurance ne peut pas être vide" }),
    __metadata("design:type", Boolean)
], RegisterCarDto.prototype, "insurance_included", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "pet_policy",
        description: "Are pets allowed in the car or not? if yes then true else false",
        example: true,
    }),
    (0, class_validator_1.IsBoolean)({
        message: "La politique concernant les animaux doit être de type booléen",
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "La politique concernant les animaux ne peut pas être vide",
    }),
    __metadata("design:type", Boolean)
], RegisterCarDto.prototype, "pet_policy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        name: "smoking_policy",
        description: "Fumer est-il autorisé dans la voiture ? Si oui, true sinon false",
        example: true,
    }),
    (0, class_validator_1.IsBoolean)({ message: "La politique de tabagisme doit être de type booléen" }),
    (0, class_validator_1.IsNotEmpty)({ message: "La politique de tabagisme ne peut pas être vide" }),
    __metadata("design:type", Boolean)
], RegisterCarDto.prototype, "smoking_policy", void 0);
//# sourceMappingURL=register-car.dto.js.map