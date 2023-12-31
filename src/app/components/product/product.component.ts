import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { InputCustomEvent, IonModal, ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Product } from 'src/app/entities/product';
import { DisplayCart } from 'src/app/interfaces/displayCart.interface';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';
import { CartComponent } from '../cart/cart.component';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/services/image.service';
import { Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { BrandService } from 'src/app/services/brand.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  product!: Product
  brandSelectId!: number

  backendImages = environment.useBackendImages

  showCropper = true;
  imageChangedEvent: any;
  croppedImage: any = '';
  imageURL: string = ''
  rotation = 0;
  scale = 1;
  transform: ImageTransform = {};

  imageSaved: any
  imageURLSaved: any
  imageFile: any
  image: any

  fileChangeEvent(event: any): void {
    if (!event || event.target.files[0])
      this.imageFile = event.target.files[0]
//      this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.blob;
  }

  imageLoaded() {
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

  constructor (
    private productService: ProductService,
    private toastController: ToastController,
    private router: Router,
    private imageService: ImageService,
    private brandService: BrandService
  ) {
  }

  ngOnInit(): void {
    if (!this.product) {
      this.product = new Product().deserialize(history.state)
      this.brandSelectId = this.product.getBrand.getId
      console.log(this.product.getBrand.getId)
    }

    this.imageURLSaved = this.backendImages + '/products/' + this.product.getImagePath

    if (this.product.getImagePath !== '') {
      this.imageService.getImage( this.backendImages + '/products/' + this.product.getImagePath).subscribe({
        next: (res: Blob) => {
          this.imageFile = res
          this.imageSaved = res
          var reader = new FileReader();
          reader.readAsDataURL(res);
          reader.onload = () => {
            this.image = reader.result as string
          }
        }
      })
    }

  }

  replaceImage = () => {
    var reader = new FileReader();
    reader.readAsDataURL(this.croppedImage);
    reader.onload = () => {
      this.product.setImagePath = reader.result as string
    }
    this.refresh()
  }

  reinitImage = () => {
    this.imageFile = this.imageSaved
    this.product.setImagePath = this.image
  }

  saveProduct = () => {

    if (this.product.getId === 0) {

      this.productService.postProduct(this.product).subscribe({
        next: (res: any) => {
            this.presentToast('middle', 'La prestation a été créée', 800)
            this.productService.products.push(new Product().deserialize(res))
            this.router.navigate(['/VisiteurMenu/Produits'])
        },
        error: (error: { error: { message: any; }; }) => {
          this.presentToast('middle', error.error.message, 800)
        }
      })

    } else {

      this.productService.putProduct(this.product).subscribe({
        next: (res: any) => {
            this.presentToast('middle', 'La prestation a été mise à jour', 800)
            let index = this.productService.products.findIndex(onSiteService => onSiteService.getId === res.id)
            this.productService.products[index].setProductName = res.productName
            this.productService.products[index].setLabel = res.label
            this.productService.products[index].setDescription = res.description
            this.productService.products[index].setPrice = res.price
            this.productService.products[index].setImagePath = res.imagePath
            this.router.navigate(['/VisiteurMenu/Prestations'])
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

    await toast.present();
  }

  onChangeName = (event: Event) => {
    this.product.setProductName = (event as InputCustomEvent).detail.value!
    this.refresh()
  }

  onChangeDescription = (event: Event) => {
    this.product.setDescription = (event as InputCustomEvent).detail.value!
    this.refresh()
  }

  onChangeLabel = (event: Event) => {
    this.product.setLabel = (event as InputCustomEvent).detail.value!
    this.refresh()
  }

  onChangePrice = (event: Event) => {
    this.product.setPrice = +(event as InputCustomEvent).detail.value!
    this.refresh()
  }

  onChangePreparationTime = (event: Event) => {
    this.product.setPreparationTime = +(event as InputCustomEvent).detail.value!
    this.refresh()
  }

  onChangeCommandTime = (event: Event) => {
    this.product.setCommandTime = +(event as InputCustomEvent).detail.value!
    this.refresh()
  }

  onChangeDeliveryTime = (event: Event) => {
    this.product.setDeliveryTime = +(event as InputCustomEvent).detail.value!
    this.refresh()
  }

  refresh = () => {
    this.productService.refreshUpdate++
    this.productService.signalRefresUpdateUpdated.set(this.productService.refreshUpdate)
  }

  get getBrands() {return this.brandService.brands}

}
