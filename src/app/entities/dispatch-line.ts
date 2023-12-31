import { Dispatch } from "./dispatch";
import { Product } from "./product";

export class DispatchLine {

  private id!: number
  private product!: Product
  private payedPrice!: number
  private quantity!: number

  constructor () {}

  get getId () { return this.id }
  set setId (id: number) {this.id = id}
  get getProduct () { return this.product }
  set setProduct (product: Product) {this.product = product}
  get getPayedPrice () { return this.payedPrice }
  set setPayedPrice (payedPrice: number) {this.payedPrice = payedPrice}
  get getQuantity () { return this.quantity }
  set setQuantity (quantity: number) {this.quantity = quantity}

  deserialize(data: any): DispatchLine {

    this.id = data.id
    this.product = new Product().deserialize(data.product)
    this.payedPrice = data.payedPrice
    this.quantity = data.quantity

    return this

  }

}
