export interface CarDetails {
    id: number;
    name: string;
    pickup_address: string;
    pickup_location: {
        long: number;
        lat: number;
    };
    stars: number;
}
