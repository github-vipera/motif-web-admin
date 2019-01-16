import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NGXLogger } from 'web-console-core';

const LOG_TAG = '[NewCounterInfoDialogComponent]';

export enum EditType {
    New,
    Update
}

export interface CounterInfoDialogResult {
    name: string;
    description: string;
    enabled: boolean;
    pattern: string;
    fn: string;
    fnParams: string;
    editType: EditType;
}


@Component({
    selector: 'wa-counters-thresholds-counterinfo-edit-dialog',
    styleUrls: ['./counter-info-editodialog-component.scss'],
    templateUrl: './counter-info-editodialog-component.html'
})
export class CounterInfoEditDialogComponent implements OnInit {

    display: boolean;
    private _currentEditType:EditType;
    
    confirmButtonTitle: string;

    name: string;
    description: string;
    enabled: boolean;
    pattern: string;
    fn: string;
    fnParams: string;

    @Output() confirm: EventEmitter<CounterInfoDialogResult> = new EventEmitter();
    @Output() cancel: EventEmitter<void> = new EventEmitter();

    constructor(private logger: NGXLogger) {}

    ngOnInit() {
        this.logger.debug(LOG_TAG, 'Initializing...');
    }

    public show(editType: EditType,
                 name?: string,
                 description?: string, 
                 enabled?: boolean, 
                 pattern?: string,
                fn?: string, 
                fnParams?: string): void {
        this.prepare(editType, name, description, enabled, pattern, fn, fnParams);
        this.display = true;
    }

    public hide() {
        this.display = false;
    }

    public get currentEditType(): EditType {
        return this._currentEditType;
    }

    private prepare(editType: EditType,
        name: string,
        description: string, 
        enabled: boolean, 
        pattern: string,
        fn: string, 
        fnParams: string): void {
        this.logger.debug(LOG_TAG, 'prepare for:', editType);
        this._currentEditType = editType;
        if (editType === EditType.New) {
            // empty the fields
            this.name = '';
            this.description = '';
            this.enabled = false;
            this.pattern = '';
            this.fn = '';
            this.fnParams = '';
        } else {
            this.name = name;
            this.description = description;
            this.enabled = enabled;
            this.pattern = pattern;
            this.fn = fn;
            this.fnParams = fnParams;
        }
        this.confirmButtonTitle = (editType === EditType.New ? 'Create' : 'Update');
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
        const event: CounterInfoDialogResult = {
            name: this.name,
            description: this.description,
            enabled: this.enabled,
            pattern: this.pattern,
            fn: this.fn,
            fnParams: this.fnParams,
            editType: this._currentEditType 

        };
        this.confirm.emit(event);
    }

    private validate(): boolean {
        let validate = true;
        /* TODO!!
        if (!this.name  || this.name === '') {
            this._nameEditingWarningDisplay = true;
            validate = false;
        } else {
            this._nameEditingWarningDisplay = false;
        }
        if (this.inputParams && this.inputParams.length > 0 && !this.validateJson(this.inputParams))  {
            validate = false;
            this._inputJsonWarningDisplay = true;
        } else {
            this._inputJsonWarningDisplay = false;
        }
        if (this.outputParams && this.outputParams.length > 0 && !this.validateJson(this.outputParams))  {
            validate = false;
            this._outputJsonWarningDisplay = true;
        } else {
            this._outputJsonWarningDisplay = false;
        }
        */
        return validate;
    }

    private validateJson(jsonValue: string): boolean {
        try {
            const jsonObj = JSON.parse(jsonValue);
            return true;
        } catch (ex) {
            console.log('validation error: ', ex);
            return false;
        }
    }

}
