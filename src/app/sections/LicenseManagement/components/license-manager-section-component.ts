import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { PluginView } from 'web-console-core'
import { NGXLogger} from 'web-console-core'
import { WCToasterService } from 'web-console-ui-kit'
import { LicenseService,LicenseList, License } from '@wa-motif-open-api/license-management-service'
import * as _ from 'lodash';
import { RowClassArgs } from '@progress/kendo-angular-grid';

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

    private _licenses : LicenseList = [];
    private loading:boolean;

    constructor(private logger: NGXLogger, 
        private toaster: WCToasterService,
        private licenseManager: LicenseService){
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

    
}
