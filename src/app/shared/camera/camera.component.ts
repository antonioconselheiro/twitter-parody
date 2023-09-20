import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MainErrorObservable } from '@shared/main-error/main-error.observable';
import QrScanner from 'qr-scanner';
import { Subscription } from 'rxjs';
import { CameraFunctions } from './camera-functions.enum';
import { CameraObservable } from './camera.observable';
import { ICloseable } from '@shared/util/closeable.interface';

@Component({
  selector: 'tw-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit, OnDestroy, ICloseable {

  @ViewChild('video', { read: ElementRef })
  videoEl?: ElementRef<HTMLVideoElement>;
  scanning?: QrScanner;

  status: CameraFunctions | null = null;

  private subscriptions = new Subscription();

  constructor(
    private camera$: CameraObservable,
    private error$: MainErrorObservable
  ) { }

  ngOnInit(): void {
    this.listenCameraObservable();
  }

  private listenCameraObservable(): void {
    this.subscriptions.add(this.camera$.asObservable().subscribe({
      next: status => {
        this.status = status;
        //  aguardando execução para o próximo tick de processamento,
        //  para que o video disponível na estrutura do DOM
        // eslint-disable-next-line ban/ban
        setTimeout(() => this.onStatusUpdate(status));
      },
      error: error => this.error$.next(error)
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private onStatusUpdate(status: CameraFunctions | null): void {
    if (!status) {
      return;
    }

    const video = this.videoEl?.nativeElement;
    if (video) {
      if (status === CameraFunctions.READ_QR_CODE) {
        this.readQRCode(video).catch(e => this.error$.next(e));
      }
    }
  }

  private async readQRCode(video: HTMLVideoElement): Promise<void> {
    const qrScanner = new QrScanner(
      video, result => {
        this.camera$.qrCodeResponse.next(result.data);
        this.close();
      }, {}
    );

    const cameras = await QrScanner.listCameras();
    await qrScanner.setCamera(cameras[0].id);
    await qrScanner.start();
    return Promise.resolve();
  }

  // eslint-disable-next-line complexity
  close(): void {
    this.stopStreaming();
    this.stopScanning();
    this.completeSubscriptions();
  }

  private stopStreaming(): void {
    if (this.videoEl && this.videoEl.nativeElement) {
      const stream = this.videoEl.nativeElement.srcObject as MediaStream | null;
      if (stream instanceof MediaStream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }

  private stopScanning(): void {
    if (this.scanning) {
      this.scanning.stop();
      this.scanning.destroy();
    }
  }

  private completeSubscriptions(): void {
    if (!this.camera$.qrCodeResponse.closed) {
      this.camera$.qrCodeResponse.complete();
    }

    this.camera$.next(null);
  }
}
