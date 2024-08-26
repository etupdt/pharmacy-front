import { Dispatch } from "./dispatch";
import { Product } from "./product";

export class DispatchLine {

  constructor (
    private id: number,
    private product: Product,
    private payedPrice: number,
    private quantity: number
  ) {}

  get getId () { return this.id }
  set setId (id: number) {this.id = id}
  get getProduct () { return this.product }
  set setProduct (product: Product) {this.product = product}
  get getPayedPrice () { return this.payedPrice }
  set setPayedPrice (payedPrice: number) {this.payedPrice = payedPrice}
  get getQuantity () { return this.quantity }
  set setQuantity (quantity: number) {this.quantity = quantity}

  static deserialize(data: any): DispatchLine {

    return new DispatchLine(data.id,
    Product.deserialize(data.product),
    data.payedPrice,
    data.quantity)

  }

}
