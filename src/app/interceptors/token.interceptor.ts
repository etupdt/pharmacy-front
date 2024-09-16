import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private toastController: ToastController
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const localUserTokens: string = localStorage.getItem('pharmacy_token')!

    let modifiedReq

    if (localUserTokens) {
        // const userTokens: any = JSON.parse(localUserTokens)
        // if (Date.now() > helper.decodeToken(userTokens.access_token).exp * 1000) {
        //     headerService.user = new User()
        //     headerService.signalUser.set(headerService.user)
        //     localStorage.removeItem('arcadia_tokens')
        //     modifiedReq = request
        // } else {
            modifiedReq = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${localUserTokens}`),
            })
        // }
    } else {
        modifiedReq = request
    }
   
    // return next.handle(modifiedReq);
    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let message: string = ''
        if (error) {
          switch (error.status) {
            case 400: {
              message = 'Erreur 400'
              break;
            }
            case 401: {
              message = 'Email ou mot de passe incorrect !'
              console.log(error.status, message)
              break;
            }
            case 403: {
              message = 'Habilitations insuffisantes pour effectuer cette opération !'
              break;
            }
            case 404: {
              message = 'Elémet non trouvé !'
              break;
            }
            case 500: {
              message = 'Erreur du serveur !'
              break;
            }
            default: {
              message = 'Application indisponible !' 
              break;
            }   
          }
        }

        this.presentToast('middle', message, 3000)
        // headerService.modal = {modal: 'error', message: message, display: "display: block;"}
        // headerService.signalModal.set(headerService.modal)

        throw error
      })  
    )
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position,
    });

    await toast.present();
  }

}
