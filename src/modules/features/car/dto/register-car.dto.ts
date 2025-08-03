import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { CarBrand } from "../enums/brand.enum";
import { VehicleType } from "../enums/vehicle-type.enum";
import { EngineType } from "../enums/engine-type.enum";
import { TransmissionType } from "../enums/transmission-type.enum";
import { CarFeatures } from "../enums/features.enum";

export class RegisterCarDto {
  @ApiProperty({
    name: "name",
    description: "Name of the car",
    example: "Toyota Camry",
  })
  @IsString({ message: "Car Name must be a string" })
  @MinLength(1, {
    message: "Le nom de la voiture doit contenir au moins 4 caractères ",
  })
  @MaxLength(5, {
    message: "Le nom de la voiture ne doit pas dépasser 15 caractères  ",
  })
  @Matches(/^[a-zA-Z0-9 ]+$/, {
    message:
      "Le nom de la voiture ne doit contenir que des lettres, des chiffres et des espaces",
  })
  name: string;
  @ApiProperty({
    name: "images",
    description: "Images of the car",
    example: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
  })
  @IsArray({
    message: "Les images doivent être un tableau de chaînes de caractères",
  })
  @IsString({ each: true, message: "Images must be an array of strings" })
  @IsNotEmpty({ message: "Les images ne peuvent pas être vides" })
  @ArrayMinSize(1, {
    message: "Il doit y avoir au moins une image de la voiture",
  })
  @ArrayMaxSize(7, {
    message: "Le nombre d’images de la voiture ne doit pas dépasser 7",
  })
  images: string[];
  @ApiProperty({
    name: "brand",
    description: "Brand of the car",
    enum: CarBrand,
  })
  @IsEnum(CarBrand, { message: "Marque de voiture invalide" })
  @IsNotEmpty({ message: "La marque de la voiture ne peut pas être vide" })
  brand: CarBrand;

  @ApiProperty({
    name: "description",
    description: "Description de la voiture",
    example: "Une voiture brillante avec un moteur puissant",
  })
  @IsString({ message: "La description doit être une chaîne de caractères" })
  @MinLength(10, {
    message: "La description doit contenir au moins 10 caractères",
  })
  @MaxLength(255, {
    message: "La description ne doit pas dépasser 255 caractères",
  })
  @IsNotEmpty({ message: "La description de la voiture ne peut pas être vide" })
  description: string;

  @ApiProperty({
    name: "price_per_day",
    description: "Prix par jour de la voiture en Euros",
    example: 100,
  })
  @IsNotEmpty({ message: "Le prix par jour ne peut pas être vide" })
  @IsInt({ message: "Le prix par jour doit être un entier" })
  price_per_day: number;

  @ApiProperty({
    name: "price_per_hour",
    description: "Prix par heure de la voiture en Euros",
    example: 20,
  })
  @IsNotEmpty({ message: "Le prix par heure ne peut pas être vide" })
  @IsInt({ message: "Le prix par heure doit être un entier" })
  price_per_hour: number;

  @ApiProperty({
    name: "vehicle_type",
    description: "Type de véhicule",
    enum: VehicleType,
  })
  @IsEnum(VehicleType, { message: "Type de véhicule invalide" })
  @IsNotEmpty({ message: "Le type de véhicule ne peut pas être vide" })
  vehicle_type: VehicleType;

  @ApiProperty({
    name: "country_of_manufacture",
    description: "Pays de fabrication de la voiture",
    example: "USA",
  })
  @IsString({
    message: "Le pays de fabrication doit être une chaîne de caractères",
  })
  @MinLength(3, {
    message: "Le pays de fabrication doit contenir au moins 3 caractères",
  })
  @MaxLength(255, {
    message: "Le pays de fabrication ne doit pas dépasser 255 caractères",
  })
  @IsNotEmpty({ message: "Le pays de fabrication ne peut pas être vide" })
  country_of_manufacture: string;

  @ApiProperty({
    name: "city_of_registeration",
    description: "Ville d'enregistrement de la voiture",
    example: "New York",
  })
  @IsString({
    message: "La ville d'enregistrement doit être une chaîne de caractères",
  })
  @MinLength(3, {
    message: "La ville d'enregistrement doit contenir au moins 3 caractères",
  })
  @MaxLength(255, {
    message: "La ville d'enregistrement ne doit pas dépasser 255 caractères",
  })
  @IsNotEmpty({ message: "La ville d'enregistrement ne peut pas être vide" })
  city_of_registeration: string;

  @ApiProperty({
    name: "color_code",
    description: "Couleur de la voiture",
    example: "#FF0000",
  })
  @IsNotEmpty({ message: "La couleur de la voiture ne peut pas être vide" })
  @IsString({
    message: "La couleur de la voiture doit être une chaîne de caractères",
  })
  color_code: string;

  @ApiProperty({
    name: "mileage",
    description: "Kilométrage de la voiture en km",
    example: 10000,
  })
  @IsNotEmpty({ message: "Le kilométrage de la voiture ne peut pas être vide" })
  @IsInt({ message: "Le kilométrage doit être un entier" })
  mileage: number;

