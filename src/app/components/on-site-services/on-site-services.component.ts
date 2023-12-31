import { Component, OnInit, effect } from '@angular/core';
import { OnSiteService } from 'src/app/entities/on-site-service';
import { OnSiteServiceService } from 'src/app/services/on-site-service.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-on-site-services',
  templateUrl: './on-site-services.component.html',
  styleUrls: ['./on-site-services.component.scss']
})
export class OnSiteServicesComponent implements OnInit {

  cardIdSelected: number = -1

  backendImages = environment.useBackendImages

  selectedLangage$!: string

  constructor (
    private onSiteServiceService: OnSiteServiceService,
    private authService: AuthService,
    private translate: TranslateService,
    private router: Router,
    private toastController: ToastController
  ) {
    effect(() => {
      this.onSiteServiceService.signalRefresUpdateUpdated()
    });
  }

  ngOnInit(): void {

    this.getOnSiteServices();
    this.authService.listenSelectedLangage.subscribe((selectedLangage) => {
      this.translate.use(selectedLangage);
      this.selectedLangage$ = selectedLangage
    })

  }

  addOnSiteService = () => {
    this.onSiteServiceService.onSiteServices.push(new OnSiteService().deserialize({
      id: 0,
      onSiteServiceName: '',
      description: '',
      price: 0,
      duree: 0,
      imagePath: ''
    }))
    this.refresh()
  }

  getOnSiteServices = () => {

    this.onSiteServiceService.getOnSiteServices().subscribe({
      next: (res: any) => {
        console.log('res', res)
        let onSiteServices: OnSiteService[] = []
        res.forEach((p: any) => {
          let onSiteService = new OnSiteService().deserialize(p)
          onSiteServices.push(onSiteService)
        })
        this.onSiteServiceService.onSiteServices = onSiteServices
      },
        error: (error: { error: { message: any; }; }) => {
          this.presentToast('middle', error.error.message, 800)
        }
      }
    )

  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position,
    });

    await toast.present();
  }

  onSelectCard = (cartIdSelected: number) => {
    this.cardIdSelected = cartIdSelected
  }

  refresh = () => {
    this.onSiteServiceService.refreshUpdate++
    this.onSiteServiceService.signalRefresUpdateUpdated.set(this.onSiteServiceService.refreshUpdate)
  }

  get getRole() {return this.authService.role}
  get getRefreshUpdate() {
    return this.onSiteServiceService.refreshUpdate
  }
  get getOnSiteServicesFromService() {return this.onSiteServiceService.onSiteServices}

}
