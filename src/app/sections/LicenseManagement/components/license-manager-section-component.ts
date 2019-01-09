import { Component, OnInit, ViewChild, Renderer, ElementRef} from '@angular/core';
import { PluginView } from 'web-console-core';
import { NGXLogger} from 'web-console-core';
import { LicenseService, LicenseList, License } from '@wa-motif-open-api/license-management-service';
import * as _ from 'lodash';
import { faFileImport, faDownload } from '@fortawesome/free-solid-svg-icons';
import { NotificationCenter, NotificationType } from '../../../components/Commons/notification-center';

const LOG_TAG = '[LicenseManagerSection]';

@Component({
    selector: 'wa-license-manager-section',
    styleUrls: [ './license-manager-section-component.scss' ],
    templateUrl: './license-manager-section-component.html'
  })
  @PluginView('License Manager', {
    iconName: 'ico-key'
})
export class LicenseManagerSectionComponent implements OnInit {

    faFileImport = faFileImport;
    faDownload = faDownload;

    public _licenses: LicenseList = [];
    public loading: boolean;
    @ViewChild('xmlFileImport') xmlFileImportEl: ElementRef;

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

    public refreshData(): void {
        this.loading = true;
        this.licenseManager.listLicenses().subscribe((data) => {
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
        }));
    }

    public onRefreshClicked(): void {
        this.refreshData();
    }

    public onDeleteOKPressed(license: License): void {
        this.deleteLicense(license);
    }

    private deleteLicense(license: License): void {
        this.logger.debug(LOG_TAG , 'Revoking license: ', license);
        this.licenseManager.deleteLicense(license.productName, license.productVersion).subscribe((data) => {
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

        });
    }

    /**
     * Button event
     */
    onImportClicked(event): void {
        this.logger.debug(LOG_TAG , 'Import clicked:', this.xmlFileImportEl);
        // trigger mouse click
        // const event = new MouseEvent('click', { bubbles: true });
        // this.xmlFileImportEl.nativeElement.dispatchEvent(event);
        this.xmlFileImportEl.nativeElement.click();
    }

    /**
     * Triggered by the input tag
     * @param event
     */
    onUploadFileSelected(event): void {
        this.logger.debug(LOG_TAG , 'onUploadFileSelected:', event);
        const reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
          const file = event.target.files[0];

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
        this.licenseManager.uploadLicense(blob).subscribe((data) => {
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
        });
    }
}
