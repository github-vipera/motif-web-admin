import { EditEvent, EditType } from './../../../thresholds/thresholds-component';
import { CounterInfoEntity, ThresholdInfoEntity } from '@wa-motif-open-api/counters-thresholds-service';
import { NotificationCenter, NotificationType } from './../../../../../../components/Commons/notification-center';
import { Component, OnInit, OnDestroy, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { ThresholdsComponent } from '../../../thresholds/thresholds-component';
import { ThresholdDialogResult, ThresholdEditDialogComponent, EditType as DialogEditType } from '../../../dialogs/threshold-edit-dialog-component/threshold-edit-dialog-component';

const LOG_TAG = '[ThresholdsPaneComponent]';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'wa-thresholds-pane-component',
    styleUrls: ['./thresholds-pane-component.scss'],
    templateUrl: './thresholds-pane-component.html'
})
export class ThresholdsPaneComponent implements OnInit, OnDestroy {

    faPlusCircle = faPlusCircle;    
    @ViewChild('thresholdsComponent') _thresholdsComponent: ThresholdsComponent;
    @ViewChild('editDialog') _editDialog: ThresholdEditDialogComponent;

    @Input() counterInfo: CounterInfoEntity;

    constructor(
        private logger: NGXLogger,
        private notificationCenter: NotificationCenter
    ) {}

    ngOnInit() {
    }

    ngOnDestroy() {
        this.logger.debug(LOG_TAG , 'ngOnDestroy ');
        this.freeMem();
    }

    freeMem() {
    }

    onAddNewThresholdClicked(): void {
        this.logger.debug(LOG_TAG , 'onAddNewThresholdClicked');
        this._editDialog.show(DialogEditType.New);
    }

    onRefreshClicked(): void {
        this.logger.debug(LOG_TAG , 'onRefreshClicked');
        this._thresholdsComponent.reloadData();
    }

    onGridEdit(event: EditEvent){
        this.logger.debug(LOG_TAG , 'onGridEdit:', event);
        if (event.editType === EditType.Edit){
            this.onEditItem(event.dataItem);
        }
        else if (event.editType === EditType.Delete ) {
            this.onDeleteItem(event.dataItem);
        } else if (event.editType === EditType.StatusChange ) {
            this.onChaneStatusItem(event.dataItem);
        }
    }

    private onEditItem(item: ThresholdInfoEntity){
        this._editDialog.show(DialogEditType.Update, item.name, 
            item.description, 
            item.enabled, 
            item.deny,
            item.fn,
            item.fnParams, 
            item.action, 
            item.actionParams);
    }

    private onDeleteItem(item: ThresholdInfoEntity){
        alert("TODO!! Delete!");
    }

    private onChaneStatusItem(item: ThresholdInfoEntity){
        alert("TODO!! Toggle Status!");
    }

    onEditConfirm(event: ThresholdDialogResult) {
        this.logger.debug(LOG_TAG , 'onEditConfirm:', event);
    }

}
