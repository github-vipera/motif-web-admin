import { Component, OnInit, ViewChild, Renderer, ElementRef} from '@angular/core';
import { PluginView } from 'web-console-core'
import { NGXLogger} from 'web-console-core'
import { WCToasterService } from 'web-console-ui-kit'
import { LicenseService,LicenseList, License } from '@wa-motif-open-api/license-management-service'
import * as _ from 'lodash';
import { RowClassArgs } from '@progress/kendo-angular-grid';

const LOG_TAG = "[LogSection]";

@Component({
    selector: 'wa-log-section',
    styleUrls: [ './log-section-component.scss' ],
    templateUrl: './log-section-component.html'
  })
  @PluginView("Log",{
    iconName: "ico-log" 
})
export class LogSectionComponent implements OnInit {

    private _licenses : LicenseList = [];
    private loading:boolean;
    @ViewChild('xmlFileImport') xmlFileImportEl : ElementRef;

    constructor(private logger: NGXLogger, 
        private toaster: WCToasterService,
        private licenseManager: LicenseService,
        private renderer:Renderer){
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
        }))
    }
    
    private onRefreshClicked():void{
        this.refreshData();
    }

    public onDeleteOKPressed(license:License):void {
        this.logger.debug(LOG_TAG ,"Revoking license: ", license);
        this.licenseManager._delete(license.productName, license.productVersion).subscribe((data)=>{
            this.logger.info(LOG_TAG ,"License revoke success:", data);
            this.showInfo("Revoke License", "The license has been successfully revoked");
            this.refreshData();
          }, (error)=>{
            this.logger.error(LOG_TAG,"Revoking license error:", error);
            this.showError("Revoke License", "Revoking license error: " + error.error.Code + "\n" + error.error.Details);
        });
    }

    /**
     * Show Info Toast
     * @param title 
     * @param message 
     */
    private showInfo(title:string, message:string):void {
        this.toaster.info(message, title, {
            positionClass: 'toast-top-center'
        });
    }

    /**
     * Show Error Toast
     * @param title 
     * @param message 
     */
    private showError(title:string, message:string):void {
        this.toaster.error(message, title, {
            positionClass: 'toast-top-center'
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
            this.showError("Configuration Upload", "Error reading configuration file: " + error);
          };
          reader.readAsText(file);
        }
    }

    /**
     * Upload the blob file to server
     * @param blob 
     */
    uploadLicense(blob):void {
        this.showInfo("Configuration Upload", "Uploading configuration...");
        this.licenseManager.upload(blob).subscribe((data)=>{
            this.logger.info(LOG_TAG ,"Import license done:", data);
            this.showInfo("License Upload", "Upload license done successfully.");
            this.refreshData();
          }, (error)=>{
            this.logger.error(LOG_TAG,"Import license error:", error);
            this.showError("License Upload", "Upload license error: " + error.error.Code + "\n" + error.error.Details);
        });
    }
}
