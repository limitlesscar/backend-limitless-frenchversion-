export interface PaymentIntentMetadata {
  payment_method_id: string;

  stripe_customer_id?: string;
  payable_amount: number;
  car_id: number;
  car_name: string;
  start_date_time: string;
  end_date_time: string;
  user_id: number;
}
