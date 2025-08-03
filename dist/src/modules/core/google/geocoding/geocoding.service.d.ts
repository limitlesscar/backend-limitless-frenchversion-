import { ConfigService } from "@nestjs/config";
import { Coordinates } from "src/types/common.type";
export declare class GeocodingService {
    private readonly configService;
    private client;
    constructor(configService: ConfigService);
    geocode(address: string): Promise<Coordinates | null>;
}
