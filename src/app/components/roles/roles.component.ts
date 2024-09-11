import { Component, effect, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputCustomEvent, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Client } from 'src/app/entities/client';
import { Role } from 'src/app/enums/role';
import { AuthService } from 'src/app/services/auth.service';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit {

  sizeTable = 4

  clients: Client[] = []
  indiceClient: number = 0
  
  roles: any = Role
  roleClient: number = 0
  
  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private toastController: ToastController
  ) {
  }

  ngOnInit(): void {

    this.clientService.getClients().subscribe({
      next: (res: any[]) => {
        res.forEach(c => {
          this.clients.push(c.deserialize())
        })
      },
      error: (error: { error: { message: any; }; }) => {
        this.presentToast('middle', error.error.message, 800)
      }
    })

  }

  saveRole = () => {

    this.clientService.client = new Client().deserialize({
      id: this.clientService.client.getId,
//      email: this.clientForm.get("email")!.value,
    })
    this.clientService.signalClientUpdated.set(this.clientService.client)

    // this.clientService.putRole(this.clients[this.indiceClient].getId, ).subscribe({
    //   next: (res: any[]) => {
    //     res.forEach(p => {
    //       this.presentToast('middle', 'La personne a été mise à jour', 800)
    //     })
    //   },
    //   error: (error: { error: { message: any; }; }) => {
    //     this.presentToast('middle', error.error.message, 800)
    //   }
    // })

  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position,
    });

    await toast.present();
  }

  onEmailChange(event: Event) {
    this.indiceClient = parseInt((event as InputCustomEvent).detail.value!)
  }
  
  onRoleChange(event: Event) {
    this.roleClient = parseInt((event as InputCustomEvent).detail.value!)
  }
  
}
