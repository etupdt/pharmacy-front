import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MailContact } from '../interfaces/mail-contact.interface';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private http: HttpClient,
  ) { }

  sendMail = (mail: MailContact): Observable<any> => {
    return this.http.post(
      environment.useBackendMail + `/sendmail/contact`,
      mail
    )
  }

}

