import { EditEvent } from './../../../thresholds/thresholds-component';
import { CounterInfoEntity } from '@wa-motif-open-api/counters-thresholds-service';
import { NotificationCenter, NotificationType } from './../../../../../../components/Commons/notification-center';
import { Component, OnInit, OnDestroy, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { ThresholdsComponent } from '../../../thresholds/thresholds-component';
import { ThresholdDialogResult, ThresholdEditDialogComponent, EditType } from '../../../dialogs/threshold-edit-dialog-component/threshold-edit-dialog-component';

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
        this._editDialog.show(EditType.New);
    }

    onRefreshClicked(): void {
        this.logger.debug(LOG_TAG , 'onRefreshClicked');
        this._thresholdsComponent.reloadData();
    }

    onGridEdit(event: EditEvent){
        this.logger.debug(LOG_TAG , 'onGridEdit:', event);
    }

    onEditConfirm(event: ThresholdDialogResult) {
        this.logger.debug(LOG_TAG , 'onEditConfirm:', event);
    }

}
