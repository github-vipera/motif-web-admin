import { GridEditorCommandsConfig } from './../../../../components/Grid/grid-editor-commands-group/grid-editor-commands-group-component';
import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { NotificationCenter, NotificationType } from './../../../../components/Commons/notification-center';
import { CountersService, CounterInfoEntityList } from '@wa-motif-open-api/counters-thresholds-service';
import { SubscriptionHandler } from 'src/app/components/Commons/subscription-handler';
import { CounterInfosModel } from './data/model';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { SelectableSettings } from '@progress/kendo-angular-grid';

const LOG_TAG = '[CounterInfosComponent]';

export interface SelectionEvent {
    counterInfoName: string;
    data: any
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'wa-counter-infos-component',
    styleUrls: ['./counter-infos-component.scss'],
    templateUrl: './counter-infos-component.html'
})
export class CounterInfosComponent implements OnInit, OnDestroy {

    loading = false;
    private _subHandler: SubscriptionHandler = new SubscriptionHandler();
    private tableModel: CounterInfosModel;
    faEdit = faEdit;
    selectedCounterInfo: string;

    @Output() selectionChange : EventEmitter<SelectionEvent> = new EventEmitter();
    
    public selectableSettings: SelectableSettings = {
        mode: 'single',
        enabled: true,
        checkboxOnly: false
    }

    commands: GridEditorCommandsConfig = [
        { 
            commandIcon: 'assets/img/icons.svg#ico-edit',
            commandId: 'cmd1',
            title: 'Edit'
        },
        { 
            commandIcon: 'assets/img/icons.svg#ico-no',
            commandId: 'cmd2',
            title: 'Delete',
            hasConfirmation: true,
            confirmationTitle: 'Delete ?' 
        }
    ];
    
    constructor(
        private logger: NGXLogger,
        private notificationCenter: NotificationCenter,
        private countersService: CountersService
    ) {}

    ngOnInit() {
        this.tableModel = new CounterInfosModel();
        this.reloadData();
    }

    ngOnDestroy() {
        this.logger.debug(LOG_TAG , 'ngOnDestroy ');
        this.freeMem();
    }

    freeMem() {
        this.tableModel.close();
    }

    reloadData() {
        this.logger.debug(LOG_TAG, 'reloadData called');
        this.loading = true;
        this._subHandler.add(this.countersService.getCounterInfoList().subscribe( (data: CounterInfoEntityList) => {
            this.logger.debug(LOG_TAG, 'getCounterInfoList done: ', data);
            this.tableModel.loadData(data);
            this.loading = false;
        }, (error) => {
            this.logger.error(LOG_TAG, 'getCounterInfoList error: ', error);
            this.notificationCenter.post({
                name: 'GetCounterInfosError',
                title: 'Get Counter Infos',
                message: 'Error getting counter infos:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });
            this.loading = false;
        }));
    }

    onSelectionChange(event) {
        this.logger.debug(LOG_TAG, 'onSelectionChange event: ', event);
        let data = null;
        if (event.selectedRows.length>0){
            this.selectedCounterInfo = event.selectedRows[0].dataItem.name;
            data = event.selectedRows[0].dataItem;
        } else {
            this.selectedCounterInfo = null;
        }
        this.selectionChange.emit({
            counterInfoName: this.selectedCounterInfo,
            data: data
        });
    }

}
