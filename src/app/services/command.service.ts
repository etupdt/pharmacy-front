import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Command } from '../entities/command';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Dispatch } from '../entities/dispatch';
import { DispatchLine } from '../entities/dispatch-line';
import { DisplayCart } from '../interfaces/displayCart.interface';
import { State } from '../enums/state';
import * as _ from 'lodash';
import { ClientService } from './client.service';
import { Client } from '../entities/client';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  constructor(
    private http: HttpClient,
    private clientService: ClientService,
  ) { }

  getCommands(client?: Client): Observable<any> {

    return this.http.get(
      environment.useBackendApi + `/command${client ? '/' + client.getId : ''}`
    )

  }

  postCommand = (cart: DisplayCart): Observable<any> => {

    const dayDate = new Date()
    let datePreparation = new Date()
    let dateDelivery = new Date()

    let dispatchLines: DispatchLine[] = []
    cart.detail.forEach(detail => {

      dispatchLines.push(new DispatchLine().deserialize({
        id: 0,
        product: detail.product,
        payedPrice: detail.product.getPrice,
        quantity: detail.qte
      }))
    })

    let dispatchGroup = _.groupBy(dispatchLines, 'product.preparationTime')

    let dispatches: Dispatch[] = []
    Object.entries(dispatchGroup).forEach(([key, value], index) => {
      datePreparation.setDate(dayDate.getDate() + value[0].getProduct.getPreparationTime)
      dateDelivery.setDate(datePreparation.getDate() + 1)
      dispatches.push(new Dispatch().deserialize({
        id: 0,
        dispatchDate: formatDate(datePreparation,'dd/MM/yyyy', 'fr'),
        receptionDate: formatDate(dateDelivery,'dd/MM/yyyy', 'fr'),
        dispatchLines: value,
        dispatchState: State.EN_COURS
      }))
    })

    let command = new Command().deserialize({
      id: 0,
      paymentDate: formatDate(dayDate,'dd/MM/yyyy', 'fr'),
      dispatches: dispatches,
      commandState: State.EN_COURS,
      client: this.clientService.client
    })

    console.log(command)

    return this.http.post(
      environment.useBackendApi + `/command`,
      command
    )

  }

}
