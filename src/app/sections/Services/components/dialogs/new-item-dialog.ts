import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, EventEmitter, Output } from '@angular/core';
import { NGXLogger } from 'web-console-core';
import { EditingType } from '../editors/service-catalog-editor-context';

const LOG_TAG = '[NewItemDialogComponent]';

export interface DialogResult {
    name: string;
    editType: EditingType;
    channel?: string;
}

interface Channel {
    name: string;
    code: string;
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

    channels: Channel[] = [
        { name: 'JSON', code: 'JSON'},
        { name: 'Browser', code: 'BROWSER'},
        { name: 'REST', code: 'REST'},
        { name: 'SMS', code: 'SMS'},
        { name: 'WebAdmin', code: 'WEBADMIN'},
        { name: 'WebContent', code: 'WEBCONTENT'},
    ];
    selectedChannel: Channel;

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

    public get currentEditType(): EditingType {
        return this._currentEditType;
    }

    private prepare(editType: EditingType) {
        this.logger.debug(LOG_TAG, 'prepare for:', editType);
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
        // empty the fields
        this.name = '';
        this.selectedChannel = null;
    }

    onCancel(): void {
        this.display = false;
        this.cancel.emit();
    }

    onConfirm(): void {
        this.display = false;
        this.confirm.emit({
            name: 'Test',
            editType: this._currentEditType
        });
    }

    isServiceEditing(): boolean {
        return (this._currentEditType === EditingType.Service)
    }

}
