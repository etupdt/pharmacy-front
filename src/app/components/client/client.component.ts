import { Component, Inject, Input, OnInit, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Client } from 'src/app/entities/client';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  @Input() param!: string

  clientForm!: FormGroup

  isUpdated = false

  sizeTable = 4


  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private toastController: ToastController
  ) {
    effect(() => {
      this.initForm(this.clientService.signalClientUpdated());
    });
  }

  ngOnInit(): void {
    this.initForm(this.clientService.signalClientUpdated());
  }

  initForm = (client: Client) => {

    if (client) {

      this.clientForm = this.formBuilder.group({
        email: [
          client.getEmail,
          [
            Validators.required,
            Validators.email
          ]
        ],
        firstname: [
          client.getFirstName,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(32),
            Validators.pattern(/^[0-9a-zA-Z -']{0,}$/)
          ]
        ],
        lastname: [
          client.getLastName,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(32),
            Validators.pattern(/^[0-9a-zA-Z -']{0,}$/)
          ]
        ],
        address1: [
          client.getAddress1,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/[0-9a-zA-Z -+*_='/]{0,}/),
          ]
        ],
        address2: [
          client.getAddress2,
          [
            Validators.pattern(/[0-9a-zA-Z -+*_='/]{0,}/),
          ]
        ],
        zip: [
          client.getZip,
          [
            Validators.required,
            Validators.pattern(/[0-9]{0,}/),
            Validators.minLength(5),
            Validators.maxLength(5),
          ]
        ],
        locality: [
          client.getLocality,
          [
            Validators.required,
            Validators.minLength(1),
            Validators.pattern(/[0-9a-zA-Z -+*_='/]{0,}/),
          ]
        ],
      })

      this.clientForm.valueChanges.subscribe(change => {
        this.isUpdated = this.checkChanges()
      })

      this.isUpdated = false

    }

  }

  checkChanges(): boolean {

    this.clientService.client.getEmail !== this.clientForm.get("email")!.value ||
    this.clientService.client.getFirstName !== this.clientForm.get("firstname")!.value ||
    this.clientService.client.getLastName !== this.clientForm.get("lastname")!.value ||
    this.clientService.client.getAddress1 !== this.clientForm.get("address1")!.value ||
    this.clientService.client.getAddress2 !== this.clientForm.get("address2")!.value ||
    this.clientService.client.getZip !== this.clientForm.get("zip")!.value ||
    this.clientService.client.getLocality !== this.clientForm.get("locality")!.value

    return this.isUpdated

  }

  saveClient = () => {

    this.clientService.client = new Client().deserialize({
      id: this.clientService.client.getId,
//      email: this.clientForm.get("email")!.value,
      firstName: this.clientForm.get("firstname")!.value,
      lastName: this.clientForm.get("lastname")!.value,
      address1: this.clientForm.get("address1")!.value,
      address2: this.clientForm.get("address2")!.value,
      zip: this.clientForm.get("zip")!.value ? "" + this.clientForm.get("zip")!.value : null,
      locality: this.clientForm.get("locality")!.value
    })
    this.clientService.signalClientUpdated.set(this.clientService.client)

    this.clientService.putClient(this.clientService.client).subscribe({
      next: (res: any[]) => {
        res.forEach(p => {
          this.presentToast('middle', 'Le client a été mis à jour', 800)
        })
      },
      error: (error: { error: { message: any; }; }) => {
        this.presentToast('middle', error.error.message, 800)
      }
    })

  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position,
    });

    await toast.present();
  }

  get getEmail () {return this.clientForm.get("email")!.value}
  get getFirstname () {return this.clientForm.get("firstname")!.value}
  get getLastname () {return this.clientForm.get("lastname")!.value}
  get getAddress1 () {return this.clientForm.get("address1")!.value}
  get getAddress2 () {return this.clientForm.get("address2")!.value}
  get getZip () {return this.clientForm.get("zip")!.value}
  get getLocality () {return this.clientForm.get("locality")!.value}

}
