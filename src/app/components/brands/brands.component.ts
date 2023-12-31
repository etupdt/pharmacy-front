import { Component, OnInit, effect } from '@angular/core';
import { Brand } from 'src/app/entities/brand';
import { BrandService } from 'src/app/services/brand.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {

  cardIdSelected: number = -1

  selectedLangage$!: string

  constructor (
    private brandService: BrandService,
    private authService: AuthService,
    private translate: TranslateService,
    private router: Router,
    private toastController: ToastController
  ) {
    effect(() => {
      this.brandService.signalRefresUpdateUpdated()
    });
  }

  ngOnInit(): void {

    this.getBrands();
    this.authService.listenSelectedLangage.subscribe((selectedLangage) => {
      this.translate.use(selectedLangage);
      this.selectedLangage$ = selectedLangage
    })

  }

  addBrand = () => {
    this.brandService.brands.push(new Brand().deserialize({
      id: 0,
      brandName: '',
      description: '',
      price: 0,
      duree: 0,
      imagePath: ''
    }))
    this.refresh()
  }

  getBrands = () => {

    this.brandService.getBrands().subscribe({
      next: (res: any) => {
        console.log('res', res)
        let brands: Brand[] = []
        res.forEach((p: any) => {
          let brand = new Brand().deserialize(p)
          brands.push(brand)
        })
        this.brandService.brands = brands
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
    this.brandService.refreshUpdate++
    this.brandService.signalRefresUpdateUpdated.set(this.brandService.refreshUpdate)
  }

  get getRole() {return this.authService.role}
  get getRefreshUpdate() {
    return this.brandService.refreshUpdate
  }
  get getBrandsFromService() {return this.brandService.brands}

}
