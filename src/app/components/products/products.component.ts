import { Component, OnInit, effect } from '@angular/core';
import { Product } from 'src/app/entities/product';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';
import { InfiniteScrollCustomEvent, ModalController, ToastController } from '@ionic/angular';
import { ProductsType } from 'src/app/interfaces/products-type.interface';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit{

  productTypes$: ProductsType[] = []

  backendImages = environment.useBackendApi + '/assets/images/'

  refresh: number = 0

  selectedLangage$!: string

  constructor (
    private productService: ProductService,
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController
  ) {
    effect(() => {
      this.productService.signalRefresUpdateUpdated()
    });
  }

  ngOnInit(): void {

    this.getProducts()

  }

  getCartTotal = () => {
    let total = 0
    this.productService.cart.detail.forEach(detail => total += detail.product.getPrice * detail.qte)
    return total
  }

  addProduct = () => {
    this.productService.product = Product.deserialize({
      id: 0,
      productName: '',
      label: '',
      description: '',
      price: 0,
      stock: 0,
      brand: {
        id: 0
      },
      imagePath: 'default.webp',
      type: 0,
      preparationTime: 0,
      commandTime: 0,
      deliveryTime: 0,
    })
    this.router.navigateByUrl('VisiteurMenu/Produit')
  }

  getProducts = () => {

    this.productService.getProducts().subscribe({
      next: (res: any) => {
        let products: Product[] = []
        res.forEach((p: any) => {
          products.push(Product.deserialize(p));
        })
        this.productService.products = products
      },
      error: (error: { error: { message: any; }; }) => {
        this.presentToast('middle', error.error.message, 800)
      }
    })

  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position,
    });

    await toast.present();
  }

  get getDetail () {return this.productService.detail}
  get getFilters() {return this.productService.filters}
  get getRefresh() {return this.productService.refresh}
  get getProductsFromService() {return this.productService.products}
  get getRole() {return this.authService.role}
  get getRefreshUpdate() {
    return this.productService.refreshUpdate
  }

}
