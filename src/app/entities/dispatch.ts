import { State } from "../enums/state";
import { DispatchLine } from "./dispatch-line";

export class Dispatch {
  
  constructor (    
    private id: number,
    private dispatchDate: string,
    private receptionDate: string,
    private dispatchLines: DispatchLine[],
    private dispatchState: State
  ) {}

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

  static deserialize(data: any): Dispatch {

    let dispatchLinesDeSerialized: any[] = []
    if (data.dispatchLines != null) {
      data.dispatchLines.forEach((dispatchLine: DispatchLine) => {
        dispatchLinesDeSerialized.push(DispatchLine.deserialize(dispatchLine))
      })
    }

    return new Dispatch(data.id,
    data.dispatchDate,
    data.receptionDate,
    dispatchLinesDeSerialized,
    data.dispatchState)

  }

}
