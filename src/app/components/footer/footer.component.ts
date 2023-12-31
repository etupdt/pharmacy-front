import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
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
  ) {
  }

  ngOnInit(): void {
    this.onglets = this.router.config.filter(onglet => onglet.path !== '**')
  }

  setSelectedLangage = (langage: string) => {
    this.selectedLangage = langage
    this.authService.selectedLangage.next(langage)
  }

}
