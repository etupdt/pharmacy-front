import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  retour: string = ''

  transform(value: string, ...args: unknown[]): string {
    console.log('image', typeof value, value)
    console.log('image', typeof value, value)
    if (typeof value === 'string') {
      console.log('string')
      this.retour = value
    } else {

      readFileAsDataURL(value, this.retour)

    }
console.log('retour', this.retour)
    return this.retour

  }

}

  async function readFileAsDataURL(file: any, retour: string) {

    let result_base64 = await new Promise<string>((resolve) => {
        let fileReader = new FileReader();
        fileReader.onload = (e) => resolve(fileReader.result as string);
        fileReader.readAsDataURL(file);
    });
    console.log('charge', result_base64)
    retour = result_base64

  }
