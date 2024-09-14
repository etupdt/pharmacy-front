import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Role } from '../enums/role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  email?: string
  role: Role = Role.VISITOR
  signalRoleUpdated = signal(this.role)

  menuIndex: number = 0
  signalMenuIndexUpdated = signal(this.menuIndex)

  menuTabs: {path: string, option: number, roleLevel: number}[] = [
    {path: 'VisiteurMenu', option: 0, roleLevel: 0},
    {path: 'ClientMenu', option: 0, roleLevel: 1},
    {path: 'AdminMenu', option: 0, roleLevel: 2}
  ]
  signalmenuTabsUpdated = signal(this.menuTabs)

  selectedLangage = new BehaviorSubject<string>('fr')
  listenSelectedLangage = this.selectedLangage.asObservable()

  constructor(
    private http: HttpClient,
  ) {
  }

  login = (email: string, password: string): Observable<any> => {
    return this.http.post(
      environment.useBackendApi + `/auth/login`,
      {email: email, password: password}
    )
  }

  register = (email: string, password: string): Observable<any> => {
    return this.http.post(
      environment.useBackendApi + `/auth/register`,
      {email: email, password: password}
    )
  }

}
