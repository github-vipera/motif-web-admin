import { FileDropPanelComponent } from './../../../components/UI/file-drop-panel-component';
import { ConfirmationTitleProvider, GridEditorCommandComponentEvent } from './../../../components/Grid/grid-editor-command/grid-editor-command-component';
import { GridEditorCommandsConfig } from './../../../components/Grid/grid-editor-commands-group/grid-editor-commands-group-component';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { PluginView } from 'web-console-core';
import { NGXLogger} from 'web-console-core';
import { NotificationCenter, NotificationType } from '../../../components/Commons/notification-center';
import { WebcontentService, BundleStatusList, BundleStatus, ClusterBundleStatus } from '@wa-motif-open-api/web-content-service';
import { SubscriptionHandler } from 'src/app/components/Commons/subscription-handler';
import * as _ from 'lodash';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { WCSlidePanelComponent } from 'src/app/components/UI/slide-panel/slide-panel-component';
import { WebContentUpdateDialogComponent } from './dialog/webcontent-update-dialog';

const LOG_TAG = '[WebContentSectionComponent]';

export enum PublishingStatus {
    Published = 'PUBLISHED',
    Unpublished = 'UNPUBLISHED',
    Error = 'IN ERROR'
}

enum CommandType {
    Edit = 'cmdEdit',
    Download = 'cmdDowload',
    Delete = 'cmdDelete',
    Publish = 'cmdPublish'
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

    faUpload = faUpload;
    gridData: BundleStatus[];

    private _subHandler: SubscriptionHandler = new SubscriptionHandler();
    @ViewChild('fileDrop') fileDrop: FileDropPanelComponent;
    @ViewChild('uploadSlideDownPanel') _uploadSlideDownPanel: WCSlidePanelComponent;
    @ViewChild('updateDialog') _updateDialog: WebContentUpdateDialogComponent;

    // Data binding
    public loading = false;

    publishConfirmationTitleProvider: ConfirmationTitleProvider = {
        getTitle(rowData): string {
            if (rowData.info.syntheticStatus === PublishingStatus.Published){
                return "Unpublish ?";
            } else if (rowData.info.syntheticStatus === PublishingStatus.Error){
                return "Unpublish ?";
            } else {
                return "Publish ?";
            }
        }
    }


    commands: GridEditorCommandsConfig = [
        { 
            commandIcon: 'assets/img/icons.svg#ico-edit',
            commandId: CommandType.Edit,
            title: 'Edit'
        },
        { 
            commandIcon: 'assets/img/icons.svg#ico-download',
            commandId: CommandType.Download,
            title: 'Download'
        },
        { 
            commandIcon: 'assets/img/icons.svg#ico-no',
            commandId: CommandType.Delete,
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
        return PublishingStatus.Unpublished;
    }

    doTogglePublishBundle(item: BundleStatus):void {
        this.logger.debug(LOG_TAG, 'doTogglePublishBundle: ', item);
        alert("TODO!! doTogglePublishBundle")
    }

    doDownloadBundle(item: BundleStatus):void {

        this.notificationCenter.post({
            name: 'DownloadBundleProgress',
            title: 'Download Bundle',
            message: 'Downloading bundle...',
            type: NotificationType.Info
        });

        this.logger.debug(LOG_TAG, 'doDownloadBundle: ', item);
        this._subHandler.add(this.webContentService.downloadBundle(item.info.name, item.info.version).subscribe( (data :Blob)=> {

            this.logger.debug(LOG_TAG, 'Bundle downloaded successfully: ', data);

            const blob = new Blob([data], { type: 'application/zip' });

            const fileName = item.info.name + '_' + item.info.version + '.zip';
            saveAs(blob, fileName);
            // FileSaver.saveAs(blob, fileName);
            this.logger.debug(LOG_TAG, 'Bundle saved: ', fileName);


        }, (error)=>{

            this.logger.error(LOG_TAG, 'Download Bundle failed: ', error);
            this.loading = false;

            this.notificationCenter.post({
                name: 'DownloadBundleError',
                title: 'Download Bundle',
                message: 'Error downloading bundle:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });
        }));
    }

    doDeleteBundle(item: BundleStatus):void {
        this.logger.debug(LOG_TAG, 'doDeleteBundle: ', item);
        alert("TODO!! doDeleteBundle")
    }

    onCommandConfirm(event: GridEditorCommandComponentEvent) {
        this.logger.debug(LOG_TAG, 'onCommandConfirm event: ', event);
        if (event.id===CommandType.Publish){
            this.doTogglePublishBundle(event.rowData.dataItem);
        }
        else if (event.id===CommandType.Delete){
            this.doDeleteBundle(event.rowData.dataItem);
        }
    }

    onCommandClick(event: GridEditorCommandComponentEvent){
        this.logger.debug(LOG_TAG, 'onCommandClick event: ', event);
        if (event.id===CommandType.Download){
            this.doDownloadBundle(event.rowData.dataItem);
        }
        else if (event.id===CommandType.Delete){
            this.doDeleteBundle(event.rowData.dataItem);
        } else if (event.id===CommandType.Edit){
                this._updateDialog.show('domain', 'app', 'context');
        }
    }

    onUploadBundleClicked(): void {
        this._uploadSlideDownPanel.toggle();
    }

    onBundleUploadCancel(): void {
        this._uploadSlideDownPanel.show(false);
    }

    onBundleUploadConfirm(): void {
        if (this.fileDrop.file) {
            this.doUploadNewBundle(this.fileDrop.file);
            this._uploadSlideDownPanel.show(false);
            this.fileDrop.reset();
        }
    }

    onSlideEditorClose():void {
        if (this.fileDrop.file) {
            this.fileDrop.reset();
        }
    }


    doUploadNewBundle(file: File): void {
        this.logger.debug(LOG_TAG, 'doUploadNewBundle : ', file);
        const reader = new FileReader();
        reader.onloadend = (data) => {
            this.uploadAssetBundle(reader.result as ArrayBuffer, file.name);
        };
        reader.onerror = (error) => {
            this.logger.error(LOG_TAG, 'doUploadNewBundle error: ', error);
            this.notificationCenter.post({
                name: 'ReadingAssetBundleError',
                title: 'Asset Bundle Upload',
                message: 'Error reading asset bundle file:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });
        };
        reader.readAsArrayBuffer(file);
    }

    uploadAssetBundle(blob: ArrayBuffer, fileName: string): void {
        this.logger.debug(LOG_TAG, 'uploadAssetBundle : ', blob);

        const file =  new File([blob], fileName);

        this.notificationCenter.post({
            name: 'UploadAssetBundleProgress',
            title: 'Upload Asset Bundle',
            message: 'Uploading the asset bundle...',
            type: NotificationType.Info
        });

        this._subHandler.add(this.webContentService.uploadBundle(file).subscribe((event) => {
            this.refreshData();
            this.logger.debug(LOG_TAG, 'Bundle uploaded successfully: ', event);

            this.notificationCenter.post({
                name: 'UploadBundleSuccess',
                title: 'Upload Bundle',
                message: 'The bundle has been successfully uploaded.',
                type: NotificationType.Success
            });

        }, (error) => {
            this.logger.debug(LOG_TAG, 'Error uploading bundle: ', error);

            this.notificationCenter.post({
                name: 'UploadBundleError',
                title: 'Upload Bundle',
                message: 'Error uploading bundle:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });
        }));
    }

}
