import { Injectable, InjectionToken,NgModule } from '@angular/core';
import { Evenement} from '../entities/evenement';


export const EVENEMENT_TOKEN = new InjectionToken<Evenement>('EVENEMENT_TOKEN') ;

export function evenementFactory(): Evenement[] {


 //Récupération des données Json

 //Mouillage

 // Create and return an array of Evenements instances
 const evenement1: Evenement= {
    id: 1,
    title: 'Promotion crèmes hydratantes',
    date : [new Date(2023,7,1),new Date(2023,7,31)] ,
    description : 'Nous offrons une promotion de 5% sur toutes les crèmes hydratantes',
    photo: 'assets/images/evenements/cremeshydratante.jpg',

  }

  const  evenement2:Evenement={
    id: 2,
    title: 'Formation exclusive aux gestes qui sauvent',
    date : [new Date(2023,6,4),new Date(2023,8,1)] ,
    description : 'L\'été étant propices aux accidents de toutes sortes, nous vous proposont chaque mercredi un stage de formation aux premiers secours. Cette formation est accessible à partir de 10 ans. ',
    photo: 'assets/images/evenements/premiersecours.jpg'
 }


 let evenements: Evenement[] = [evenement1, evenement2];

 return evenements;
}

@Injectable({
  providedIn: 'root', // or specify a specific module where this provider should be available
  useFactory: evenementFactory, // use the factory function to provide the value
})


@NgModule({
  providers: [
    { provide: EVENEMENT_TOKEN, useValue: evenementFactory() }
  ]
})

export class EvenementProvider {

  public evenements : Evenement[];
  public constructor(){
    this.evenements=evenementFactory();



  }
 }

