import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'wc-confirmation-dialog',
    styles: [
      'input[type=text] { width: 100%; }'
    ],
    template: `
        <kendo-dialog *ngIf="opened" (close)="close()" [minWidth]="431" [width]="431">
          <kendo-dialog-titlebar>
            {{title}}
          </kendo-dialog-titlebar>

            <div>
                {{message}}
            </div>

            <kendo-dialog-actions>
                <button class="k-button" (click)="onCancel($event)">{{cancelText}}</button>
                <button class="k-button k-primary" (click)="onConfirm($event)">{{confirmText}}</button>
            </kendo-dialog-actions>
        </kendo-dialog>
    `
})
export class ConfirmationDialogComponent {
    
    public opened: boolean = false;
    @Input() title = "Alert";
    @Input() message = "";
    @Input() cancelText = "Cancel";
    @Input() confirmText = "Confirm";
    userData:any;

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() confirm: EventEmitter<any> = new EventEmitter();

    public onConfirm(e): void {
        e.preventDefault();
        this.opened = false;
        this.confirm.emit(this.userData);
    }

    public onCancel(e): void {
        e.preventDefault();
        this.close();
    }

    public open(title:string, message:string, userData:any){
        this.title = title;
        this.message = message;
        this.userData = userData;
        this.opened = true;
    }

    public close(){
        this.opened = false;
        this.cancel.emit(this.userData);
    }

}