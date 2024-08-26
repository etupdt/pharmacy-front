import { State } from "../enums/state"
import { Client } from "./client"
import { Dispatch } from "./dispatch"

export class Command {

  constructor (
    private id: number,
    private paymentDate: string,
    private dispatches: Dispatch[],
    private commandState: State,
    private client: Client
  ) {}

  get getId () { return this.id }
  set setId (id: number) {this.id = id}
  get getPaymentDate () { return this.paymentDate }
  set setPaymentDate (paymentDate: string) {this.paymentDate = paymentDate}
  get getDispatches () { return this.dispatches }
  set setDispatches (dispatches: Dispatch[]) {this.dispatches = dispatches}
  get getCommandState ():State { return this.commandState }
  set setCommandState (commandState: State) {this.commandState = commandState}
  get getClient () { return this.client }
  set setClient (client: Client) {this.client = client}

  static deserialize(data: any): Command {

    let dispatchesDeSerialized: any[] = []
    if (data.dispatches != null) {
      data.dispatches.forEach((dispatch: Dispatch) => {
        dispatchesDeSerialized.push(Dispatch.deserialize(dispatch))
      })
    }

    return new Command(data.id,
    data.paymentDate,
    dispatchesDeSerialized,
    data.commandState,
    new Client().deserialize(data.client))

  }

}
