import { GridEditorCommandsConfig } from './../../../components/Grid/grid-editor-commands-group/grid-editor-commands-group-component';
import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { PluginView } from 'web-console-core';
import { NGXLogger} from 'web-console-core';
import { NotificationCenter, NotificationType } from '../../../components/Commons/notification-center';
import { WebcontentService, BundleStatusList, BundleStatus, ClusterBundleStatus } from '@wa-motif-open-api/web-content-service';
import { SubscriptionHandler } from 'src/app/components/Commons/subscription-handler';
import * as _ from 'lodash';

const LOG_TAG = '[WebContentSectionComponent]';

export enum PublishingStatus {
    Published = 'PUBLISHED',
    Unpublished = 'UNPUBLISHED',
    Error = 'IN ERROR'
}

@Component({
    selector: 'wa-web-content-section',
    styleUrls: [ './webcontent-section-component.scss' ],
    templateUrl: './webcontent-section-component.html'
  })
  @PluginView('WebContent', {
    iconName: 'ico-web',
  })
export class WebContentSectionComponent implements OnInit, OnDestroy {

    gridData: BundleStatus[];

    private _subHandler: SubscriptionHandler = new SubscriptionHandler();

    // Data binding
    public loading = false;


    commands: GridEditorCommandsConfig = [

        { 
            commandIcon: 'assets/img/icons.svg#ico-no',
            commandId: 'cmdDelete',
            title: 'Delete',
            hasConfirmation: true,
            confirmationTitle: 'Delete ?' 
        }
    ];


    constructor(private logger: NGXLogger,
        private notificationCenter: NotificationCenter,
        private elem: ElementRef,
        private webContentService: WebcontentService) {
            this.logger.debug(LOG_TAG , 'Opening...');
    }

    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG , 'Initializing...');
        this.refreshData();
    }

    ngOnDestroy() {
        this.logger.debug(LOG_TAG , 'ngOnDestroy ');
        this.freeMem();
    }

    freeMem() {
        this.gridData = null;
        this._subHandler.unsubscribe();
    }

    onRefreshClicked(): void {
        this.refreshData();
    }

    refreshData(){
        this.loading = true;
        this._subHandler.add(this.webContentService.getBundlesStatusList().subscribe( (data: BundleStatusList) => {
            this.logger.debug(LOG_TAG, 'Get bundle statuses results:', data);

            this.gridData = _.forEach(data, (element: BundleStatus) => {
                element.info["syntheticStatus"] = this.buildSyntheticStatus(element);
            });


            this.gridData = data;
            this.loading = false;
        }, (error) => {
            this.logger.error(LOG_TAG, 'Get bundle statuses failed: ', error);
            this.loading = false;

            this.notificationCenter.post({
                name: 'GetBundleStatusesError',
                title: 'Get Bundle Statuses',
                message: 'Error getting bundle statuses:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });
        }));
    }

    
    private buildSyntheticStatus(statusInfo: BundleStatus): string {
        let published: number = 0;  
        let unpusblished: number = 0;  
        for (let i=0;i<statusInfo.status.length;i++){
            const clusterStatus:ClusterBundleStatus = statusInfo.status[i];
            if (clusterStatus.status === PublishingStatus.Unpublished) {
                unpusblished++;
            }
            if (clusterStatus.status === PublishingStatus.Published) {
                published++;
            }
        }
        this.logger.debug(LOG_TAG, 'buildSyntheticStatus (published count vs unpublished count): ', published, unpusblished);
        if ((published===0) && (unpusblished > 0)) {
            return PublishingStatus.Unpublished;
        } else if ((unpusblished===0) && (published > 0)) {
            return PublishingStatus.Published;
        } else {
            return PublishingStatus.Error;
        }
    }
    

    private buildSyntheticStatusXXX(statusInfo: BundleStatus): string {
        return PublishingStatus.Error;
    }


}
