import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from 'src/app/services/contact.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClientService } from 'src/app/services/client.service';
import { Client } from 'src/app/entities/client';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  message!: string

  contactForm!: FormGroup

  isUpdated = false

  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService,
    private clientService: ClientService,
  ) {
  }

  ngOnInit(): void {
    console.log('contact')
    this.message = ''

    this.initForm(this.message)

  }

  initForm = (message: string) => {

    this.contactForm = this.formBuilder.group({
      message: [
        message,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(32),
          Validators.pattern(/^[0-9a-zA-Z -']{0,}$/)
        ]
      ],
    })

    this.contactForm.valueChanges.subscribe(change => {
      this.isUpdated = this.checkChanges()
    })

    this.isUpdated = false

  }

  checkChanges(): boolean {

    this.message !== this.contactForm.get("message")!.value

    return this.isUpdated

  }

  sendMail = () => {

    this.contactService.sendMail({
      auth: this.clientService.client,
      message: this.getMessage
    }).subscribe({
      next: (res: any[]) => {
        this.message = ''
        this.initForm(this.message)
      },
      error: (error: { error: { message: any; }; }) => {
      }
    })

  }


  get getMessage () {return this.contactForm.get("message")!.value}

}