  @ApiProperty({
    name: "engine_type",
    description: "Type de moteur",
    enum: EngineType,
  })
  @IsEnum(EngineType, { message: "Type de moteur invalide" })
  @IsNotEmpty({
    message: "Le type de moteur de la voiture ne peut pas être vide",
  })
  engine_type: EngineType;

  @ApiProperty({
    name: "transmission_type",
    description: "Transmission type",
    enum: [
      TransmissionType.Automatic_Transmission,
      TransmissionType.Manual_Transmission,
      TransmissionType.Continuously_Variable_Transmission,
      TransmissionType.Dual_Clutch_Transmission,
    ],
  })
  @IsEnum(TransmissionType, { message: "Type de transmission invalide" })
  @IsNotEmpty({
    message: "Le type de transmission de la voiture ne peut pas être vide",
  })
  transmission_type: TransmissionType;

  @ApiProperty({
    name: "fuel_economy",
    description: "Consommation de carburant de la voiture en km/l",
    example: 10,
  })
  @IsNotEmpty({
    message: "La consommation de carburant de la voiture ne peut pas être vide",
  })
  @IsInt({ message: "La consommation de carburant doit être un entier" })
  fuel_economy: number;

  @ApiProperty({
    name: "available_start_date_time",
    description: "Date et heure de début de disponibilité de la voiture",
    example: "2024-12-25T12:00:00Z",
  })
  @IsString({
    message: "La date et l'heure de début doivent être une chaîne valide",
  })
  @IsNotEmpty({
    message:
      "La date de début de disponibilité de la voiture ne peut pas être vide",
  })
  available_start_date_time: string;

  @ApiProperty({
    name: "available_end_date_time",
    description: "Date et heure de fin de disponibilité de la voiture",
    example: "2024-12-26T12:00:00Z",
  })
  @IsString({
    message: "La date et l’heure de fin doivent être une chaîne valide",
  })
  @IsNotEmpty({
    message:
      "La date de fin de disponibilité de la voiture ne peut pas être vide",
  })
  available_end_date_time: string;

  @ApiProperty({
    name: "pickup_address",
    description: "L'adresse où vous devez prendre la voiture",
    example: "Lahore",
  })
  @IsString({
    message: "L'adresse de prise en charge doit être une chaîne de caractères",
  })
  @IsNotEmpty({
    message: "L'adresse de prise en charge de la voiture ne peut pas être vide",
  })
  pickup_address: string;

  @ApiProperty({
    name: "dropoff_address",
    description: "L'adresse où vous devez déposer la voiture",
    example: "Karachi",
  })
  @IsString({
    message: "L'adresse de dépôt doit être une chaîne de caractères",
  })
  @IsNotEmpty({
    message: "L'adresse de dépôt de la voiture ne peut pas être vide",
  })
  dropoff_address: string;

  @ApiProperty({
    name: "features",
    description: "List of car features",
    enum: CarFeatures,
    isArray: true,
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty({
    message: "Les caractéristiques de la voiture ne peuvent pas être vides",
  })
  @IsEnum(CarFeatures, { each: true })
  features: CarFeatures[];

  @ApiProperty({
    name: "maximum_passengers",
    description: "Maximum passengers allowed in the car",
    example: 4,
    required: true,
  })
  @IsInt({ message: "Le nombre maximum de passagers doit être un entier" })
  @IsNotEmpty({
    message: "Le nombre maximum de passagers ne peut pas être vide",
  })
  @Max(20, {
    message: "Le nombre maximum de passagers ne peut pas dépasser 20",
  })
  @Min(2, { message: "Il doit y avoir au moins 2 passagers" })
  maximum_passengers: number;

  @ApiProperty({
    name: "luggage_capacity",
    description: "Luggage Capacity in the car in Kg",
    example: 4,
    required: true,
  })
  @IsInt({ message: "La capacité de bagages doit être un entier" })
  @IsNotEmpty({ message: "La capacité de bagages ne peut pas être vide" })
  @Max(150, { message: "La capacité de bagages ne peut pas dépasser 150 kg" })
  @Min(1, { message: "La capacité de bagages doit être au moins de 1 kg" })
  luggage_capacity: number;

  @ApiProperty({
    name: "insurance_included",
    description: "Insurance inclusion of the car",
    example: true,
  })
  @IsBoolean({
    message: "L'inclusion de l'assurance doit être de type booléen",
  })
  @IsNotEmpty({ message: "L'inclusion de l'assurance ne peut pas être vide" })
  insurance_included: boolean;

  @ApiProperty({
    name: "pet_policy",
    description:
      "Are pets allowed in the car or not? if yes then true else false",
    example: true,
  })
  @IsBoolean({
    message: "La politique concernant les animaux doit être de type booléen",
  })
  @IsNotEmpty({
    message: "La politique concernant les animaux ne peut pas être vide",
  })
  pet_policy: boolean;

  @ApiProperty({
    name: "smoking_policy",
    description:
      "Fumer est-il autorisé dans la voiture ? Si oui, true sinon false",
    example: true,
  })
  @IsBoolean({ message: "La politique de tabagisme doit être de type booléen" })
  @IsNotEmpty({ message: "La politique de tabagisme ne peut pas être vide" })
  smoking_policy: boolean;
}
