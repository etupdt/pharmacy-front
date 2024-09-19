import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, effect } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Product } from 'src/app/entities/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';
import { ProductViewComponent } from '../product-view/product-view.component';
import { ProductType } from 'src/app/enums/product-type';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent  implements OnInit, OnChanges {

  @Input() displayIcon: string = 'cache'

  // @Input() imageEditing: number = -1
  @Input() productCard!: Product
  @Input() imagePath!: string
  @Output() cardIdSelected: EventEmitter<number> = new EventEmitter();
  @Output() imageSelected: EventEmitter<string> = new EventEmitter();
  @Output() productToUpdate: EventEmitter<number> = new EventEmitter();

  name: string = ''
  description: string = ''
  priceToDisplay!: string
  duree: number = 0
  imageToDisplay!: string

  isUpdated: boolean = false

  stringType!: keyof typeof ProductType

  backendImages = environment.useBackendApi + '/assets/images/'

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalCtrl: ModalController,
    private productService: ProductService,
    private toastController: ToastController
  ) {
  }

  ngOnInit() {
    this.reinitProduct()
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  async showDetail() {

    if (this.getRole > 3) {

      this.productService.product = this.productCard
      this.router.navigateByUrl('VisiteurMenu/Produit')    

    } else {
      
          this.productService.product = this.productCard
          const modal = await this.modalCtrl.create({
            component: ProductViewComponent
          });
          modal.present();
      
          const { data, role } = await modal.onWillDismiss();
      
          if (role === 'confirm') {
            console.log(`Hello, ${data}!`);
          }

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

  // editImage = () => {
  //   if (this.getRole >= 3) {
  //     if (this.imageEditing === this.productCard.getId)
  //       this.cardIdSelected.emit(-1)
  //     else
  //       this.cardIdSelected.emit(this.productCard.getId)
  //   }
  // }

  updateProduct() {
    this.productService.product = this.productCard
    this.productToUpdate.emit(this.productCard.getId)
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
      this.getProduct.setImagePath = image

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

  set setImageToDisplay (image: string) {this.imageToDisplay = this.backendImages + '/products/' + (image === 'default.webp' ? 'blank.png' : image)}

  refresh = () => {
    this.productService.refreshUpdate++
    this.productService.signalRefresUpdateUpdated.set(this.productService.refreshUpdate)
  }

  get getRole() {
    return this.authService.role}
  get getMenuIndex() {return this.authService.menuIndex}
  get getMenuTabs() {return this.authService.menuTabs}
  get getProduct() {return this.productService.product}

  get getType() {
    return ProductType[this.productCard.getType]
  }
  

}
