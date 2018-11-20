import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ConfigurationRow } from './data/model'

@Component({
    selector: 'configuration-section-edit-form',
    styles: [
      'input[type=text] { width: 100%; }'
    ],
    template: `
        <kendo-dialog *ngIf="active" (close)="closeForm()">
          <kendo-dialog-titlebar>
            {{ isNew ? 'Add new product' : 'Edit product' }}
          </kendo-dialog-titlebar>

            <form novalidate [formGroup]="editForm">
                <div class="form-group">
                    <label for="ProductName" class="control-label">Product name</label>

                    <input type="text" class="k-textbox" formControlName="ProductName" />

                    <div
                        class="k-tooltip k-tooltip-validation"
                        [hidden]="editForm.controls.ProductName.valid || editForm.controls.ProductName.pristine">
                        ProductName is required
                    </div>
                </div>
                <div class="form-group">
                    <label for="UnitPrice" class="control-label">Unit price</label>

                    <input type="text" class="k-textbox" formControlName="UnitPrice" />
                </div>
                <div class="form-group">
                    <label for="UnitsInStock" class="control-label">Units in stock</label>

                    <input type="text" class="k-textbox" formControlName="UnitsInStock" />

                    <div
                        class="k-tooltip k-tooltip-validation"
                        [hidden]="editForm.controls.UnitsInStock.valid || editForm.controls.UnitsInStock.pristine">
                        Units must be between 0 and 99
                    </div>
                </div>
                <div class="form-group">
                    <label>
                      <input type="checkbox" formControlName="Discontinued" />
                      Discontinued product
                    </label>
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
        'Name': new FormControl(),
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