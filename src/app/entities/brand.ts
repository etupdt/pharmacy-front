import { Entity } from "./entity"

export class Brand extends Entity {

  checked: boolean = false
  private id!: number
  private imagePath!: string

  get getId () { return this.id }
  set setId (id: number) {this.id = id}
  get getBrandName () { return this.name }
  set setBrandName (brandName: string) {this.name = brandName}
  get getImagePath () { return this.imagePath }
  set setImagePath (imagePath: string) {this.imagePath = imagePath}
  
  deserialize(data: any): Brand {

    this.id = data.id
    this.name = data.brandName
    this.imagePath = data.imagePath

    return this

  }

}
