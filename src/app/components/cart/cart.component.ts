import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Product } from 'src/app/entities/product';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent  implements OnInit {

  backendImages = environment.useBackendImages

  constructor(
    private productService: ProductService,
    private modalCtrl: ModalController,
    private commandService: CommandService,
    private toastController: ToastController
  ) { }

  ngOnInit(
  ) {

  }

  getCartTotal = () => {
    let total = 0
    this.productService.cart.detail.forEach(detail => total += detail.product.getPrice * detail.qte)
    return total
  }

  deleteCartProduct (product: Product) {
    const index = this.productService.cart.detail.findIndex(detail => detail.product.getId === product.getId)
    if (index !== -1) {
      if (this.productService.cart.detail[index].qte === 1) {
        this.productService.cart.detail.splice(index, 1)
      } else {
        this.productService.cart.detail[index].qte--
      }
    }
    if (this.productService.cart.detail.length === 0)
      this.back()
  }

  deleteAllCartProducts () {
    this.productService.cart = {
      display: false,
      detail: []
    }
  }

  createCommand = () => {

    this.commandService.postCommand(this.productService.cart).subscribe({
      next: (res: any[]) => {
        this.deleteAllCartProducts()
        this.presentToast('middle', 'Commande enregistrée !', 800)
        this.back()
      },
      error: (error: { error: { message: any; }; }) => {
        this.presentToast('middle', 'Erreur lors de l\'enregistrement de la commande !', 3000)
      }
    })

/*    this.productService.sendMail({
      auth: this.clientService.client,
      command: this.productService.cart.detail
    }).subscribe({
      next: (res: any[]) => {
        this.productService.cart.detail = []
        this.productService.cart.display = false
      },
      error: (error: { error: { message: any; }; }) => {
      }
    })
*/
  }

  back = () => {
    return this.modalCtrl.dismiss(null, 'return');
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position,
    });

    await toast.present();
  }

  get getCart () {return this.productService.cart}

}
