import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client } from '../entities/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  clientInit = new Client().deserialize({
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    zip: '',
    locality: ''
  })

  client!: Client
  signalClientUpdated = signal(this.client)

  constructor(
    private http: HttpClient,
  ) {
    this.client = this.clientInit
    this.signalClientUpdated.set(this.clientInit)
  }

  getClient = (id: number): Observable<any> => {
    return this.http.get(
      environment.useBackendApi + `/api/users/${id}`,
    )
  }

  putClient = (client: Client): Observable<any> => {
    console.log(client)
    return this.http.put(
      environment.useBackendApi + `/api/users/${client.getId}`,
      client
    )
  }

}
