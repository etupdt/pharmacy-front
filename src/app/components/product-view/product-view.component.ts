import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  @Output() product: EventEmitter<Product> = new EventEmitter();

  backendImages = environment.useBackendApi + '/assets/images/'

  imageToDisplay!: string

  constructor(
    private productService: ProductService,
    private toastController: ToastController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.setImageToDisplay = this.getProduct.getImagePath
  }

  get getCartTotalSize() {
    let total = 0
    this.productService.cart.detail.forEach(detail => total += detail.qte)
    return total === 0 ? '' : total
  }

  back = () => {
    if (this.getProduct) {
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

  get getProduct() {
    console.log('phase 3.2')
    return this.productService.product
  }

  set setImageToDisplay (image: string) {this.imageToDisplay = image === 'defaultProduct.webp' ? this.backendImages + 'defaultProduct.webp' :  this.backendImages + '/products/' + image}

}
