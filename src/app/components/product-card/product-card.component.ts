import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Product } from 'src/app/entities/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';
import { ProductComponent } from '../product/product.component';
import { ProductViewComponent } from '../product-view/product-view.component';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent  implements OnInit {

  @Input() productCard!: Product
  @Input() displayIcon: string = 'cache'

  backendImages = environment.useBackendImages

  constructor(
    private authService: AuthService,
    private router: Router,
    private productService: ProductService,
    private modalCtrl: ModalController,
    private toastController: ToastController
  ) {
    // effect(() => {
    //   this.productService.signalRefresUpdateUpdated()
    // });
  }

  ngOnInit() {

  }

  async showDetail() {
    const modal = await this.modalCtrl.create({
      component: ProductViewComponent,
      componentProps: {
        product: this.productCard
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(`Hello, ${data}!`);
    }
  }

  addProductToCart = (product: Product) => {
    if (this.displayIcon !== 'disable') {
      const index = this.productService.cart.detail.findIndex(detail => detail.product.getId === product.getId)
      if (index !== -1)
        this.productService.cart.detail[index].qte++
      else
        this.productService.cart.detail.push({qte: 1, product: product})
    }
  }

  updateProduct = () => {
    this.router.navigateByUrl('VisiteurMenu/Produit', {state: this.productCard})
  }

  deteteProduct = (id: number) => {

    this.productService.deleteProduct(id).subscribe({
      next: (res: any) => {
        this.presentToast('middle', 'La prestation a été suprimée', 800)
        this.productService.products = this.productService.products.filter(product => product.getId !== id)
      },
        error: (error: { error: { message: any; }; }) => {
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

  refresh = () => {
    this.productService.refreshUpdate++
    this.productService.signalRefresUpdateUpdated.set(this.productService.refreshUpdate)
  }

  get getRole() {return this.authService.role}
  get getMenuIndex() {return this.authService.menuIndex}
  get getMenuTabs() {return this.authService.menuTabs}
  get getRefreshUpdate() {return this.productService.refreshUpdate}

}
