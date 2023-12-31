import { ProductType } from "../enums/product-type"
import { Brand } from "./brand"

export class Product {

  private id!: number
  private productName!: string
  private label!: string
  private description!: string
  private price!: number
  private brand!: Brand
  private imagePath!: string
  private type!: ProductType
  private preparationTime!: number
  private commandTime!: number
  private deliveryTime!: number

  constructor () {}

  get getId () { return this.id }
  set setId (id: number) {this.id = id}
  get getProductName () { return this.productName }
  set setProductName (productName: string) {this.productName = productName}
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

  deserialize(data: any): Product {

    this.id = data.id
    this.productName = data.productName
    this.label = data.label
    this.description = data.description
    this.price = data.price
    this.brand = new Brand().deserialize(data.brand)
    this.imagePath = data.imagePath
    this.type = data.type
    this.preparationTime = data.preparationTime
    this.commandTime = data.commandTime
    this.deliveryTime = data.deliveryTime

    return this

  }

}
