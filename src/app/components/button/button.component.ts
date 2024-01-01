import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent  implements OnInit {

  @Input() slot!: string
  @Input() text!: string
  @Input() callback!: Function

  constructor() { }

  ngOnInit() {}

}