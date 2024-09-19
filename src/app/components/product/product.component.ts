import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Dimensions, ImageCroppedEvent, ImageCropperComponent, ImageTransform, LoadedImage } from 'ngx-image-cropper';
import { ImageService } from 'src/app/services/image.service';
import 'hammerjs';
import { Product } from 'src/app/entities/product';
import { InputCustomEvent, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { BrandService } from 'src/app/services/brand.service';
import { Brand } from 'src/app/entities/brand';
import { ProductType } from 'src/app/enums/product-type';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent | undefined;

  displayedImage: string = "defaultProduct.webp"
  selectedImage!: string

  types = ProductType;
  stringType!: keyof typeof ProductType

  urlImages = environment.useBackendApi + '/assets/images/'

  constructor(
    private productService: ProductService,
    private brandService: BrandService,
    private imageService: ImageService,
    private router: Router,
    private toastController: ToastController
  ) { }

  saveProduct = () => {

    this.validationToast('middle', 'Voulez vous réellement sauvegarder ce produit ?', () => {

      if (this.productService.product.getId === 0) {

        this.productService.postProduct(this.productService.product).subscribe({
          next: (res: any) => {
            this.presentToast('middle', 'Le produit a été créé', 800)
            const product = Product.deserialize(res)
            this.productService.products.push(product)
            this.router.navigateByUrl('VisiteurMenu/Produits')
          },
          error: (error: { error: { message: any; }; }) => {
            this.presentToast('middle', error.error.message, 800)
          }
        })

      } else {

        const index = this.productService.products.findIndex((product: Product) => product.getId === this.productService.product.getId)

        this.productService.putProduct(this.productService.product, this.selectedImage).subscribe({
          next: (res: any) => {
            this.presentToast('middle', 'Le produit a été mis à jour', 800)
            this.productService.products.splice(index, 1)
            const product = Product.deserialize(res)
            this.productService.products.push(product)
            this.router.navigateByUrl('VisiteurMenu/Produits')
          },
          error: (error: { error: { message: any; }; }) => {
            this.presentToast('middle', error.error.message, 800)
          }
        })

      }
    })

  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position,
    });
  }

  async validationToast(position: 'top' | 'middle' | 'bottom', message: string, callback: Function) {
    const toast = await this.toastController.create({
      message: message,
      position: position,
      buttons: [{
        text: 'Oui',
        side: 'end',
        role: 'action'
      },
      {
        text: 'Non',
        side: 'end',
        role: 'cancel'
      }]
    });

    await toast.present()
    await toast.onDidDismiss().then((value) => {
      if  (value.role === 'action') {
        callback()
      }
    })

  }

  cancel = () => {

    this.validationToast('middle', 'Voulez vous réellement abandonner la mise à jour de ce produit ?', () => {
      this.router.navigateByUrl('VisiteurMenu/Produits')
    })

  }

  onChangeBrand = (event: Event) => {
    this.productService.product.setBrand = new Brand(parseInt((event as InputCustomEvent).detail.value!), '', '')
    this.refresh()
  }

  onChangeType = (event: Event) => {
    this.productService.product.setType = parseInt((event as InputCustomEvent).detail.value!)
    this.refresh()
  }

  onChangeName = (event: Event) => {
    this.productService.product.setProductName = (event as InputCustomEvent).detail.value!
    this.refresh()
  }

  onChangeDescription = (event: Event) => {
    this.productService.product.setDescription = (event as InputCustomEvent).detail.value!
    this.refresh()
  }

  onChangeLabel = (event: Event) => {
    this.productService.product.setLabel = (event as InputCustomEvent).detail.value!
    this.refresh()
  }

  onChangePrice = (event: Event) => {
    this.productService.product.setPrice = +(event as InputCustomEvent).detail.value!
    this.refresh()
  }

  onChangePreparationTime = (event: Event) => {
    this.productService.product.setPreparationTime = +(event as InputCustomEvent).detail.value!
    this.refresh()
  }

  onChangeCommandTime = (event: Event) => {
    this.productService.product.setCommandTime = +(event as InputCustomEvent).detail.value!
    this.refresh()
  }

  onChangeDeliveryTime = (event: Event) => {
    this.productService.product.setDeliveryTime = +(event as InputCustomEvent).detail.value!
    this.refresh()
  }

  refresh = () => {
    this.productService.refreshUpdate++
    this.productService.signalRefresUpdateUpdated.set(this.productService.refreshUpdate)
  }

  get getProduct() {
    return this.productService.product
  }
  
  get getBrands() {
    return this.brandService.brands
  }
  
  get getType() {
    return ProductType[this.getProduct.getType]
  }
  
}
