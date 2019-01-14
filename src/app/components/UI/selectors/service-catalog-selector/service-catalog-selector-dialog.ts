import { Component, Input, Output, EventEmitter } from '@angular/core';

//        [contentStyle]="{ 'width': '680px', 'max-with': '680px', 'min-width': '680px', 'height': '460px', 'min-height':'460px','max-height': '460px', 'overflow-y':'hidden' }" 


@Component({
    selector: 'wc-service-catalog-selector-dialog',
    styles: [
      'input[type=text] { width: 100%; }'
    ],
    template: `
    <p-dialog
        [(visible)]="opened"
        [modal]="true"
        [resizable]="true"
        [responsive]="true"
        [baseZIndex]="10000"
        [closeOnEscape]="true"
        [contentStyle]="{ 'width': '800px', 'max-with': '800px', 'min-width': '800px', 'height': '500px', 'min-height':'500px','max-height': '500px', 
        'overflow': 'hidden' }" 
        >
            <p-header>{{title}}</p-header>
                <wa-service-catalog-selector></wa-service-catalog-selector>
            <p-footer>
            <kendo-buttongroup look="flat">
              <button kendoButton [toggleable]="false" (click)="onCancel();">Cancel</button>
              <button kendoButton [toggleable]="false" [primary]="true" (click)="onConfirm();">Confirm</button>
            </kendo-buttongroup>
          </p-footer>
        </p-dialog>

    `
})
export class ServiceCatalogSelectorDialogComponent {

    public opened = false;
    @Input() title = 'Select Service Catalog Item';
    @Input() message = '';
    @Input() cancelText = 'Cancel';
    @Input() confirmText = 'Select';
    userData:any;

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() confirm: EventEmitter<any> = new EventEmitter();

    public onConfirm(): void {
        this.opened = false;
        this.confirm.emit(this.userData);
    }

    public onCancel(): void {
        this.opened = false;
        this.cancel.emit();
    }

    public open(title: string, userData?: any) {
        this.title = title;
        this.userData = userData;
        this.opened = true;
    }


}