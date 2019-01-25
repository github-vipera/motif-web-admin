import { FileDropPanelComponent } from './../../../components/UI/file-drop-panel-component';
import { Component, OnInit, ViewChild, Renderer, ElementRef, OnDestroy } from '@angular/core';
import { PluginView } from 'web-console-core';
import { NGXLogger} from 'web-console-core';
import { LicenseService, LicenseList, License } from '@wa-motif-open-api/license-management-service';
import * as _ from 'lodash';
import { faFileImport, faDownload } from '@fortawesome/free-solid-svg-icons';
import { NotificationCenter, NotificationType } from '../../../components/Commons/notification-center';
import { SubscriptionHandler } from '../../../components/Commons/subscription-handler';
import { WCSlidePanelComponent } from 'src/app/components/UI/slide-panel/slide-panel-component';

const LOG_TAG = '[LicenseManagerSection]';

@Component({
    selector: 'wa-license-manager-section',
    styleUrls: [ './license-manager-section-component.scss' ],
    templateUrl: './license-manager-section-component.html'
  })
  @PluginView('License Manager', {
    iconName: 'ico-key'
})
export class LicenseManagerSectionComponent implements OnInit, OnDestroy {

    faFileImport = faFileImport;
    faDownload = faDownload;

    public _licenses: LicenseList = [];
    public loading: boolean;
    @ViewChild('xmlFileImport') xmlFileImportEl: ElementRef;
    @ViewChild('uploadSlideDownPanel') _uploadSlideDownPanel: WCSlidePanelComponent;
    @ViewChild('fileDrop') fileDrop: FileDropPanelComponent;


    private _subHandler: SubscriptionHandler = new SubscriptionHandler();

    constructor(private logger: NGXLogger,
        private licenseManager: LicenseService,
        private renderer: Renderer,
        private notificationCenter: NotificationCenter) {
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
        this._licenses = null;
        this._subHandler.unsubscribe();
        this._subHandler = null;
    }

    public refreshData(): void {
        this.loading = true;
        this._subHandler.add(this.licenseManager.listLicenses().subscribe((data) => {
            this._licenses = data;

            this._licenses = _.forEach(data, function(element) {
                element.issueDate = new Date(element.issueDate);
                element.expiryDate = new Date(element.expiryDate);
              });


            this.logger.debug(LOG_TAG , 'Licenses: ', data);
            this.loading = false;

        }, (error => {
            this.logger.error(LOG_TAG , 'Licenses error: ', error);
            this.loading = false;
            this.notificationCenter.post({
                name: 'LoadLicenseError',
                title: 'Load Licenses',
                message: 'Error loading licenses:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });
        })));
    }

    public onRefreshClicked(): void {
        this.refreshData();
    }

    public onDeleteOKPressed(license: License): void {
        this.deleteLicense(license);
    }

    private deleteLicense(license: License): void {
        this.logger.debug(LOG_TAG , 'Revoking license: ', license);
        this._subHandler.add(this.licenseManager.deleteLicense(license.productName, license.productVersion).subscribe((data) => {
            this.logger.info(LOG_TAG , 'License revoke success:', data);
            this.notificationCenter.post({
                name: 'RevokeLicenseSuccess',
                title: 'Revoke License',
                message: 'The license has been successfully revoked',
                type: NotificationType.Success
            });

            this.refreshData();
          }, (error) => {
            this.logger.error(LOG_TAG, 'Revoking license error:', error);
            this.notificationCenter.post({
                name: 'RevokeLicenseError',
                title: 'Revoke License',
                message: 'Error revoking license:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });

        }));
    }

    /**
     * Button event
     */
    onImportClicked(event): void {
        this.logger.debug(LOG_TAG , 'Import clicked');
        this._uploadSlideDownPanel.toggle();
    }

    onSlideEditorClose():void {
        if (this.fileDrop.file) {
            this.fileDrop.reset();
        }
    }

    onLicenseUploadCancel(): void {
        this._uploadSlideDownPanel.show(false);
    }

    onLicenseUploadConfirm(): void {
        if (this.fileDrop.file) {
            this.onUploadFileSelected(this.fileDrop.file);
            this._uploadSlideDownPanel.show(false);
            this.fileDrop.reset();
        }
    }

    /**
     * Triggered by the input tag
     * @param event
     */
    onUploadFileSelected(file: File): void {
        this.logger.debug(LOG_TAG , 'onUploadFileSelected:', event);
        const reader = new FileReader();
          reader.onloadend = () => {
            this.logger.debug(LOG_TAG , 'onloadend');
            this.uploadLicense(reader.result);
          };

          reader.onerror = (error) => {
            this.logger.error(LOG_TAG , 'onUploadFileSelected error: ', error);
            this.notificationCenter.post({
                name: 'UploadLicenseError',
                title: 'License Upload',
                message: 'Error uploading licenses:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });
          };

          this.logger.debug(LOG_TAG , 'readAsText: ', file);
          reader.readAsText(file);
          // reset current input value
          this.xmlFileImportEl.nativeElement.value = null;
    }

    /**
     * Upload the blob file to server
     * @param blob
     */
    uploadLicense(blob): void {
        this.logger.debug(LOG_TAG , 'uploadLicense called');
        this.notificationCenter.post({
            name: 'UploadLicense',
            title: 'License Upload',
            message: 'Uploading license...',
            type: NotificationType.Info
        });
        this._subHandler.add(this.licenseManager.uploadLicense(blob).subscribe((data) => {
            this.logger.info(LOG_TAG , 'Import license done:', data);
            this.notificationCenter.post({
                name: 'UploadLicense',
                title: 'License Upload',
                message: 'License Uploaded successfully.',
                type: NotificationType.Success
            });
            this.refreshData();
          }, (error) => {
            this.logger.error(LOG_TAG, 'Import license error:', error);
            this.notificationCenter.post({
                name: 'UploadLicenseError',
                title: 'License Upload',
                message: 'Error uploading licenses:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });
        }));
    }
}
