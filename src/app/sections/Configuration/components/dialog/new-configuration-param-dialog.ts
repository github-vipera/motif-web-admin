import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, EventEmitter, Output } from '@angular/core';
import { NGXLogger } from 'web-console-core';

const LOG_TAG = '[NewConfigurationParamDialogComponent]';

export interface NewParamDialogResult {
    name: string;
    type: string;
    dynamic: boolean;
    encrypted: boolean;
    value: string;
}

@Component({
    selector: 'wa-configuration-section-new-config-param-dialog',
    styleUrls: ['./new-configuration-param-dialog.scss'],
    templateUrl: './new-configuration-param-dialog.html'
})
export class NewConfigurationParamDialogComponent implements OnInit {

    dataTypes: string[] = [
        'java.lang.String',
        'java.lang.Double',
        'java.lang.Integer',
        'java.lang.Long',
        'java.lang.Boolean',
        'password'
    ];

    display: boolean;
    name: string;
    type: string;
    dynamic: boolean;
    encrypted: boolean;
    value: string;
    _nameEditingWarningDisplay: boolean;

    @Output() confirm: EventEmitter<NewParamDialogResult> = new EventEmitter();
    @Output() cancel: EventEmitter<void> = new EventEmitter();

    constructor(private logger: NGXLogger) {}

    ngOnInit() {
        this.logger.debug(LOG_TAG, 'Initializing...');
    }

    public show(): void {
        this.prepare();
        this.display = true;
    }

    public hide() {
        this.display = false;
    }

    private prepare(): void {
        this.logger.debug(LOG_TAG, 'prepare called');
        // empty the fields
        this.name = '';
        this.type = '';
        this.dynamic = false;
        this.encrypted = false;
        this.value = '';
    }

    onCancel(): void {
        this.display = false;
        this.cancel.emit();
    }

    onConfirm(): void {
        if (!this.validate()) {
            return;
        }
        this.display = false;
        const event: NewParamDialogResult = {
            name: this.name,
            type: this.type,
            dynamic: this.dynamic,
            encrypted: this.encrypted,
            value: this.value
        };
        this.confirm.emit(event);
    }


    get nameEditingWarningDisplay(): boolean {
        return this._nameEditingWarningDisplay;
    }

    private validate(): boolean {
        let validate = true;
        if (!this.name  || this.name === '') {
            this._nameEditingWarningDisplay = true;
            validate = false;
        } else {
            this._nameEditingWarningDisplay = false;
        }
        return validate;
    }

}
