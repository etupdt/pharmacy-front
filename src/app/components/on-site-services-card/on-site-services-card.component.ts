import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, effect } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { OnSiteService } from 'src/app/entities/on-site-service';
import { AuthService } from 'src/app/services/auth.service';
import { OnSiteServiceService } from 'src/app/services/on-site-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-on-site-services-card',
  templateUrl: './on-site-services-card.component.html',
  styleUrls: ['./on-site-services-card.component.scss'],
})
export class OnSiteServicesCardComponent  implements OnInit, OnChanges {

  @Input() imageEditing: number = -1
  @Input() onSiteServiceCard!: OnSiteService
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
    private onSiteServiceService: OnSiteServiceService,
    private toastController: ToastController
  ) {
  }

  ngOnInit() {
    this.reinitOnSiteService()
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  editImage = () => {
    if (this.getRole >= 3) {
      if (this.imageEditing === this.onSiteServiceCard.getId)
        this.cardIdSelected.emit(-1)
      else
        this.cardIdSelected.emit(this.onSiteServiceCard.getId)
    }
  }

  saveOnSiteService = () => {

    this.onSiteServiceCard.setOnSiteServiceName = this.name
    this.onSiteServiceCard.setDescription = this.description
    this.onSiteServiceCard.setPrice = +this.priceToDisplay
    this.onSiteServiceCard.setDuree = this.duree

    this.cardIdSelected.emit(-1)

    const index = this.onSiteServiceService.onSiteServices.findIndex(onSiteService => onSiteService.getId === this.onSiteServiceCard.getId)

    if (this.onSiteServiceCard.getId === 0) {

      this.onSiteServiceService.postOnSiteService(this.onSiteServiceCard, this.imagePath).subscribe({
        next: (res: any) => {
          this.presentToast('middle', 'La prestation a été créée', 800)
          this.onSiteServiceCard = new OnSiteService().deserialize(res)
          this.onSiteServiceService.onSiteServices[index] = this.onSiteServiceCard
          this.reinitOnSiteService()
          this.refresh()
        },
        error: (error: { error: { message: any; }; }) => {
          this.presentToast('middle', error.error.message, 800)
        }
      })

    } else {

      this.onSiteServiceService.putOnSiteService(this.onSiteServiceCard, this.imagePath).subscribe({
        next: (res: any) => {
          this.presentToast('middle', 'La prestation a été mise à jour', 800)
          this.onSiteServiceService.onSiteServices.splice(index, 1)
          this.onSiteServiceCard = new OnSiteService().deserialize(res)
          this.onSiteServiceService.onSiteServices.push(this.onSiteServiceCard)
          this.refresh()
        },
        error: (error: { error: { message: any; }; }) => {
          this.presentToast('middle', error.error.message, 800)
        }
      })

    }

  }

  reinitOnSiteService = () => {

    this.cardIdSelected.emit(-1)

    this.name = this.onSiteServiceCard.getOnSiteServiceName
    this.description = this.onSiteServiceCard.getDescription
    this.priceToDisplay = Number(this.onSiteServiceCard.getPrice).toFixed(2)
    this.duree = this.onSiteServiceCard.getDuree
    this.imagePath = this.onSiteServiceCard.getImagePath
    this.setImageToDisplay = this.onSiteServiceCard.getImagePath

    this.checkIsUpdated()

  }

  deleteOnSiteService = () => {

    const index = this.onSiteServiceService.onSiteServices.findIndex(onSiteService => onSiteService.getId === this.onSiteServiceCard.getId)

    if (this.onSiteServiceCard.getId === 0) {
      this.deleteInList(index)
      return
    }

    this.onSiteServiceService.deleteOnSiteService(this.onSiteServiceCard.getId).subscribe({
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
    this.onSiteServiceService.onSiteServices.splice(index, 1)
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
    this.isUpdated = this.onSiteServiceCard.getOnSiteServiceName !== this.name ||
      this.onSiteServiceCard.getDescription !== this.description ||
      Number(this.onSiteServiceCard.getPrice).toFixed(2) !== this.priceToDisplay ||
      this.onSiteServiceCard.getDuree !== this.duree ||
      this.onSiteServiceCard.getImagePath !== this.imagePath
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

  set setImageToDisplay (image: string) {this.imageToDisplay = image === '' ? this.backendImages + 'onsiteservices/Soins_du_visage.jpg' :  this.backendImages + '/onsiteservices/' + image}

  refresh = () => {
    this.onSiteServiceService.refreshUpdate++
    this.onSiteServiceService.signalRefresUpdateUpdated.set(this.onSiteServiceService.refreshUpdate)
  }

  get getRole() {return this.authService.role}
  get getMenuIndex() {return this.authService.menuIndex}
  get getMenuTabs() {return this.authService.menuTabs}
  get getRefreshUpdate() {return this.onSiteServiceService.refreshUpdate}

}
