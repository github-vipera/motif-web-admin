import { GridEditorCommandsConfig } from '../../../../components/Grid/grid-editor-commands-group/grid-editor-commands-group-component';
import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { NotificationCenter, NotificationType } from '../../../../components/Commons/notification-center';
import { CountersService, ThresholdInfoEntityList } from '@wa-motif-open-api/counters-thresholds-service';
import { SubscriptionHandler } from 'src/app/components/Commons/subscription-handler';
import { ThresholdsInfosModel } from './data/model'; 
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const LOG_TAG = '[ThresholdsComponent]';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'wa-threshols-component',
    styleUrls: ['./thresholds-component.scss'],
    templateUrl: './thresholds-component.html'
})
export class ThresholdsComponent implements OnInit, OnDestroy {


    loading = false;
    private _subHandler: SubscriptionHandler = new SubscriptionHandler();
    public tableModel: ThresholdsInfosModel;
    faEdit = faEdit;
    private _counterInfo: string;

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
    ) {
        this.tableModel = new ThresholdsInfosModel();
    }

    ngOnInit() {
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
        if (this._counterInfo){
            this._subHandler.add(this.countersService.getThresholdInfoList(this._counterInfo).subscribe( (data: ThresholdInfoEntityList) => {
                this.logger.debug(LOG_TAG, 'getThresholdInfoList done: ', data);
                this.tableModel.loadData(data);
                this.loading = false;
                this._counterInfo = null;
            }, (error) => {
                this.logger.error(LOG_TAG, 'getThresholdInfoList error: ', error);
                this.notificationCenter.post({
                    name: 'GetThresholdsListError',
                    title: 'Get Thresholds List',
                    message: 'Error getting thresholds list:',
                    type: NotificationType.Error,
                    error: error,
                    closable: true
                });
                this.loading = false;
            }));
        } else {
            this.tableModel.close();
            this._counterInfo = null;
            this.loading = false;
        }

    }

    @Input() public set counterInfo(counterInfo: string) {
        this.logger.debug(LOG_TAG, 'set counterInfo:', counterInfo);
        this._counterInfo = counterInfo;
        this.reloadData();
    }

    public get counterInfo(): string {
        return this._counterInfo;
    }

}
