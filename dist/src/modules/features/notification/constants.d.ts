export declare const NOTIFICATIONS_MESSAGES: {
    BOOKING_CREATED: (name: string, car_name: string) => {
        message: string;
    };
    NEW_MESSAGE: (name: string) => {
        message: string;
    };
    PICKUP_COMPLETE: string;
    DROP_OFF_COMPLETE: string;
    BOOKING_COMPLETED: (car_name: string) => {
        message: string;
    };
    BOOKING_CANCELLED: (car_name: string, user_name: string) => {
        message: string;
    };
    PAYMENT_COMPLETED: (car_name: string) => {
        message: string;
    };
    PAYMENT_FAILED: (car_name: string) => {
        message: string;
    };
    REVIEW_PENDING: (user_name: string, car_name: string) => {
        message: string;
    };
    REVIEW_COMPLETED: (car_name: string, user_name: string) => {
        message: string;
    };
    REFUND_COMPLETED: (car_name: string) => {
        message: string;
    };
    CAR_EXPIRED: (car_name: string) => {
        message: string;
    };
};
