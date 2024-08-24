import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Dimensions, ImageCroppedEvent, ImageCropperComponent, ImageTransform, LoadedImage } from 'ngx-image-cropper';
import { ImageService } from 'src/app/services/image.service';
import 'hammerjs';
import { Product } from 'src/app/entities/product';
import { InputCustomEvent, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent  implements OnInit {
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent | undefined;

  displayedImage: string = "defaultProduct.webp"
  selectedImage!: string

  urlImages = environment.useBackendApi + '/assets/images/'

  showCropper = true;
  imageChangedEvent: any;
  rotation = 0;
  scale = 1;
  transform: ImageTransform = {};

  croppedImage: any = '';
  imageSaved: any
  imageFile: any

  fileChangeEvent(event: any): void {
    if (!event || event.target.files[0])
      this.imageFile = event.target.files[0]
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.blob;
  }

  imageLoaded(image: LoadedImage) {
//    image.original.size.width = 400
//    image.original.size.height = 300
    this.showCropper = true;
  }

  zoomOut() {
    this.scale -= .1;
    this.transform = {
        ...this.transform,
        scale: this.scale
    };
  }

  zoomIn() {
    this.scale += .1;
    this.transform = {
        ...this.transform,
        scale: this.scale
    };
}

  cropperReady(sourceImageDimensions: Dimensions) {
      console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
      console.log('Load failed');
  }

  constructor(
    private productService: ProductService,
    private imageService: ImageService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {

    this.imageSaved = this.displayedImage

    this.displayCropperImage()

  }

  saveProduct = () => {

    if (this.productService.product.getId === 0) {

      this.productService.postProduct(this.productService.product, this.selectedImage).subscribe({
        next: (res: any) => {
          this.presentToast('middle', 'Le produit a été créé', 800)
          const product = new Product().deserialize(res)
          this.productService.products.push(product)
          this.refresh()
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
          const product = new Product().deserialize(res)
          this.productService.products.push(product)
          this.refresh()
        },
        error: (error: { error: { message: any; }; }) => {
          this.presentToast('middle', error.error.message, 800)
        }
      })

    }

  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position,
    });
  }

  replaceImage = () => {

    this.displayedImage = this.croppedImage

    this.selectedImage = this.displayedImage

    this.displayCropperImage()

  }

  reinitImage = () => {

    this.scale = 1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    }

    this.displayedImage = this.imageSaved

    this.selectedImage = this.imageSaved

    this.displayCropperImage()

  }

  displayCropperImage = () => {

    if (typeof this.displayedImage === 'string') {

      if (this.displayedImage === '') {
        this.displayedImage = 'defaultProduct.webp'
      }

      this.imageService.getImage(this.urlImages + this.displayedImage).subscribe({
        next: (res: Blob) => {
          this.imageFile = res
        }
      })

    } else {

      this.imageFile = this.displayedImage

    }

  }

  cancel = () => {

    this.router.navigateByUrl('VisiteurMenu/Produits')

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
    console.log('phase 3')
    return this.productService.product
  }

}
