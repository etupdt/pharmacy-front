import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductComponent } from './components/product/product.component';
import { EvenementsPageComponent } from './components/evenements-page/evenements-page.component';
import { OnSiteServicesComponent } from './components/on-site-services/on-site-services.component';
import { ClientComponent } from './components/client/client.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { VisitorMenuComponent } from './components/visitor-menu/visitor-menu.component';
import { ClientMenuComponent } from './components/client-menu/client-menu.component';
import { CommandsComponent } from './components/commands/commands.component';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { OnSiteServiceComponent } from './components/on-site-service/on-site-service.component';
import { ProductViewComponent } from './components/product-view/product-view.component';

const routes: Routes = [
  {
    path: 'VisiteurMenu',
    component: VisitorMenuComponent,
    data: {
      icon: 'archive',
    },
    children: [
      {
        path: 'Accueil',
        component: HomePageComponent,
        data: {
          icon: 'archive',
        }
      },
      {
        path: 'Produits',
        component: ProductsComponent,
        data: {
          icon: 'paper-plane',
        },
      },
      {
        path: 'Produit',
        component: ProductComponent,
      },
      {
        path: 'Evenements',
        component: EvenementsPageComponent,
        data: {
          icon: 'trash',
        }
      },
      {
        path: 'Prestations',
        component: OnSiteServicesComponent,
        data: {
          icon: 'trash',
        },
      },
      {
        path: 'Prestation',
        component: OnSiteServiceComponent,
      },
    ]
  },
  {
    path: 'ClientMenu',
    component: ClientMenuComponent,
    data: {
      icon: 'archive',
    },
    children: [
      {
        path: 'Compte',
        component: ClientComponent,
        data: {
          icon: 'mail',
        }
      },
      {
        path: 'Commandes',
        component: CommandsComponent,
        data: {
          icon: 'mail',
        }
      },
      {
        path: 'Contact',
        component: ContactComponent,
        data: {
          icon: 'mail',
        }
      },
    ]
  },
  {
    path: 'AdminMenu',
    component: AdminMenuComponent,
    data: {
      icon: 'archive',
    },
    children: [
      {
        path: 'Commandes',
        component: CommandsComponent,
        data: {
          icon: 'mail',
        }
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'Accueil',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
