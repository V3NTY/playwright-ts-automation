import { generateRandomUserData } from "./helpers";

export interface OrderedProduct {
  name: string;
  price: string;
  quantity: number | string;
  total?: string;
}
export type UserData = ReturnType<typeof generateRandomUserData>;

export interface CartItem {
  name: string;
  price: string;
  quantity: string;
  totalPrice: string;
}

export interface ProductDetails {
  name: string;
  category: string;
  price: string;
  availability: string;
  condition: string;
  brand: string;
}
