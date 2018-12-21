import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, EventEmitter, Output } from '@angular/core';
import { NGXLogger } from 'web-console-core';
import { EditingType } from '../editors/service-catalog-editor-context';

const LOG_TAG = '[NewItemDialogComponent]';

export interface DialogResult {
    name: string;
    channel?: string;
}

@Component({
    selector: 'wa-services-section-newitem-dialog',
    styleUrls: ['./new-item-dialog.scss'],
    templateUrl: './new-item-dialog.html'
})
export class NewItemDialogComponent implements OnInit {

    _currentEditType: EditingType;
    dialogTitle = '';
    display: boolean;
    name: string;
    floatingLabel: string;

    @Output() confirm: EventEmitter<DialogResult> = new EventEmitter();
    @Output() cancel: EventEmitter<void> = new EventEmitter();

    constructor(private logger: NGXLogger) {}

    ngOnInit() {
        this.logger.debug(LOG_TAG, 'Initializing...');
    }

    public show(editType: EditingType): void {
        this.prepare(editType);
        this.display = true;
    }

    public hide() {
        this.display = false;
    }

    private prepare(editType: EditingType) {
        this._currentEditType = editType;
        if (editType === EditingType.Domain) {
            this.dialogTitle = 'Add new Domain';
            this.floatingLabel = 'Domain Name';
        } else if (editType === EditingType.Application) {
            this.dialogTitle = 'Add new Application';
            this.floatingLabel = 'Application Name';
        } else if (editType === EditingType.Service) {
            this.dialogTitle = 'Add new Service';
            this.floatingLabel = 'Service Name';
        } else if (editType === EditingType.Operation) {
            this.dialogTitle = 'Add new Operation';
            this.floatingLabel = 'Operation Name';
        }
        this.logger.debug(LOG_TAG, 'Title:', this.dialogTitle, editType);
        // TODO!!
    }

    onCancel(): void {
        this.display = false;
        this.cancel.emit();
    }

    onConfirm(): void {
        this.display = false;
        this.confirm.emit({
            name: 'Test'
        });
    }

}
