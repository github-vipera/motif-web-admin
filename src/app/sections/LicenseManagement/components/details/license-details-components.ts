import { NGXLogger} from 'web-console-core'
import { Component, OnInit, Input } from '@angular/core';
import { WCGridConfiguration, WCGridColumnType, WCToasterService } from 'web-console-ui-kit'
import { DataResult } from '@progress/kendo-data-query';
import { WCOverlayPaneService } from 'web-console-ui-kit'
import { Oauth2Service, AccessTokenList, RefreshToken } from '@wa-motif-open-api/oauth2-service'
import { License } from '@wa-motif-open-api/license-management-service';
import { ClipboardService } from 'ngx-clipboard'

const LOG_TAG = "[OAuth2Section] [RefreshTokenDetailsComponent]";
const REFRESH_TOKENS_LIST_ENDPOINT = "/oauth2/refreshTokens/{0}/accessTokens"

@Component({
  selector: 'wa-license-details',
  styleUrls: [ './license-details-components.scss' ],
  templateUrl: './license-details-components.html'
})
export class LicenseDetailsComponent implements OnInit {

  @Input() licenseItem : License;

  constructor(private logger: NGXLogger,
    private toaster: WCToasterService, 
    private overlayPaneService: WCOverlayPaneService,
    private clipboardService: ClipboardService) {
  }

  ngOnInit() {
  }

  private copyToClipboard():void {
    let output = "Product Name=" +this.licenseItem.productName + "\n";
    output += "Version=" +this.licenseItem.productVersion + "\n";
    output += "Customer=" + this.licenseItem.customerName + "\n";
    output += "Email=" +this.licenseItem.customerEmail + "\n";
    output += "Issued=" + new Date(this.licenseItem.issueDate) + "\n";
    output += "Expiry=" + new Date(this.licenseItem.expiryDate) + "\n";
    output += "License Key=" + this.licenseItem.license;
    this.clipboardService.copyFromContent(output);
    this.showInfo("License Info", "The license information has been copied to the clipboard");
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
