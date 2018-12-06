import { Component, OnInit, ViewChild, Renderer, ElementRef} from '@angular/core';
import { PluginView } from 'web-console-core'
import { NGXLogger} from 'web-console-core'
import { LicenseService,LicenseList, License } from '@wa-motif-open-api/license-management-service'
import * as _ from 'lodash';
import { ToasterUtilsService } from '../../../components/UI/toaster-utils-service'
import { faFileImport, faDownload } from '@fortawesome/free-solid-svg-icons'
import { ErrorMessageBuilderService } from '../../../components/Commons/error-message-builder-service'

const LOG_TAG = "[LicenseManagerSection]";

@Component({
    selector: 'wa-license-manager-section',
    styleUrls: [ './license-manager-section-component.scss' ],
    templateUrl: './license-manager-section-component.html'
  })
  @PluginView("License Manager",{
    iconName: "ico-key" 
})
export class LicenseManagerSectionComponent implements OnInit {
    
    faFileImport = faFileImport;
    faDownload = faDownload;
    
    public _licenses : LicenseList = [];
    public loading:boolean;
    @ViewChild('xmlFileImport') xmlFileImportEl : ElementRef;

    constructor(private logger: NGXLogger, 
        private toasterService: ToasterUtilsService,
        private licenseManager: LicenseService,
        private renderer:Renderer,
        private errorMessageBuilderService:ErrorMessageBuilderService){
        this.logger.debug(LOG_TAG ,"Opening...");
    } 
    
    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG ,"Initializing...");
        this.refreshData();
    }

    public refreshData():void {
        this.loading = true;
        this.licenseManager.listLicenses().subscribe((data)=>{
            this._licenses = data;

            this._licenses = _.forEach(data, function(element) {
                element.issueDate = new Date(element.issueDate);
                element.expiryDate = new Date(element.expiryDate);
              });


            this.logger.debug(LOG_TAG ,"Licenses: ", data);
            this.loading = false;

        }, (error=>{
            this.logger.error(LOG_TAG ,"Licenses error: ", error);
            this.loading = false;
            this.toasterService.showError("Load Licenses", "Error loading licenses: "+ this.errorMessageBuilderService.buildErrorMessage(error));
        }))
    }
    
    public onRefreshClicked():void{
        this.refreshData();
    }

    public onDeleteOKPressed(license:License):void {
        this.logger.debug(LOG_TAG ,"Revoking license: ", license);
        this.licenseManager.deleteLicense(license.productName, license.productVersion).subscribe((data)=>{
            this.logger.info(LOG_TAG ,"License revoke success:", data);
            this.toasterService.showInfo("Revoke License", "The license has been successfully revoked");
            this.refreshData();
          }, (error)=>{
            this.logger.error(LOG_TAG,"Revoking license error:", error);
            this.toasterService.showError("Revoke License", "Revoking license error: " + this.errorMessageBuilderService.buildErrorMessage(error));
        });
    }

    /**     
     * Button event
     */
    onImportClicked():void {
        this.logger.debug(LOG_TAG ,"Import clicked:", this.xmlFileImportEl);
        //trigger mouse click
        let event = new MouseEvent('click', {bubbles: true});
        this.renderer.invokeElementMethod(
        this.xmlFileImportEl.nativeElement, 'dispatchEvent', [event]);
    }

    /**
     * Triggered by the input tag
     * @param event 
     */
    onUploadFileSelected(event):void {
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
          let file = event.target.files[0];
          reader.onloadend = () => {
              this.uploadLicense(reader.result);
          };
          reader.onerror = (error) => {
            this.logger.error(LOG_TAG ,"onUploadFileSelected error: ", error);
            this.toasterService.showError("Configuration Upload", "Error reading configuration file: " + this.errorMessageBuilderService.buildErrorMessage(error));
          };
          reader.readAsText(file);
        }
    }

    /**
     * Upload the blob file to server
     * @param blob 
     */
    uploadLicense(blob):void {
        this.toasterService.showInfo("Configuration Upload", "Uploading configuration...");
        this.licenseManager.uploadLicense(blob).subscribe((data)=>{
            this.logger.info(LOG_TAG ,"Import license done:", data);
            this.toasterService.showInfo("License Upload", "Upload license done successfully.");
            this.refreshData();
          }, (error)=>{
            this.logger.error(LOG_TAG,"Import license error:", error);
            this.toasterService.showError("License Upload", "Upload license error: " + this.errorMessageBuilderService.buildErrorMessage(error));
        });
    }
}
