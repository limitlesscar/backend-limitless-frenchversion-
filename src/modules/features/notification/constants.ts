export const NOTIFICATIONS_MESSAGES = {
  BOOKING_CREATED: (name: string, car_name: string) => ({
    message: `${name} has booked your car ${car_name}`,
  }),
  NEW_MESSAGE: (name: string) => ({
    message: `${name} just sent you a message`,
  }),
  PICKUP_COMPLETE: `Your car pickup has just started`,
  DROP_OFF_COMPLETE: `Your car drop off has been finished `,
  BOOKING_COMPLETED: (car_name: string) => ({
    message: `Your booking of ${car_name} has been finished successfully`,
  }),
  BOOKING_CANCELLED: (car_name: string, user_name: string) => ({
    message: `Your booking of ${car_name} has been cancelled by ${user_name}`,
  }),
  PAYMENT_COMPLETED: (car_name: string) => ({
    message: `Your payment of ${car_name} has been completed`,
  }),
  PAYMENT_FAILED: (car_name: string) => ({
    message: `Your payment of ${car_name} has been failed`,
  }),
  REVIEW_PENDING: (user_name: string, car_name: string) => ({
    message: `Hi ${user_name}, your review for the ${car_name} is still pending. We'd greatly appreciate your feedback!`,
  }),
  REVIEW_COMPLETED: (car_name: string, user_name: string) => ({
    message: `Your car ${car_name} has been reviewed by ${user_name}`,
  }),
  REFUND_COMPLETED: (car_name: string) => ({
    message: `Your refund for ${car_name} will be received within 5-10 working days`,
  }),
  CAR_EXPIRED: (car_name: string) => ({
    message: `Your car ${car_name} has been unpublished due to expiration of its availability, please renew it`,
  }),
};
