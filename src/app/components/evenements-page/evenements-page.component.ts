

import { Component, Inject} from '@angular/core';

import {  NgIf, NgForOf, CommonModule} from '@angular/common';
import { EVENEMENT_TOKEN, EvenementProvider } from '../../provider/evenementprovider';
import { Evenement } from '../../entities/evenement';


@Component({
  selector: 'app-evenements-page',
  templateUrl: './evenements-page.component.html',
  styleUrls: ['./evenements-page.component.scss'],


  providers: [
    EvenementProvider,  { provide: EVENEMENT_TOKEN, useValue: new EvenementProvider().evenements }
  ],


})

export class EvenementsPageComponent {
  public evenements: Evenement[]=[];

  public  constructor(@Inject(EVENEMENT_TOKEN)  evenements: Evenement[]){
    this.evenements = evenements   ;


 } }
