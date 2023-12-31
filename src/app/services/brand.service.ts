import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Brand } from '../entities/brand';
import { ProductType } from '../enums/product-type';
import { ProductsType } from '../interfaces/products-type.interface';
import mockBrands from '../../assets/data/mockBrands.json'
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

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

}
