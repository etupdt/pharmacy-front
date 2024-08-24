import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/entities/product';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product-view-card',
  templateUrl: './product-view-card.component.html',
  styleUrls: ['./product-view-card.component.scss'],
})
export class ProductViewCardComponent  implements OnInit {

  name: string = ''
  description: string = ''
  @Input() imagePath!: string
  priceToDisplay!: string
  label: string = ""
  imageToDisplay!: string

  isUpdated: boolean = false

  backendImages = environment.useBackendApi + '/assets/images/'

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.reinitProduct()
  }

  get getCartTotalSize() {
    let total = 0
    this.productService.cart.detail.forEach(detail => total += detail.qte)
    return total === 0 ? '' : total
  }

  reinitProduct = () => {

    this.name = this.getProduct.getProductName
    this.description = this.getProduct.getDescription
    this.priceToDisplay = Number(this.getProduct.getPrice).toFixed(2)
    this.label = this.getProduct.getLabel
    this.imagePath = this.getProduct.getImagePath
    this.setImageToDisplay = this.getProduct.getImagePath

    this.checkIsUpdated()

  }

  addProductToCart = () => {
    if (this.getProduct) {
      const index = this.productService.cart.detail.findIndex(detail => detail.product.getId === this.getProduct.getId)
      if (index !== -1)
        this.productService.cart.detail[index].qte++
      else
        this.productService.cart.detail.push({qte: 1, product: this.getProduct})
    }
  }

  checkIsUpdated = () => {
    this.isUpdated = this.getProduct.getProductName !== this.name ||
      this.getProduct.getDescription !== this.description ||
      Number(this.getProduct.getPrice).toFixed(2) !== this.priceToDisplay ||
      this.getProduct.getLabel !== this.label ||
      this.getProduct.getImagePath !== this.imagePath
  }

  get getProduct() {return this.productService.product}

  get getRole() {return this.authService.role}
  set setImageToDisplay (image: string) {this.imageToDisplay = image === 'defaultProduct.webp' ? this.backendImages + 'defaultProduct.webp' :  this.backendImages + '/products/' + image}

}
