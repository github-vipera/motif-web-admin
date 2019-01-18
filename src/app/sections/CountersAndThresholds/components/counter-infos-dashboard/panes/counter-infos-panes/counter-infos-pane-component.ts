import { EditEvent } from './../../../counter-infos/counter-infos-component';
import { CounterInfoEditDialogComponent, EditType, CounterInfoDialogResult } from './../../../dialogs/counter-info-edit-dialog-component/counter-info-edit-dialog-component';
import { CounterInfoEntity } from '@wa-motif-open-api/counters-thresholds-service';
import { NotificationCenter, NotificationType } from './../../../../../../components/Commons/notification-center';
import { Component, OnInit, OnDestroy, EventEmitter, Output, Input, forwardRef, ViewChild } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { faFileImport, faDownload, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { SelectionEvent, CounterInfosComponent } from '../../../counter-infos/counter-infos-component'
import { NG_VALUE_ACCESSOR } from '@angular/forms';

const LOG_TAG = '[CounterInfosPaneComponent]';

export const WC_COUNTER_INFO_PANE_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CounterInfosPaneComponent),
    multi: true
};


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'wa-counter-infos-pane-component',
    styleUrls: ['./counter-infos-pane-component.scss'],
    templateUrl: './counter-infos-pane-component.html',
    providers: [WC_COUNTER_INFO_PANE_CONTROL_VALUE_ACCESSOR]
})
export class CounterInfosPaneComponent implements OnInit, OnDestroy {

    faPlusCircle = faPlusCircle;
    faDownload = faDownload;
    faFileImport = faFileImport;
    private _selectedCounterInfo: CounterInfoEntity;
    @ViewChild('counterInfosComponent') _counterInfosComponent: CounterInfosComponent;
    @ViewChild('editDialog') _editDialog: CounterInfoEditDialogComponent;

    @Output() selectionChange:EventEmitter<CounterInfoEntity> = new EventEmitter<CounterInfoEntity>();

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

    onCounterInfoSelectionChange(selectionEvent: SelectionEvent){
        this.logger.debug(LOG_TAG , 'onCounterInfoSelectionChange ', selectionEvent);
        this._selectedCounterInfo = selectionEvent.data;
        this.propagateChange(this._selectedCounterInfo);
        this.selectionChange.emit(selectionEvent.data);
    }

    public get selectedCounterInfo(): CounterInfoEntity {
        return this._selectedCounterInfo;
    }
    
    onAddNewCounterInfoClicked(): void {
        this.logger.debug(LOG_TAG , 'onAddNewCounterInfoClicked ');
        this._editDialog.show(EditType.New);
    }

    onRefreshClicked(): void {
        this.logger.debug(LOG_TAG , 'onRefreshClicked');
        this._counterInfosComponent.reloadData(); 
    }

    onEditConfirm(event: CounterInfoDialogResult) {
        this.logger.debug(LOG_TAG , 'onEditConfirm:', event);
    }

    onGridEdit(event: EditEvent){
        this.logger.debug(LOG_TAG , 'onGridEdit:', event);
    }

    propagateChange: any = () => {};

    writeValue(value: any) {
        if ( value ) {
         this._selectedCounterInfo = value;
        }
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: () => void): void { }

}
