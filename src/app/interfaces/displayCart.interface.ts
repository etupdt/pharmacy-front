import { Product } from "../entities/product";

export interface DisplayCart {
  display: boolean,
  detail: {
    qte: number,
    product: Product
  }[]
}
