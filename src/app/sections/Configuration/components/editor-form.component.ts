import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ConfigurationRow, DataType } from '../data/model'

interface DataType {
    name:string;
    value:string;
}


@Component({
    selector: 'configuration-section-edit-form',
    styles: [
      'input[type=text] { width: 100%; }'
    ],
    template: `
        <kendo-dialog *ngIf="active" (close)="closeForm()" [minWidth]="431"  [height]="400">
          <kendo-dialog-titlebar>
            {{ isNew ? 'Add New Property' : 'Edit Property' }}
          </kendo-dialog-titlebar>
            
            <form novalidate [formGroup]="editForm">
                <div class="wc-form-group">
                    <label for="name" class="control-label">Name</label>
                    <input type="text" class="k-textbox" formControlName="name" />
                    <div
                        class="k-tooltip k-tooltip-validation wc-form-group-tooltip"
                        [hidden]="editForm.controls.name.valid || editForm.controls.name.pristine">
                        Property Name is required
                    </div>
                </div>

                <div class="wc-form-group">
                    <label for="type" class="control-label">Type</label>
                    <kendo-combobox formControlName="type" [data]="dataTypes" [textField]="'name'" [valueField]="'value'"  [valuePrimitive]="true" required></kendo-combobox>
                </div>

                <div class="wc-form-group">
                    <label>
                        Dynamic
                    </label>
                    <input type="checkbox" formControlName="dynamic" />
                    </div>

                <div class="wc-form-group">
                    <label>
                        Crypted
                    </label>
                    <input type="checkbox" formControlName="crypted" />
                    </div>

                <div class="wc-form-group">
                    <label for="value" class="control-label">Value</label>
                    <input type="text" class="k-textbox" formControlName="value" />
                    <div
                        class="k-tooltip k-tooltip-validation"
                        [hidden]="editForm.controls.value.valid || editForm.controls.value.pristine">
                        Type is required
                    </div>
                </div>


            </form>

            <kendo-dialog-actions>
                <button class="k-button" (click)="onCancel($event)">Cancel</button>
                <button class="k-button k-primary" [disabled]="!editForm.valid" (click)="onSave($event)">Save</button>
            </kendo-dialog-actions>
        </kendo-dialog>
    `
})
export class ConfigurationSectionEditFormComponent {
    public active = false;

    public editForm: FormGroup = new FormGroup({
        'name': new FormControl('', Validators.required),
        'type': new FormControl({name:"", value:""}),
        'dynamic': new FormControl(false),
        'crypted': new FormControl(false),
        'value': new FormControl()
    });

    @Input() public dataTypes = [ 
            {name:"java.lang.String", value:"java.lang.String"},
            {name:"java.lang.Double", value:"java.lang.Double"},
            {name:"java.lang.Integer", value:"java.lang.Integer"}
            {name:"java.lang.Long", value:"java.lang.Long"},
            {name:"java.lang.Boolean",value:"java.lang.Boolean"},
            {name:"Password", value:"password"}];

    @Input() public isNew = true;

    @Input() public set model(configurationRow: ConfigurationRow) {
        this.editForm.reset(configurationRow);
        this.active = configurationRow !== undefined;
    }

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<ConfigurationRow> = new EventEmitter();

    selectedDataType:DataType;

    public onSave(e): void {
        console.log(">>> form value:", this.editForm.controls["type"].value);
        console.log(">>> form value:", this.editForm.value);
        e.preventDefault();
        this.save.emit(this.editForm.value);
        this.active = false;
    }

    public onCancel(e): void {
        e.preventDefault();
        this.closeForm();
    }

    private closeForm(): void {
        this.active = false;
        this.model = undefined;
        this.cancel.emit();
    }
}