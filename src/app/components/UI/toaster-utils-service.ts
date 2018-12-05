import { Injectable } from '@angular/core';
import { WCToasterService } from 'web-console-ui-kit'


@Injectable({
    providedIn: 'root'
  })
export class ToasterUtilsService  {

    constructor(private toaster: WCToasterService) {
    }

    public showInfo(title:string, message:string):void {
        this.toaster.info(message, title, {
            positionClass: 'toast-top-center'
        });
    }

    public showError(title:string, message:string):void {
        this.toaster.error(message, title, {
            positionClass: 'toast-top-center',
            closeButton: true,
            disableTimeOut: true,
            toastClass: 'toast wc-toast'
        });
    }

    public showAlert(title:string, message:string):void {
        this.toaster.warning(message, title, {
            positionClass: 'toast-top-center'
        });
    }

}
