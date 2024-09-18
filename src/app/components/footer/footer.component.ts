import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  onglets!: Route[]

  langages: string[] = ['fr', 'en', 'de', 'it']

  selectedLangage: string = 'fr'

  constructor (
    private router: Router,
    private productService: ProductService,
    private authService: AuthService,
    private menuCtrl: MenuController,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.onglets = this.router.config.filter(onglet => onglet.path !== '**')
  }

  setSelectedLangage = (langage: string) => {
    this.selectedLangage = langage
    this.authService.selectedLangage.next(langage)
  }

  navigateTo = (index: number, path: string) => {
    this.authService.menuIndex = index
    this.authService.signalMenuIndexUpdated.set(index)
    this.menuCtrl.enable(true, 'menu')
    this.menuCtrl.open('menu')
    this.router.navigate([path])
  }

  get getRole() {return this.authService.role}
  get getMenuIndex() {return this.authService.menuIndex}
  get getMenuTabs() {return this.authService.menuTabs}

}
