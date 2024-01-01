import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, effect } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Product } from 'src/app/entities/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';
import { ProductViewComponent } from '../product-view/product-view.component';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent  implements OnInit, OnChanges {

  @Input() displayIcon: string = 'cache'

  @Input() imageEditing: number = -1
  @Input() productCard!: Product
  @Output() cardIdSelected: EventEmitter<number> = new EventEmitter();

  name: string = ''
  description: string = ''
  @Input() imagePath!: string
  priceToDisplay!: string
  duree: number = 0
  imageToDisplay!: string

  isUpdated: boolean = false

  backendImages = environment.useBackendApi + '/assets/images/'
  modalCtrl: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private productService: ProductService,
    private toastController: ToastController
  ) {
  }

  ngOnInit() {
    console.log('init product card')
    this.reinitProduct()
  }

  ngOnChanges(changes: SimpleChanges) {

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

  editImage = () => {
    if (this.getRole >= 3) {
      if (this.imageEditing === this.productCard.getId)
        this.cardIdSelected.emit(-1)
      else
        this.cardIdSelected.emit(this.productCard.getId)
    }
  }

  saveProduct = () => {

    this.productCard.setProductName = this.name

    this.cardIdSelected.emit(-1)

    const index = this.productService.products.findIndex(product => product.getId === this.productCard.getId)

    if (this.productCard.getId === 0) {

      this.productService.postProduct(this.productCard, this.imagePath).subscribe({
        next: (res: any) => {
          this.presentToast('middle', 'La prestation a été créée', 800)
          this.productCard = new Product().deserialize(res)
          this.productService.products[index] = this.productCard
          this.reinitProduct()
          this.refresh()
        },
        error: (error: { error: { message: any; }; }) => {
          this.presentToast('middle', error.error.message, 800)
        }
      })

    } else {

      this.productService.putProduct(this.productCard, this.imagePath).subscribe({
        next: (res: any) => {
          this.presentToast('middle', 'La prestation a été mise à jour', 800)
          this.productService.products.splice(index, 1)
          this.productCard = new Product().deserialize(res)
          this.productService.products.push(this.productCard)
          this.refresh()
        },
        error: (error: { error: { message: any; }; }) => {
          this.presentToast('middle', error.error.message, 800)
        }
      })

    }

  }

  reinitProduct = () => {

    this.cardIdSelected.emit(-1)

    this.name = this.productCard.getProductName
    this.imagePath = this.productCard.getImagePath
    this.setImageToDisplay = this.productCard.getImagePath

    this.checkIsUpdated()

  }

  deleteProduct = () => {

    const index = this.productService.products.findIndex(product => product.getId === this.productCard.getId)

    if (this.productCard.getId === 0) {
      this.deleteInList(index)
      return
    }

    this.productService.deleteProduct(this.productCard.getId).subscribe({
      next: (res: any) => {
        this.presentToast('middle', 'La prestation a été suprimée', 800)
        this.deleteInList(index)
      },
        error: (error: { error: { message: any; }; }) => {
      }
    })

  }

  deleteInList = (index: number) => {
    this.cardIdSelected.emit(-1)
    this.productService.products.splice(index, 1)
    this.refresh()
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position,
    });

    await toast.present();
  }

  checkIsUpdated = () => {
    this.isUpdated = this.productCard.getProductName !== this.name ||
      this.productCard.getImagePath !== this.imagePath
  }

  onSelectImage = (image: string) => {

    if (image === "") {

      this.cardIdSelected.emit(-1)

    } else {

      this.imagePath = image

      if (typeof image === 'string') {
        this.setImageToDisplay = image
      } else {
        var reader = new FileReader();
        reader.readAsDataURL(image as unknown as Blob);
        reader.onload = () => {
          this.imageToDisplay = reader.result as string
        }
      }

      this.checkIsUpdated()

    }
  }

  set setImageToDisplay (image: string) {this.imageToDisplay = image === 'defaultProduct.webp' ? this.backendImages + 'defaultProduct.webp' :  this.backendImages + '/products/' + image}

  refresh = () => {
    this.productService.refreshUpdate++
    this.productService.signalRefresUpdateUpdated.set(this.productService.refreshUpdate)
  }

  get getRole() {return this.authService.role}
  get getMenuIndex() {return this.authService.menuIndex}
  get getMenuTabs() {return this.authService.menuTabs}
  get getRefreshUpdate() {return this.productService.refreshUpdate}

}
