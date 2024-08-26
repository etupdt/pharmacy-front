import { environment } from "src/environments/environment"
import { Entity } from "./entity"

export class OnSiteService extends Entity {

  constructor (
  private id: number,
  name: string,
  private description: string,
  private price: number,
  private duree: number,
  private imagePath: string) {
    super(name)
  }

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

  static deserialize(data: any): OnSiteService {

    return new OnSiteService(data.id, data.onSiteServiceName, data.description, data.price, data.duree, data.imagePath)

  }

}
