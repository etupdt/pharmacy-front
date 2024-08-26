import { Entity } from "./entity"

export class Brand extends Entity {

  checked: boolean = false

  constructor (private id: number, name: string, private imagePath: string) {
    super(name)
  }

  get getId () { return this.id }
  set setId (id: number) {this.id = id}
  get getBrandName () { return this.name }
  set setBrandName (brandName: string) {this.name = brandName}
  get getImagePath () { return this.imagePath }
  set setImagePath (imagePath: string) {this.imagePath = imagePath}
  
  static deserialize(data: any): Brand {

    return new Brand(data.id, data.brandName, data.imagePath)

  }

}
