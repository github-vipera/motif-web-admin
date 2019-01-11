import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { NGXLogger } from 'web-console-core';
import * as _ from 'lodash';
import { fas, faCoffee, faAdjust, faBatteryHalf,
    faCircleNotch, faMobile, faMobileAlt, faDownload, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { AssetsService, AssetBundleEntity, AssetBundleUpdate } from '@wa-motif-open-api/app-content-service';
import { MobileApplicaton } from '../../../data/model';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { DataResult } from '@progress/kendo-data-query';
import { DomainSelectorComboBoxComponent } from '../../../../../components/UI/selectors/domain-selector-combobox-component';
import { EditService, EditServiceConfiguration } from '../../../../../components/Grid/edit.service';
import { Domain } from '@wa-motif-open-api/platform-service';
import { map } from 'rxjs/operators/map';
import { NotificationCenter, NotificationType } from '../../../../../components/Commons/notification-center';
import { ConfirmationDialogComponent } from '../../../../../components/ConfirmationDialog/confirmation-dialog-component';
import { FileDropPanelComponent } from '../../../../../components/UI/file-drop-panel-component';
import { saveAs } from '@progress/kendo-file-saver';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { SubscriptionHandler } from '../../../../../components/Commons/subscription-handler';


const LOG_TAG = '[AssetsAppContentSection]';

@Component({
    selector: 'wa-assets-appcontent-tab-component',
    styleUrls: ['./assets-appcontent-tab-component.scss'],
    templateUrl: './assets-appcontent-tab-component.html'
})
export class AssetsTabComponent implements OnInit, OnDestroy {

    faCloudUploadAlt = faCloudUploadAlt;
    faDownload = faDownload;
    faMobile = faMobile;
    faMobileAlt = faMobileAlt;
    faCoffee = faCoffee;
    faAdjust = faAdjust;
    faBatteryHalf = faBatteryHalf;
    faCircleNotch = faCircleNotch;
    fas = fas;

    public view: Observable<GridDataResult>;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 10
    };
    public changes: any = {};
    public editDataItem: MobileApplicaton;

    public gridView: DataResult;
    public loading: boolean;

    @ViewChild('domainSelector') domainSelector: DomainSelectorComboBoxComponent;
    @ViewChild('uploadAssetsSlideDown') uploadAssetsSlideDown: ElementRef;
    @ViewChild(ConfirmationDialogComponent) confirmationDialog: ConfirmationDialogComponent;
    @ViewChild('fileDrop') fileDrop: FileDropPanelComponent;

    private _editServiceConfig: EditServiceConfiguration = { idField: 'name', dirtyField: 'dirty', isNewField: 'isNew' };
    public editService: EditService;
    private _subHandler: SubscriptionHandler = new SubscriptionHandler();

    // Buttons
    public canRefresh = false;
    public canAddBundle = false;

    constructor(private logger: NGXLogger,
        private notificationCenter: NotificationCenter,
        private assetsService: AssetsService,
        private renderer2: Renderer2) {
        this.logger.debug(LOG_TAG, 'Opening...');
        this.editService = new EditService();
        this.editService.init();
        this.logger.debug(LOG_TAG, 'Opening...');
    }

    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG, 'Initializing...');
        this.view = this.editService.pipe(map(data => process(data, this.gridState)));
    }

    ngOnDestroy() {
        this.logger.debug(LOG_TAG , 'ngOnDestroy ');
        this.freeMem();
    }

    freeMem() {
        this.gridView = null;
        this.view = null;
        this._editServiceConfig = null;
        this.editService = null;
        this.editDataItem = null;
        this.changes = null;
        this.gridState = null;
        this.editDataItem = null;
        this._subHandler.unsubscribe();
        this._subHandler = null;
    }

    /**
     * Triggered by the grid component
     * @param state
     */
    public onStateChange(state: State) {
        this.gridState = state;
        this.logger.debug(LOG_TAG, 'onStateChange: ', state);
    }

    public onDomainSelected(domain: Domain) {
        if (domain) {
            this.loadData(domain);
            this.setOptions(true, true, true, true);
        } else {
            this.editService.read([], this._editServiceConfig);
            this.setOptions(false, false, true, false);
        }
    }

    public loadData(domain: Domain): void {
        this.loading = true;
        this._subHandler.add(this.assetsService.getAssets(this.domainSelector.selectedDomain.name).subscribe((data) => {
            this.logger.debug(LOG_TAG, 'Assets for domain=' + domain.name + ': ', data);

            data = _.forEach(data, function (element) {
                if (element.created) {
                    element.created = new Date(element.created);
                }
            });

            this.editService.cancelChanges();
            this.editService.read(data, this._editServiceConfig);
            this.loading = false;
        }, (error) => {
            this.logger.error(LOG_TAG, 'Load Assets for domain=' + domain.name + ' error: ', error);

            this.notificationCenter.post({
                name: 'GetAssestsError',
                title: 'Get Assets',
                message: 'Error getting assets:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });

            this.loading = false;
        }));

        this.setOptions(true, true, true, true);
    }

    /**
      * Enable or disable buttons
      * @param canSave
      * @param canRefresh
      * @param canExport
      * @param canAddBundle
      */
    private setOptions(canSave: boolean, canRefresh: boolean, canExport: boolean, canAddBundle: boolean): void {
        this.canRefresh = canRefresh;
        this.canAddBundle = canAddBundle;
    }

    /**
    * Button event
    */
    public onRefreshClicked(): void {
        if (this.editService.hasChanges()) {
            this.confirmationDialog.open('Pending Changes',
                // tslint:disable-next-line:max-line-length
                'Attention, in the configuration there are unsaved changes. Proceeding with the refresh these changes will be lost. Do you want to continue?',
                { 'action': 'refresh' });
        } else {
            this.refreshData();
        }
    }

    public refreshData() {
        if (this.domainSelector.selectedDomain) {
            this.loadData(this.domainSelector.selectedDomain);
        }
    }

    public onDeleteOKPressed(assetBundle: AssetBundleEntity) {
        this.logger.debug(LOG_TAG, 'onDeleteOKPressed for item: ', assetBundle);
        this.editService.remove(assetBundle);
    }

    public onAssetBundleAddConfirm(): void {
        if (this.fileDrop.file) {
            this.doUploadNewAssetBundle(this.fileDrop.file);
            this.slideDownUploadAssets(false);
            this.fileDrop.reset();
        }
    }

    public onAssetBundleAddCancel(): void {
        this.slideDownUploadAssets(false);
        this.fileDrop.reset();
    }

    onConfirmationCancel(event): void {
        // nop
    }

    /**
 * Event emitted by the confirmation dialog
 * @param userData
 */
    onConfirmationOK(userData): void {
        this.logger.debug(LOG_TAG, 'onConfirmationOK for:', userData);

        if (userData && userData.action === 'refresh') {
            this.refreshData();
        }
        if (userData && userData.action === 'discardChanges') {
            this.editService.cancelChanges();
        }
    }

    /**
     * Button event
     */
    onSaveClicked(): void {
        this.logger.debug(LOG_TAG, 'onSaveClicked');

        this._subHandler.add(this.saveAllChanges().subscribe((responses) => {
            this.refreshData();
            this.logger.debug(LOG_TAG, 'Bundles updated successfully: ', responses);

            this.notificationCenter.post({
                name: 'UpdateBundleSuccess',
                title: 'Update Bundle',
                message: 'The bundle list has been successfully updated.',
                type: NotificationType.Success
            });

        }, (error) => {
            this.logger.debug(LOG_TAG, 'Error saving bundles: ', error);

            this.notificationCenter.post({
                name: 'UpdateBundleError',
                title: 'Update Bundle',
                message: 'Error updating bundle list:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });

        }));

    }

    /**
 * Save all pending chenges remotely
 */
    private saveAllChanges(): Observable<any[]> {
        this.logger.debug(LOG_TAG, 'Saving all changes...');

        const itemsToRemove = this.editService.deletedItems;

        this.logger.debug(LOG_TAG, 'To remove:', itemsToRemove);

        const responses = [];
        let i = 0;

        // Remove deleted
        for (i = 0; i < itemsToRemove.length; i++) {
            const assetsToDelete = itemsToRemove[i];
            this.logger.debug(LOG_TAG, 'Removing assets: ', this.domainSelector.selectedDomain.name,
            assetsToDelete.name, assetsToDelete.version);
            // tslint:disable-next-line:max-line-length
            const response = this.assetsService.deleteAsset(this.domainSelector.selectedDomain.name,
                assetsToDelete.name, assetsToDelete.version);
            responses.push(response);
        }

        this.logger.debug(LOG_TAG, 'Waiting for all changes commit.');
        return forkJoin(responses);

    }

    /**
     * Button Event
     */
    onDiscardClicked(): void {
        if (this.editService.hasChanges()) {
            this.confirmationDialog.open('Pending Changes',
                // tslint:disable-next-line:max-line-length
                'Attention, in the configuration there are unsaved changes. Proceeding all these changes will be lost. Do you want to continue?',
                { 'action': 'discardChanges' });
        } else {
            this.refreshData();
        }
    }

    /**
 * Show the new App panel
 */
    onAddAssetsBundleClicked(): void {
        this.slideDownUploadAssets(true);
    }

    /**
     *
     * @param show Show/Hide the new Slide down panel
     */
    private slideDownUploadAssets(show: boolean): void {
        if (show) {
            this.renderer2.removeClass(this.uploadAssetsSlideDown.nativeElement, 'closed');
        } else {
            this.renderer2.addClass(this.uploadAssetsSlideDown.nativeElement, 'closed');
        }
    }

    doUploadNewAssetBundle(file: File): void {
        this.logger.debug(LOG_TAG, 'doUploadNewAssetBundle : ', file);
        const reader = new FileReader();
        reader.onloadend = (data) => {
            this.uploadAssetBundle(reader.result, file.name);
        };
        reader.onerror = (error) => {
            this.logger.error(LOG_TAG, 'doUploadNewAssetBundle error: ', error);
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

        this._subHandler.add(this.assetsService.uploadAsset(this.domainSelector.selectedDomain.name, file).subscribe((event) => {
            this.refreshData();
            this.logger.debug(LOG_TAG, 'Asset Bundle uploaded successfully: ', event);

            this.notificationCenter.post({
                name: 'UploadAssetBundleSuccess',
                title: 'Upload Asset Bundle',
                message: 'The asset bundle has been successfully uploaded.',
                type: NotificationType.Success
            });

        }, (error) => {
            this.logger.debug(LOG_TAG, 'Error uploading asset bundle: ', error);

            this.notificationCenter.post({
                name: 'UploadAssetBundleError',
                title: 'Upload Asset Bundle',
                message: 'Error uploading asset bundle:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });
        }));
    }

    onPublishClicked(dataItem) {
        this.logger.debug(LOG_TAG, 'onPublishClicked: ', dataItem);
        this.doPublishAssetsBundle(dataItem);
    }

    onDownloadClicked(dataItem) {
        this.doDownloadAssetsBundle(dataItem);
    }

    onDeleteCancelPressed (dataItem) {
        // nop
    }

    private doDownloadAssetsBundle(dataItem): void {
        this.logger.debug(LOG_TAG, 'doDownloadAssetsBundle: ', dataItem);

        this.notificationCenter.post({
            name: 'DownloadAssetBundleProgress',
            title: 'Download Asset Bundle',
            message: 'Downloading the assets bundle...',
            type: NotificationType.Info
        });

        this._subHandler.add(this.assetsService.downloadAsset(
            this.domainSelector.selectedDomain.name, dataItem.name, dataItem.version).subscribe((data) => {
            this.logger.debug(LOG_TAG, 'Asset downloaded successfully: ', data);

            const blob = new Blob([data], { type: 'application/zip' });

            const fileName = dataItem.name + '.zip';
            saveAs(blob, fileName);
            // FileSaver.saveAs(blob, fileName);
            this.logger.debug(LOG_TAG, 'Log saved: ', fileName);

            this.notificationCenter.post({
                name: 'DownloadAssetBundleSuccess',
                title: 'Download Asset Bundle',
                message: 'The asset bundle has been successfully downloaded.',
                type: NotificationType.Success
            });

        }, (error) => {

            this.logger.debug(LOG_TAG, 'Error downloading asset bundle: ', error);

            this.notificationCenter.post({
                name: 'DownloadAssetBundleError',
                title: 'Download Asset Bundle',
                message: 'Error downloading asset bundle:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });

        }));
    }

    private doPublishAssetsBundle(dataItem): void {
        this.logger.debug(LOG_TAG, 'doPublishAssetsBundle: ', dataItem);

        this.notificationCenter.post({
            name: 'PublishAssetBundleProgress',
            title: 'Publish Asset Bundle',
            message: 'Publishing the assets bundle...',
            type: NotificationType.Info
        });

        const bundleUpdate: AssetBundleUpdate = {
            published: !dataItem.published
        };

        this._subHandler.add(this.assetsService.updateAsset(this.domainSelector.selectedDomain.name,
             dataItem.name, dataItem.version, bundleUpdate).subscribe((data) => {
            this.logger.debug(LOG_TAG, 'Asset published successfully: ', data);

            this.refreshData();

            this.notificationCenter.post({
                name: 'PublishAssetBundleSuccess',
                title: 'Publish Asset Bundle',
                message: 'The asset bundle has been successfully published.',
                type: NotificationType.Success
            });

        }, (error) => {

            this.logger.debug(LOG_TAG, 'Error publishing asset bundle: ', error);

            this.notificationCenter.post({
                name: 'PublishAssetBundleError',
                title: 'Publish Asset Bundle',
                message: 'Error publishing asset bundle:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });

        }));
    }
}
