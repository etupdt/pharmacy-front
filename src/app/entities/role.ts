import { Entity } from "./entity"

export class Role extends Entity {

  checked: boolean = false

  constructor (private id: number, private role: string, private index: number, name: string) {
    super(name)
  }

  get getId () { return this.id }
  set setId (id: number) {this.id = id}
  get getRole () { return this.role }
  set setRole (role: string) {this.role = role}
  get getIndex () { return this.index }
  set setIndex (index: number) {this.index = index}
  get getRoleName () { return this.name }
  set setRoleName (roleName: string) {this.name = roleName}
  
  static deserialize(data: any): Role {

    return new Role(data.id, data.role, data.index, data.brandName)

  }

}
