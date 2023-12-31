import { Component, OnInit, Type, effect } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from './services/product.service';
import { DisplayCart } from './interfaces/displayCart.interface';
import { MenuController, ModalController, RangeCustomEvent, ToastController } from '@ionic/angular';
import { CartComponent } from './components/cart/cart.component';
import { environment } from 'src/environments/environment';
import { BrandService } from './services/brand.service';
import { Brand } from './entities/brand';
import { ProductType } from './enums/product-type';
import { ProductsType } from './interfaces/products-type.interface';
import { AuthService } from './services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { LoginComponent } from './components/login/login.component';
import { Role } from './enums/role';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  brandsChecked: boolean = false;
  productTypesChecked: boolean = false;

  backendImages = environment.useBackendImages

  selectedLangage$!: string

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private productService: ProductService,
    private authService: AuthService,
    private brandService: BrandService,
    private translate: TranslateService,
    private toastController: ToastController,
    private menuCtrl: MenuController
  ) {
    effect(() => {
      this.authService.signalRoleUpdated()
    });
    effect(() => {
      this.authService.signalMenuIndexUpdated()
      this.router.navigate([this.getMenuTabs[this.getMenuIndex].path + '/' + this.getRoutes[this.getMenuTabs[this.getMenuIndex].option].path])
    });
  }

  ngOnInit(): void {

    let index: number = 0
    for (let productTypeString in ProductType) {
      if (isNaN(Number(productTypeString))) {
        this.productService.productTypes.push({productType: index, productTypeString: productTypeString, checked: false})
        index++
      }
    }
    this.authService.listenSelectedLangage.subscribe((selectedLangage) => {
      this.translate.use(selectedLangage);
      this.selectedLangage$ = selectedLangage
    })
    this.navigateTo(0)
  }

  checkBrand = (index: number) => {
    this.brandService.brands[index].checked= !this.brandService.brands[index].checked
    this.productService.refresh++
  }

  checkBrands = () => {
    this.brandsChecked = !this.brandsChecked
    this.brandService.brands.forEach(brand => brand.checked = this.brandsChecked)
    this.productService.refresh++
  }

  checkProductTypes = () => {
    this.productTypesChecked = !this.productTypesChecked
    this.productService.productTypes.forEach(productTypes => productTypes.checked = this.productTypesChecked)
    this.productService.refresh++
  }

  checkType = (index: number) => {
    this.productService.productTypes[index].checked= !this.productService.productTypes[index].checked
    this.productService.refresh++
  }

  onResetPrice = () => {
    this.getFilters[0].startValue = this.getFilters[0].inf
    this.getFilters[0].endValue = this.getFilters[0].sup
    this.productService.refresh++
  }

  onTerminalsPriceChange = (event: Event) => {
    this.getFilters[0].startValue = ((event as RangeCustomEvent).detail.value as {lower: number, upper: number}).lower
    this.getFilters[0].endValue = ((event as RangeCustomEvent).detail.value as {lower: number, upper: number}).upper
    this.productService.refresh++
  }

  navigateTo = (index: number) => {
    this.authService.menuIndex = index
    this.authService.signalMenuIndexUpdated.set(index)
    this.menuCtrl.enable(true, 'menu')
    this.menuCtrl.open('menu')
    this.router.navigate([this.getMenuTabs[this.getMenuIndex].path + '/' + this.getRoutes[this.getMenuTabs[this.getMenuIndex].option].path])
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Le panier est vide !',
      duration: 800,
      position: position,
    });

    await toast.present();
  }

  async showCart() {

    if (this.productService.cart.detail.length === 0) {
      this.presentToast("middle")
      return
    }

    const modal = await this.modalCtrl.create({
      component: CartComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(`Hello, ${data}!`);
    }
  }

  async showLogin() {

    const modal = await this.modalCtrl.create({
      component: LoginComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log(`Hello, ${data}!`);
    }
  }

  get getRoutes() { return this.router.config[this.authService.menuIndex].children!.filter(r => r.path !== '**')}
  get getActiveRoute() {return this.router.url.split('/')[2]}
  get getCartTotalSize() {
    let total = 0
    this.productService.cart.detail.forEach(detail => total += detail.qte)
    return total === 0 ? '' : total
  }
  get getFilters() {return this.productService.filters}
  get getRole() {return this.authService.role}
  get getAuthenticatedEmail() {return this.authService.email}
  get getBrands() {return this.brandService.brands}
  get getProductTypes() {return this.productService.productTypes}
  get getMenuIndex() {return this.authService.menuIndex}
  get getMenuTabs() {return this.authService.menuTabs}

}
