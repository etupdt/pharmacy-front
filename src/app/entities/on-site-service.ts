import { environment } from "src/environments/environment"
import { Entity } from "./entity"

export class OnSiteService extends Entity {

  private id!: number
  private description!: string
  private price!: number
  private duree!: number
  private imagePath!: string

  backendImages = environment.useBackendImages

  get getId () { return this.id }
  set setId (id: number) {this.id = id}
  get getOnSiteServiceName () { return this.name }
  set setOnSiteServiceName (onSiteServiceName: string) {this.name = onSiteServiceName}
  get getDescription () { return this.description }
  set setDescription (description: string) {this.description = description}
  get getPrice () { return this.price }
  set setPrice (price: number) {this.price = price}
  get getDuree () { return this.duree }
  set setDuree (duree: number) {this.duree = duree}
  get getImagePath () {return this.imagePath}
  set setImagePath (imagePath: string) {this.imagePath = imagePath}

  deserialize(data: any): OnSiteService {

    this.id = data.id
    this.name = data.onSiteServiceName
    this.description = data.description
    this.price = data.price
    this.duree = data.duree
    this.imagePath = data.imagePath

    return this

  }

}
