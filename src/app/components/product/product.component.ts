import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Dimensions, ImageCroppedEvent, ImageCropperComponent, ImageTransform, LoadedImage } from 'ngx-image-cropper';
import { ImageService } from 'src/app/services/image.service';
import 'hammerjs';
import { Product } from 'src/app/entities/product';
import { InputCustomEvent } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent  implements OnInit {
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent | undefined;

  displayedImage: string = "defaultProduct.webp"
  @Output() selectedImage: EventEmitter<string> = new EventEmitter();

  urlImages = environment.useBackendApi + '/assets/images/'

  product!: Product

  showCropper = true;
  imageChangedEvent: any;
  rotation = 0;
  scale = 1;
  transform: ImageTransform = {};

  croppedImage: any = '';
  imageSaved: any
  imageFile: any
  productService: any;

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
    private imageService: ImageService
  ) { }

  ngOnInit() {

    console.log('init product')
    this.imageSaved = this.displayedImage

    if (!this.product) {
      this.product = new Product().deserialize(history.state)
    }

    this.displayCropperImage()

  }

  replaceImage = () => {

    this.displayedImage = this.croppedImage

    this.selectedImage.emit(this.displayedImage)

    this.displayCropperImage()

  }

  reinitImage = () => {

    this.scale = 1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    }

    this.displayedImage = this.imageSaved

    this.selectedImage.emit(this.imageSaved)

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

    this.reinitImage()

    this.selectedImage.emit("")

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

}
