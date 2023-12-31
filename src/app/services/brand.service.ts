import { Injectable, signal } from '@angular/core';
import { Brand } from '../entities/brand';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  refreshUpdate: number = 0
  signalRefresUpdateUpdated = signal(this.refreshUpdate)

  brands: Brand[] = []

  signalBrandsUpdated = signal(this.brands)

  constructor(
    private http: HttpClient,
  ) {
    this.signalBrandsUpdated.set([])
    this.getBrands().subscribe({
      next: (res: any) => {
        let brands: Brand[] = []
        console.log('res', res)
        res.forEach((b: any) => {
          return brands.push(new Brand().deserialize(b))
        })
        this.brands = brands
        this.signalBrandsUpdated.set(brands)
      },
      error: (error: { error: { message: any; }; }) => {
        console.log('erreur lecture brands')
      }
    })
  }

  getBrands = (): Observable<any> => {

    return this.http.get(
      environment.useBackendApi + `/api/brands`,
    )

  }

  putBrand(brand: Brand, image: string): Observable<any> {

    const formData: FormData = new FormData();

    formData.append('id', brand.getId.toString())
    formData.append('brandName', brand.getBrandName)
    formData.append('imagePath', image)

    let headers = new HttpHeaders()
    headers.append('Content-Type','multipart/form-data')

    return this.http.put(
      environment.useBackendApi + `/api/brands/${brand.getId}`,
      formData,
      { headers }
    )

  }

  postBrand(brand: Brand, image: string): Observable<any> {

    const formData: FormData = new FormData();

    formData.append('id', brand.getId.toString())
    formData.append('brandName', brand.getBrandName)
    formData.append('imagePath', image)

    let headers = new HttpHeaders()
    headers.append('Content-Type','multipart/form-data')

    return this.http.post(
      environment.useBackendApi + `/api/brands`,
      formData,
      { headers }
    )

  }

  deleteBrand(id: number): Observable<any> {

    return this.http.delete(
      environment.useBackendApi + `/api/brands/${id}`,
    )

  }

}
