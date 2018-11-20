import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ConfigurationRow } from '../data/model'

@Component({
    selector: 'configuration-section-edit-form',
    styles: [
      'input[type=text] { width: 100%; }'
    ],
    template: `
        <kendo-dialog *ngIf="active" (close)="closeForm()" [minWidth]="430"  [height]="400">
          <kendo-dialog-titlebar>
            {{ isNew ? 'Add new Property' : 'Edit Property' }}
          </kendo-dialog-titlebar>
            
            <form novalidate [formGroup]="editForm">
                <div class="wc-form-group">
                    <label for="Name" class="control-label">Name</label>
                    <input type="text" class="k-textbox" formControlName="Name" />
                    <div
                        class="k-tooltip k-tooltip-validation wc-form-group-tooltip"
                        [hidden]="editForm.controls.Name.valid || editForm.controls.Name.pristine">
                        Property Name is required
                    </div>
                </div>

                <div class="wc-form-group">
                    <label for="Type" class="control-label">Type</label>
                    <input type="text" class="k-textbox" formControlName="Type" />
                    <div
                        class="k-tooltip k-tooltip-validation wc-form-group-tooltip"
                        [hidden]="editForm.controls.Type.valid || editForm.controls.Type.pristine">
                        Type is required
                    </div>
                </div>

                <div class="wc-form-group">
                    <label>
                        Dynamic
                    </label>
                    <input type="checkbox" formControlName="Dynamic" />
                    </div>

                <div class="wc-form-group">
                    <label>
                        Crypted
                    </label>
                    <input type="checkbox" formControlName="Crypted" />
                    </div>

                <div class="wc-form-group">
                    <label for="Value" class="control-label">Value</label>
                    <input type="text" class="k-textbox" formControlName="Value" />
                    <div
                        class="k-tooltip k-tooltip-validation"
                        [hidden]="editForm.controls.Value.valid || editForm.controls.Value.pristine">
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
        'Name': new FormControl('', Validators.required),
        'Type': new FormControl('', Validators.required),
        'Dynamic': new FormControl(false),
        'Crypted': new FormControl(false),
        'Value': new FormControl()
    });

    @Input() public isNew = false;

    @Input() public set model(configurationRow: ConfigurationRow) {
        this.editForm.reset(configurationRow);
        this.active = configurationRow !== undefined;
    }

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<ConfigurationRow> = new EventEmitter();

    public onSave(e): void {
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
        this.cancel.emit();
    }
}