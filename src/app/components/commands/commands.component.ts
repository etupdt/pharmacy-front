import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Client } from 'src/app/entities/client';
import { Command } from 'src/app/entities/command';
import { State } from 'src/app/enums/state';
import { ClientService } from 'src/app/services/client.service';
import { CommandService } from 'src/app/services/command.service';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.scss'],
})
export class CommandsComponent  implements OnInit {

  commands: Command[] = []

  states: string[] = []

  constructor(
    private clientService: ClientService,
    private commandService: CommandService,
    private toastController: ToastController
  ) { }

  ngOnInit() {

    for (let state in State) {
      if (isNaN(Number(state))) {
        this.states.push(state)
      }
    }

    this.getCommands(this.clientService.client)

  }

  getCommands = (client?: Client) => {

    this.commandService.getCommands(undefined).subscribe({
      next: (res: any[]) => {
        let commands: Command[] = []
        res.forEach(command => commands.push(new Command().deserialize(command)))
        this.commands = commands
      },
      error: (error: { error: { message: any; }; }) => {
      }
    })

  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position,
    });

    await toast.present();
  }

  getTotalPriceCommand = (id: number) => {
    let total = 0
    this.commands.filter(command => command.getId === id)
    .map(command => {
      command.getDispatches.forEach(dispatch => {
        dispatch.getDispatchLines.forEach(dispatchLine => {
          total += dispatchLine.getPayedPrice
        });
      })
    })
    return total
  }
  get getClient () {return this.clientService.client}

}
