import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OnSiteService } from '../entities/on-site-service';

@Injectable({
  providedIn: 'root'
})
export class OnSiteServiceService {

  refreshUpdate: number = 0
  signalRefresUpdateUpdated = signal(this.refreshUpdate)

  onSiteServices: OnSiteService[] = []

  constructor(
    private http: HttpClient,
  ) { }

  getOnSiteServices(): Observable<any> {

    return this.http.get(
      environment.useBackendApi + `/api/onsiteservices`,
    )

  }

  putOnSiteService(onSiteService: OnSiteService, image: string): Observable<any> {

    const formData: FormData = new FormData();

    formData.append('id', onSiteService.getId.toString())
    formData.append('onSiteServiceName', onSiteService.getOnSiteServiceName)
    formData.append('description', onSiteService.getDescription)
    formData.append('price', onSiteService.getPrice.toString())
    formData.append('duree', onSiteService.getDuree.toString())
    formData.append('imagePath', image)

    let headers = new HttpHeaders()
    headers.append('Content-Type','multipart/form-data')

    return this.http.put(
      environment.useBackendApi + `/api/onsiteservices/${onSiteService.getId}`,
      formData,
      { headers }
    )

  }

  postOnSiteService(onSiteService: OnSiteService, image: string): Observable<any> {

    const formData: FormData = new FormData();

    formData.append('id', onSiteService.getId.toString())
    formData.append('onSiteServiceName', onSiteService.getOnSiteServiceName)
    formData.append('description', onSiteService.getDescription)
    formData.append('price', onSiteService.getPrice.toString())
    formData.append('duree', onSiteService.getDuree.toString())
    formData.append('imagePath', image)

    let headers = new HttpHeaders()
    headers.append('Content-Type','multipart/form-data')

    return this.http.post(
      environment.useBackendApi + `/api/onsiteservices`,
      formData,
      { headers }
    )

  }

  deleteOnSiteService(id: number): Observable<any> {

    return this.http.delete(
      environment.useBackendApi + `/api/onsiteservices/${id}`,
    )

  }

}
