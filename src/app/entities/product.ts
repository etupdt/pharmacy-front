import { ProductType } from "../enums/product-type"
import { Brand } from "./brand"
import { Entity } from "./entity"

export class Product extends Entity{

  constructor (
    private id: number,
    name: string,
    private label: string,
    private description: string,
    private price: number,
    private brand: Brand,
    private imagePath: string,
    private type: ProductType,
    private preparationTime: number,
    private commandTime: number,
    private deliveryTime: number
  ) {
    super(name)
  }

  get getId () { return this.id }
  set setId (id: number) {this.id = id}
  get getProductName () { return this.name }
  set setProductName (productName: string) {this.name = productName}
  get getLabel () { return this.label }
  set setLabel (label: string) {this.label = label}
  get getDescription () { return this.description }
  set setDescription (description: string) {this.description = description}
  get getPrice () { return this.price }
  set setPrice (price: number) {this.price = price}
  get getBrand () { return this.brand }
  set setBrand (brand: Brand) {this.brand = brand}
  get getImagePath () { return this.imagePath }
  set setImagePath (imagePath: string) {this.imagePath = imagePath}
  get getType () { return this.type }
  set setType (type: ProductType) {this.type = type}
  get getPreparationTime () { return this.preparationTime }
  set setPreparationTime (preparationTime: number) {this.preparationTime = preparationTime}
  get getCommandTime () { return this.commandTime }
  set setCommandTime (commandTime: number) {this.commandTime = commandTime}
  get getDeliveryTime () { return this.deliveryTime }
  set setDeliveryTime (deliveryTime: number) {this.deliveryTime = deliveryTime}

  static deserialize(data: any): Product {

    return new Product(data.id,
    data.productName,
    data.label,
    data.description,
    data.price,
    Brand.deserialize(data.brand),
    data.imagePath,
    data.type,
    data.preparationTime,
    data.commandTime,
    data.deliveryTime)

  }

}
