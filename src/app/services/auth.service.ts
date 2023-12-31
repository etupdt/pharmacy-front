import { Injectable, signal } from '@angular/core';
import { Client } from '../entities/client';
import { Router } from '@angular/router';
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

  rolesList: string[] = []

  menuIndex: number = 0
  signalMenuIndexUpdated = signal(this.menuIndex)

  menuTabs: {path: string, option: number, roleLevel: Role}[] = [
    {path: 'VisiteurMenu', option: 0, roleLevel: Role.USER},
    {path: 'ClientMenu', option: 0, roleLevel: Role.CLIENT},
    {path: 'AdminMenu', option: 0, roleLevel: Role.EMPLOYEE}
  ]
  signalmenuTabsUpdated = signal(this.menuTabs)

  selectedLangage = new BehaviorSubject<string>('fr')
  listenSelectedLangage = this.selectedLangage.asObservable()

  constructor(
    private http: HttpClient,
  ) {
    for (let role in Role) {
      if (isNaN(Number(role))) {
        this.rolesList.push(role)
      }
    }
  }

  login = (email: string, password: string): Observable<any> => {
    return this.http.post(
      environment.useBackendApi + `/auth/login`,
      {email: email, password: password}
    )
  }

  set setRole(roles: String) {
    let roleFinal: Role = Role.USER
    roles.replace(/\[|\]|"|ROLE_/g, '').split(',').forEach(role => {
      console.log(role)
      const index =  this.rolesList.findIndex(roleInter => roleInter === role)
      roleFinal = roleFinal < index ? index : roleFinal
    })
    this.role = roleFinal
    this.signalRoleUpdated.set(roleFinal)
  }

}
