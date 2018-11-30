import { NGXLogger} from 'web-console-core'
import { Component, OnInit, Input } from '@angular/core';
import { WCGridConfiguration, WCGridColumnType, WCToasterService } from 'web-console-ui-kit'
import { DataResult } from '@progress/kendo-data-query';
import { WCOverlayPaneService } from 'web-console-ui-kit'
import { Oauth2Service, AccessTokenList, RefreshToken } from '@wa-motif-open-api/oauth2-service'
import { License } from '@wa-motif-open-api/license-management-service';

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
    private overlayPaneService: WCOverlayPaneService) {
  }

  ngOnInit() {
  }

}
