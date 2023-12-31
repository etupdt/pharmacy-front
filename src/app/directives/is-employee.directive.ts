import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Role } from '../enums/role';

@Directive({
  selector: '[isemployee]'
})
export class IsEmployeeDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
  ) {}

  @Input()
  set isemployee(role: Role) {

    if (role < Role.EMPLOYEE) {
      this.viewContainer.clear()
    } else {
      this.viewContainer.createEmbeddedView(this.templateRef)
    }

  }

}
