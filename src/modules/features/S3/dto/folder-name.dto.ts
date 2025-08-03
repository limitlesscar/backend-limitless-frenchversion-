import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { FolderName } from "../enums/folder-name.enum";

export class S3FolderNameDto {
  @ApiProperty({
    name: "folder",
    enum: FolderName,
    description: "Name of the folder where you want to upload the file",
  })
  @IsNotEmpty()
  @IsEnum(FolderName)
  folder: FolderName;
}
