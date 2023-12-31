import { Client } from "../entities/client";
import { Product } from "../entities/product";

export interface MailCommand {
  auth: Client,
  command: {
    qte: number,
    product: Product
  }[]
}
