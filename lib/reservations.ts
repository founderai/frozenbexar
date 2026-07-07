export type ReservationStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type ReservationItemInput = {
  itemName: string;
  unitPrice: number;
  quantity: number;
};

export type ReservationCreateInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventDate: string;
  dropoffDateTime: string;
  pickupDateTime: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  notes?: string;
  deliveryFee: number;
  items: ReservationItemInput[];
};

export function calculateLineTotal(unitPrice: number, quantity: number): number {
  return Number((unitPrice * quantity).toFixed(2));
}

export function calculateSubtotal(items: ReservationItemInput[]): number {
  return Number(items.reduce((sum, item) => sum + calculateLineTotal(item.unitPrice, item.quantity), 0).toFixed(2));
}

export function calculateEstimatedTotal(subtotal: number, deliveryFee: number): number {
  return Number((subtotal + deliveryFee).toFixed(2));
}

export function formatMoney(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
