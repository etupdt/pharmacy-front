import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Dimensions, ImageCroppedEvent, ImageCropperComponent, ImageTransform, LoadedImage } from 'ngx-image-cropper';
import { ImageService } from 'src/app/services/image.service';
import 'hammerjs';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss'],
})
export class BrandComponent  implements OnInit {
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent | undefined;

  @Input() displayedImage!: string
  @Output() selectedImage: EventEmitter<string> = new EventEmitter();

  @Input() urlImages!: string

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
    private imageService: ImageService
  ) { }

  ngOnInit() {

    this.imageSaved = this.displayedImage

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
        this.displayedImage = 'defaultBrand.png'
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

}
