export class Client {

  private id!: number
  private email!: string
  private firstName!: string
  private lastName!: string
  private address1!: string
  private address2!: string
  private zip!: string
  private locality!: string

  constructor () {}

  get getId () { return this.id }
  set setId (id: number) {this.id = id}
  get getEmail () { return this.email }
  set setEmail (email: string) {this.email = email}
  get getFirstName () { return this.firstName }
  set setFirstName (firstName: string) {this.firstName = firstName}
  get getLastName () { return this.lastName }
  set setLastName (lastName: string) {this.lastName = lastName}
  get getAddress1 () { return this.address1 }
  set setAddress1 (address1: string) {this.address1 = address1}
  get getAddress2 () { return this.address2 }
  set setAddress2 (address2: string) {this.address2= this.address2}
  get getZip () { return this.zip }
  set setZip (zip: string) {this.zip = zip}
  get getLocality () { return this.locality }
  set setLocality (locality: string) {this.locality = locality}

  deserialize(data: any): Client {

    this.id = data.id
    this.email = data.email
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.address1 = data.address1
    this.address2 = data.address2
    this.zip = data.zip
    this.locality = data.locality

    return this

  }

}
