import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/entities/product';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';
import { CartComponent } from '../cart/cart.component';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss'],
})
export class ProductViewComponent  implements OnInit {

  product!: Product

  @Input() productView!: Product

  backendImages = environment.useBackendImages

  constructor(
    private productService: ProductService,
    private toastController: ToastController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    if (this.product) {
      this.productView = this.product
    }
  }

  get getCartTotalSize() {
    let total = 0
    this.productService.cart.detail.forEach(detail => total += detail.qte)
    return total === 0 ? '' : total
  }

  addProductToCart = (product: Product) => {
    if (this.product) {
      if (this.product) {
        const index = this.productService.cart.detail.findIndex(detail => detail.product.getId === product.getId)
        if (index !== -1)
          this.productService.cart.detail[index].qte++
        else
          this.productService.cart.detail.push({qte: 1, product: product})
      }
    }
  }

  back = () => {
    if (this.product) {
      return this.modalCtrl.dismiss(null, 'return');
    }
    return
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Le panier est vide !',
      duration: 800,
      position: position,
    });

    await toast.present();
  }

  async showCart() {

    if (this.product) {

      if (this.productService.cart.detail.length === 0) {
        this.presentToast("middle")
        return
      }

      const modal = await this.modalCtrl.create({
        component: CartComponent,
      });

      modal.present();

      const { data, role } = await modal.onWillDismiss();

      if (role === 'confirm') {
        console.log(`Hello, ${data}!`);
      }

    }

  }

}
