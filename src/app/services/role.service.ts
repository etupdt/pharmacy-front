import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role } from '../entities/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  roles: Role[] = []

  constructor(
    private http: HttpClient,
  ) {
    this.getRoles().subscribe({
      next: (res: any) => {
        let roles: Role[] = []
        console.log('res', res)
        res.forEach((b: any) => {
          return roles.push(Role.deserialize(b))
        })
        this.roles = roles
      },
      error: (error: { error: { message: any; }; }) => {
        console.log('erreur lecture roles')
      }
    })
  }

  getRoles = (): Observable<any> => {

    return this.http.get(
      environment.useBackendApi + `/api/roles`,
    )

  }

}
