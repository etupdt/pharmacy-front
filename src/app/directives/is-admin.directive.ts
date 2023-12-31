import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Role } from '../enums/role';

@Directive({
  selector: '[isadmin]'
})
export class IsAdminDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
  ) {}

  @Input()
  set isadmin(role: Role) {

    if (role < Role.ADMIN) {
      this.viewContainer.clear()
    } else {
      this.viewContainer.createEmbeddedView(this.templateRef)
    }

  }

}
