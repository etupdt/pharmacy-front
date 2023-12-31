export class Brand {

  checked: boolean = false
  private id!: number
  private brandName!: string
  private imagePath!: string

  constructor (
  ) {}

  get getId () { return this.id }
  set setId (id: number) {this.id = id}
  get getBrandName () { return this.brandName }
  set setBrandName (brandName: string) {this.brandName = brandName}
  get getImagePath () { return this.imagePath }
  set setImagePath (imagePath: string) {this.imagePath = imagePath}

  deserialize(data: any): Brand {

    this.id = data.id
    this.brandName = data.brandName
    this.imagePath = data.imagePath

    return this

  }

}
