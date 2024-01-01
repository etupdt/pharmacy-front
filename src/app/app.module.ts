import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ProductsComponent } from './components/products/products.component';
import { FilterProductPipe } from './pipes/filter-product.pipe';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CartComponent } from './components/cart/cart.component';
import { EvenementsPageComponent } from './components/evenements-page/evenements-page.component';
import { OnSiteServicesComponent } from './components/on-site-services/on-site-services.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoginComponent } from './components/login/login.component';
import * as _ from 'lodash';
import { VisitorMenuComponent } from './components/visitor-menu/visitor-menu.component';
import { ClientMenuComponent } from './components/client-menu/client-menu.component';
import { ClientComponent } from './components/client/client.component';
import { CommandsComponent } from './components/commands/commands.component';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { IsAdminDirective } from './directives/is-admin.directive';
import { IsEmployeeDirective } from './directives/is-employee.directive';
import { IsClientDirective } from './directives/is-client.directive';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { OnSiteServicesCardComponent } from './components/on-site-services-card/on-site-services-card.component';
import { OnSiteServiceComponent } from './components/on-site-service/on-site-service.component';
import { IsUpdatedPipe } from './pipes/is-updated.pipe';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CropperComponent } from './components/cropper/cropper.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductViewComponent } from './components/product-view/product-view.component';
import { ImagePipe } from './pipes/image.pipe';
import { BrandComponent } from './components/brand/brand.component';
import { BrandCardComponent } from './components/brand-card/brand-card.component';
import { BrandsComponent } from './components/brands/brands.component';
import { ProductComponent } from './components/product/product.component';
import { ButtonComponent } from './components/button/button.component';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ProductsComponent,
    ProductComponent,
    FilterProductPipe,
    CartComponent,
    EvenementsPageComponent,
    OnSiteServicesComponent,
    ContactComponent,
    FooterComponent,
    LoginComponent,
    VisitorMenuComponent,
    AdminMenuComponent,
    ClientMenuComponent,
    ClientComponent,
    CommandsComponent,
    IsAdminDirective,
    IsEmployeeDirective,
    IsClientDirective,
    OnSiteServicesCardComponent,
    OnSiteServiceComponent,
    BrandsComponent,
    BrandComponent,
    BrandCardComponent,
    IsUpdatedPipe,
    CropperComponent,
    ProductCardComponent,
    ProductViewComponent,
    ButtonComponent,
    ImagePipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ImageCropperModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'fr-FR'},
  ],
  bootstrap: [AppComponent],

})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

