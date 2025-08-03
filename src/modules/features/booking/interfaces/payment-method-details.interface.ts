export interface PaymentMethodDetails {
  payment_method_id: string;
  stripe_charge_id: string;
  lastFour: string;
  brand: string;
  transfer_group: string;
}
