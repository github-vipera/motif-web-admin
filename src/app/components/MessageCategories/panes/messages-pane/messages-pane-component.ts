import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { SystemService, SystemCategory, SystemMessage, SystemMessagesList } from '@wa-motif-open-api/platform-service';
import { ConfirmationService } from 'primeng/api';
import { NotificationCenter, NotificationType } from '../../../../components/Commons/notification-center';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  EditService,
  EditServiceConfiguration
} from '../../../Grid/edit.service';
import { GridComponent } from '@progress/kendo-angular-grid';

const LOG_TAG = '[MessagesPaneComponent]';

@Component({
    selector: 'wa-message-categories-messages-pane',
    styleUrls: [ './messages-pane-component.scss', '../../message-categories-component-shared.scss' ],
    templateUrl: './messages-pane-component.html'
})
export class MessagesPaneComponent implements OnInit  {

    private _category: SystemCategory = null;
    private _domain: string = null;
    private _selectedMessage: SystemMessage = null;
    @Output() selectionChange: EventEmitter<SystemMessage> = new EventEmitter<SystemMessage>();

    data: SystemMessagesList = [];

    private editService: EditService = new EditService();
    private editServiceConfiguration: EditServiceConfiguration = {
      idField: 'locale',
      dirtyField: 'isDirty',
      isNewField: 'isNew'
    };
    public formGroup: FormGroup;
    private editedRowIndex: number;

    @ViewChild('grid') _grid: GridComponent;

    constructor(private logger: NGXLogger,
        private systemService: SystemService,
        private confirmationService: ConfirmationService,
        private notificationCenter: NotificationCenter,
        private formBuilder: FormBuilder
    ) {

    }

    ngOnInit() {
        this.logger.debug(LOG_TAG , 'Initializing...');
    }

    private reloadMessages() {
        if (this._category && this._domain){
            this.logger.debug(LOG_TAG , 'reloadMessages for ', this._domain, this._category.name);
            this.systemService.getSystemMessages(this._domain, this._category.name).subscribe((data: SystemMessagesList) => {
                this.data = data;
                for (let i = 0; i < data.length; i++) {
                    const message = this.data[i];
                }
                this.logger.debug(LOG_TAG , 'reloadMessages: ', data);
            }, (error) => {
                this.logger.error(LOG_TAG , 'reloadMessages error: ', error);
            });
        } else {
            this.data = [];
        }
    }

    @Input()
    set category(category: SystemCategory) {
        this._category = category;
        this.reloadMessages();
        this.logger.debug(LOG_TAG , 'Category changed: ', this._category);
    }

    get category(): SystemCategory {
        return this._category;
    }

    onSelectionChange(event){
        this.logger.debug(LOG_TAG , 'onSelectionChange: ', event);
        this._selectedMessage = event.selectedRows[0].dataItem;
        this.selectionChange.emit(this._selectedMessage);
    }

    @Input()
    set domain(domain: string) {
        this._domain = domain;
        this._category = null;
        this.reloadMessages();
    }

    get domain(): string {
        return this._domain;
    }

    /**
     * Trgiggered by the button
     */
    addNewClicked(): void {
        this.formGroup = this.createFormGroup({
            message: 'New Message',
            locale: 'en'
        });
        this._grid.addRow(this.formGroup);
    }

      /**
   * triggered by the button
   */
  removeClicked(): void {
    if (this._selectedMessage) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to remove the selected message for Locale \'' + this._selectedMessage.locale + '\' ?',
        accept: () => {
          this.removeMessage(this._selectedMessage);
        }
      });
    }
  }

  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      locale: dataItem.locale,
      message: dataItem.message
    });
  }

    /**
     * Triggered by the grid component
     */
    public onKeydown(sender: any, e: any) {
        console.log('onKeydown ' + e.key);

        if (e.key === 'Escape') {
        this.closeEditor();
            // Stop parent form from submitting
            e.preventDefault();
        }

        if (e.key !== 'Enter') {
            return;
        }
        if (!this.formGroup || !this.formGroup.valid) {
            return;
        }

        this.createNewMessage(this.formGroup.value);

        // Stop parent form from submitting
        e.preventDefault();
    }

  /**
   * triggered by the grid
   */
  public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;
    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      this.editService.assignValues(dataItem, formGroup.value);
      this.editService.update(dataItem);
    }
  }

  private closeEditor() {
    this._grid.closeRow(this.editedRowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  private removeMessage(message: SystemMessage): void {
    // TODO!!
    alert('removeMessage TODO!!');
}

private createNewMessage(message: SystemMessage): void {
    // TODO!!
    alert('createNewMessage TODO!!');
}

public get canAdd(): boolean {
    console.log('canAdd >> ', this._category, this._domain);
    return ((this._category !== null) && (this._domain !== null));
}

public get canRemove(): boolean {
    return (this._selectedMessage !== null);
}

}
