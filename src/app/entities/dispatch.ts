import { State } from "../enums/state";
import { DispatchLine } from "./dispatch-line";

export class Dispatch {

  private id!: number
  private dispatchDate!: string
  private receptionDate!: string
  private dispatchLines!: DispatchLine[]
  private dispatchState!: State

  constructor () {}

  get getId () { return this.id }
  set setId (id: number) {this.id = id}
  get getDispatchDate () { return this.dispatchDate }
  set setDispatchDate (dispatchDate: string) {this.dispatchDate = dispatchDate}
  get getReceptionDate () { return this.receptionDate }
  set setReceptionDate (receptionDate: string) {this.receptionDate = receptionDate}
  get getDispatchLines () { return this.dispatchLines }
  set setDispatchLines (dispatchLines: DispatchLine[]) {this.dispatchLines = dispatchLines}
  get getDispatchState () { return this.dispatchState }
  set setDispatchState (dispatchState: State) {this.dispatchState = dispatchState}

  deserialize(data: any): Dispatch {

    let dispatchLinesDeSerialized: any[] = []
    if (data.dispatchLines != null) {
      data.dispatchLines.forEach((dispatchLine: DispatchLine) => {
        dispatchLinesDeSerialized.push(new DispatchLine().deserialize(dispatchLine))
      })
    }

    this.id = data.id
    this.dispatchDate = data.dispatchDate
    this.receptionDate = data.receptionDate
    this.dispatchLines = dispatchLinesDeSerialized
    this.dispatchState = data.dispatchState

    return this

  }

}
