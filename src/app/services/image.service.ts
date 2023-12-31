import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  container!: ElementRef
  canvas!: any
  canvasImage!: any

  image: any
  imageSrc: string = ''

  constructor(
    private http: HttpClient,
  ) { }

  canvasW!: number
  canvasH!: number

  cadreW!: number
  cadreH!: number

  x: number = 0
  y: number = 0
  w!: number
  h!: number

  ancX!: number
  ancY!: number

  curseur: string = ''
  corner = ''
  isMouseDown = false

  ctx!: CanvasRenderingContext2D
  ctxImage!: CanvasRenderingContext2D

  afterViewInit(
    container: ElementRef,
    canvas: any,
    canvasImage: any,
    imageSrc: string,
    cadreW: number,
    cadreH: number
  ) {

    this.container = container

    this.canvas = canvas.nativeElement
    this.canvas.id = 'CursorLayer';

    this.canvasImage = canvasImage.nativeElement
    this.canvasImage.id = 'canvasImage';

    this.cadreW = cadreW
    this.cadreH = cadreH

    this.canvasImage.width = 701
    this.canvasImage.height = 501

    this.ctx = this.canvas.getContext('2d')
    this.ctxImage = this.canvasImage.getContext('2d')

    this.image = new Image()
    this.imageSrc = imageSrc
    this.image.src = this.imageSrc

    this.image.onload = () => {
      this.ctxImage.drawImage(this.image, 0, 0)
    }

    this.canvasW = this.container.nativeElement.offsetWidth
    this.canvasH = this.container.nativeElement.offsetHeight

//    this.ctx.globalCompositeOperation = "difference";
    this.ctx.strokeStyle = '#ff00ff';
    this.ctx.lineWidth = 2;

    this.w = this.cadreW
    this.h = this.cadreH

    this.ctx.strokeRect(this.x, this.y, this.w, this.h);

  }

  getImage(url: string): Observable<Blob> {

  //  let headers = new HttpHeaders()
  //  headers.append('Accept','image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8')

    return this.http.get<Blob>(
      url, { observe: 'body', responseType: 'blob' as 'json' }
    )

  }

  mouseDown = (e: MouseEvent) => {

    this.canvasW = this.container.nativeElement.offsetWidth
    this.canvasH = this.container.nativeElement.offsetHeight

    this.canvas.width = this.canvasW
    this.canvas.height = this.canvasH

    this.canvasImage.width = this.canvasW
    this.canvasImage.height = this.canvasH

    this.ctxImage.drawImage(this.image, this.x, this.y, this.w, this.h, 0, 0, this.canvasW, this.canvasH)

    this.ctx.strokeRect(this.x, this.y, this.w, this.h);
    switch (this.corner) {
      case 'nw': {
        this.ancX = this.x
        this.ancY = this.y
        break
      }
      case 'ne': {
        this.ancX = this.x + this.w
        this.ancY = this.y
        break
      }
      case 'sw': {
        this.ancX = this.x
        this.ancY = this.y + this.h
        break
      }
      case 'se': {
        this.ancX = this.x + this.w
        this.ancY = this.y + this.h
        break
      }
      default: {
        this.ancX = e.offsetX
        this.ancY = e.offsetY
      }
    }

    this.isMouseDown = true

  }

  mouseMove = (e: MouseEvent) => {

    let main = ''

    if (this.isMouseDown && this.curseur === 'move') {

      this.ctx.clearRect(0, 0, this.canvasW, this.canvasH)

      this.x += e.offsetX - this.ancX
      this.y += e.offsetY - this.ancY

      if (this.x < 0) this.x = 0
      if (this.x + this.w > this.canvasW) this.x = this.canvasW - this.w

      if (this.y < 0) this.y = 0
      if (this.y + this.h > this.canvasH) this.y = this.canvasH - this.h

      this.ancX = e.offsetX
      this.ancY = e.offsetY

      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(this.x, this.y, this.w, this.h);

    }

    if (this.isMouseDown && this.corner !== '') {

      this.ctx.clearRect(0, 0, this.canvasW, this.canvasH)

      const axe = Math.abs(this.y + this.h / 2 - e.offsetY) / Math.abs(this.x + this.w / 2 - e.offsetX) > this.cadreH / this.cadreW
      ? 'y' : 'x'

      if (this.ancX === this.x + this.w) main = 'right'
      if (this.ancX === this.x) main = 'left'
      if (this.ancY === this.y + this.h) main = 'bottom'
      if (this.ancY === this.y) main = 'top'

      if (axe === 'x') {
        if (main === 'right') {
          this.w = e.offsetX - this.x
          if (this.corner === 'se') {
            this.h = Math.round(this.w * this.cadreH / this.cadreW)
          } else {
            this.h = this.y + this.h - this.cadreH + Math.round(e.offsetX * this.cadreH / this.cadreW)
            this.y = this.cadreH - Math.round(e.offsetX * this.cadreH / this.cadreW)
          }
        }
        if (main === 'left') {
          this.w -= e.offsetX - this.x
          this.x = e.offsetX
          if (this.corner === 'sw') {
            this.h = Math.round(this.w * this.cadreH / this.cadreW)
          } else {
            this.h = this.y + this.h - Math.round(e.offsetX * this.cadreH / this.cadreW)
            this.y = Math.round(e.offsetX * this.cadreH / this.cadreW)
          }
        }
        if (main === 'bottom') {
          if (this.corner === 'sw') {
            this.w = this.x + this.w - e.offsetX
            this.x = e.offsetX
          } else {
            this.w += e.offsetX - this.x - this.w
          }
          this.h = Math.round(this.w * this.cadreH / this.cadreW)
        }
        if (main === 'top') {
          if (this.corner === 'nw') {
            this.w = this.w + this.x - e.offsetX
            this.x = e.offsetX
            this.h = this.y + this.h - Math.round(e.offsetX * this.cadreH / this.cadreW)
            this.y = Math.round(e.offsetX * this.cadreH / this.cadreW)
          } else {
            this.w = e.offsetX - this.x
            this.h = this.y + this.h - this.cadreH + Math.round(e.offsetX * this.cadreH / this.cadreW)
            this.y = this.cadreH - Math.round(e.offsetX * this.cadreH / this.cadreW)
          }
        }

      }

      if (axe === 'y') {
        if (main === 'right') {
          if (this.corner === 'se') {
            this.h = e.offsetY - this.y
            this.w = Math.round(this.h * this.cadreW / this.cadreH)
          } else {
            this.h = this.y + this.h - e.offsetY
            this.y = e.offsetY
            this.w = this.cadreW - Math.round(this.y * this.cadreW / this.cadreH) - this.x
          }
        }
        if (main === 'left') {
          if (this.corner === 'sw') {
            this.h = e.offsetY - this.y
            this.w = this.x + this.w - Math.round((this.cadreH - this.y - this.h) * this.cadreW / this.cadreH)
            this.x = Math.round((this.cadreH - this.y - this.h) * this.cadreW / this.cadreH)
          } else {
            this.h = this.h + this.y - e.offsetY
            this.y = e.offsetY
            this.w = this.x + this.w - Math.round(this.y * this.cadreW / this.cadreH)
            this.x = Math.round(this.y * this.cadreW / this.cadreH)
          }
        }
        if (main === 'bottom') {
          this.h = e.offsetY - this.y
          if (this.corner === 'sw') {
            this.x = this.x + this.w - Math.round(this.h * this.cadreW / this.cadreH)
            this.w = Math.round(this.h * this.cadreW / this.cadreH)
          } else {
            this.w = Math.round(this.h * this.cadreW / this.cadreH)
          }
        }
        if (main === 'top') {
          this.h = this.h + this.y - e.offsetY
          this.y = e.offsetY
          if (this.corner === 'nw') {
            this.w = this.x + this.w - Math.round(e.offsetY * this.cadreW / this.cadreH)
            this.x = Math.round(e.offsetY * this.cadreW / this.cadreH)
          } else {
            this.w = this.cadreW - Math.round(this.y * this.cadreW / this.cadreH) - this.x
          }
        }

      }

      console.log(axe, main, this.corner)
      console.log('x', this.x, 'y', this.y, 'w', this.w, 'h', this.h, 'offsets', e.offsetX, e.offsetY)

      if (this.x < 0) this.x = 0
      if (this.y < 0) this.y = 0
      if (this.x + this.w > this.canvasW) this.w = this.canvasW - this.x
      if (this.y + this.h > this.canvasH) this.h = this.canvasH - this.y

      this.ancX = e.offsetX
      this.ancY = e.offsetY

      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(this.x, this.y, this.w, this.h);

    }

    if (!this.isMouseDown) {

      this.corner = ''

      if (e.offsetX - this.x > 10 && (this.x + this.w) - e.offsetX > 10 &&
        e.offsetY - this.y > 10 && (this.y + this.h) - e.offsetY > 10) {
        this.curseur = 'move'
      } else if (this.x - e.offsetX < 6 && e.offsetX - this.x < 6 &&
        this.y - e.offsetY < 6 && e.offsetY - this.y < 6) {
        this.curseur = 'nwse-resize'
        this.corner = 'nw'
      } else if ((this.x + this.w) - e.offsetX < 6 && e.offsetX - (this.x + this.w) < 6 &&
        (this.y + this.h) - e.offsetY < 6 && e.offsetY - (this.y + this.h) < 6) {
        this.curseur = 'nwse-resize'
        this.corner = 'se'
      } else if (this.x - e.offsetX < 6 && e.offsetX - this.x < 6 &&
        (this.y + this.h) - e.offsetY < 6 && e.offsetY - (this.y + this.h) < 6) {
        this.curseur = 'nesw-resize'
        this.corner = 'sw'
      } else if ((this.x + this.w) - e.offsetX < 6 && e.offsetX - (this.x + this.w) < 6 &&
        this.y - e.offsetY < 6 && e.offsetY - this.y < 6) {
        this.curseur = 'nesw-resize'
        this.corner = 'ne'
      } else {
        this.curseur = 'initial'
      }

    }

  }

}
