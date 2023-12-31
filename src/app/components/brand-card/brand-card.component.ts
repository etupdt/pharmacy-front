import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, effect } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Brand } from 'src/app/entities/brand';
import { AuthService } from 'src/app/services/auth.service';
import { BrandService } from 'src/app/services/brand.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-brand-card',
  templateUrl: './brand-card.component.html',
  styleUrls: ['./brand-card.component.scss'],
})
export class BrandCardComponent  implements OnInit, OnChanges {

  @Input() imageEditing: number = -1
  @Input() brandCard!: Brand
  @Output() cardIdSelected: EventEmitter<number> = new EventEmitter();

  name: string = ''
  description: string = ''
  @Input() imagePath!: string
  priceToDisplay!: string
  duree: number = 0
  imageToDisplay!: string

  isUpdated: boolean = false

  backendImages = environment.useBackendApi + '/assets/images/'

  constructor(
    private authService: AuthService,
    private router: Router,
    private brandService: BrandService,
    private toastController: ToastController
  ) {
  }

  ngOnInit() {
    this.reinitBrand()
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  editImage = () => {
    if (this.getRole >= 3) {
      if (this.imageEditing === this.brandCard.getId)
        this.cardIdSelected.emit(-1)
      else
        this.cardIdSelected.emit(this.brandCard.getId)
    }
  }

  saveBrand = () => {

    this.brandCard.setBrandName = this.name

    this.cardIdSelected.emit(-1)

    const index = this.brandService.brands.findIndex(brand => brand.getId === this.brandCard.getId)

    if (this.brandCard.getId === 0) {

      this.brandService.postBrand(this.brandCard, this.imagePath).subscribe({
        next: (res: any) => {
          this.presentToast('middle', 'La prestation a été créée', 800)
          this.brandCard = new Brand().deserialize(res)
          this.brandService.brands[index] = this.brandCard
          this.reinitBrand()
          this.refresh()
        },
        error: (error: { error: { message: any; }; }) => {
          this.presentToast('middle', error.error.message, 800)
        }
      })

    } else {

      this.brandService.putBrand(this.brandCard, this.imagePath).subscribe({
        next: (res: any) => {
          this.presentToast('middle', 'La prestation a été mise à jour', 800)
          this.brandService.brands.splice(index, 1)
          this.brandCard = new Brand().deserialize(res)
          this.brandService.brands.push(this.brandCard)
          this.refresh()
        },
        error: (error: { error: { message: any; }; }) => {
          this.presentToast('middle', error.error.message, 800)
        }
      })

    }

  }

  reinitBrand = () => {

    this.cardIdSelected.emit(-1)

    this.name = this.brandCard.getBrandName
    this.imagePath = this.brandCard.getImagePath
    this.setImageToDisplay = this.brandCard.getImagePath

    this.checkIsUpdated()

  }

  deleteBrand = () => {

    const index = this.brandService.brands.findIndex(brand => brand.getId === this.brandCard.getId)

    if (this.brandCard.getId === 0) {
      this.deleteInList(index)
      return
    }

    this.brandService.deleteBrand(this.brandCard.getId).subscribe({
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
    this.brandService.brands.splice(index, 1)
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
    this.isUpdated = this.brandCard.getBrandName !== this.name ||
      this.brandCard.getImagePath !== this.imagePath
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

  set setImageToDisplay (image: string) {this.imageToDisplay = image === '' ? this.backendImages + 'defaultBrand.png' :  this.backendImages + '/brands/' + image}

  refresh = () => {
    this.brandService.refreshUpdate++
    this.brandService.signalRefresUpdateUpdated.set(this.brandService.refreshUpdate)
  }

  get getRole() {return this.authService.role}
  get getMenuIndex() {return this.authService.menuIndex}
  get getMenuTabs() {return this.authService.menuTabs}
  get getRefreshUpdate() {return this.brandService.refreshUpdate}

}
