import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Role } from '../enums/role';

@Directive({
  selector: '[isclient]'
})
export class IsClientDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
  ) {}

  @Input()
  set isclient(role: Role) {

    if (role < Role.CLIENT) {
      this.viewContainer.clear()
    } else {
      this.viewContainer.createEmbeddedView(this.templateRef)
    }

  }

}
