import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../entities/product';
import { Brand } from '../entities/brand';
import { ProductsType } from '../interfaces/products-type.interface';
import { BrandService } from '../services/brand.service';
import { ProductService } from '../services/product.service';

@Pipe({
  name: 'filterProduct'
})
export class FilterProductPipe implements PipeTransform {

  constructor (
    private brandService: BrandService,
    private productService: ProductService
  ) {}

  transform(products: Product[], ...args: unknown[]): Product[] {

    let brands!: Brand[]
    brands = this.brandService.brands.filter(brand => brand.checked)

    let productTypes: ProductsType[] = []
    productTypes = this.productService.productTypes.filter(productType => productType.checked)

    const filters = this.productService.filters

    return products.filter((product: Product) => {

      let returnValue = true

      if (brands.length > 0 && brands.findIndex(brand => brand.getId === product.getBrand.getId) < 0) {

        returnValue = false

      }
      else if (productTypes.length > 0 && productTypes.findIndex(productType => productType.productType === product.getType) < 0) {

        returnValue = false

      }
      else {

        filters.forEach(filter => {

        switch (filter.name) {

          case 'Prix' : {
            if (product.getPrice < filter.startValue || product.getPrice > filter.endValue)
              returnValue = false
            break
          }

        }

      })

    }

      return returnValue

    });

  }

}
