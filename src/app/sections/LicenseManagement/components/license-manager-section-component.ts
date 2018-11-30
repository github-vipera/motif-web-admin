import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { PluginView } from 'web-console-core'
import { NGXLogger} from 'web-console-core'
import { WCToasterService } from 'web-console-ui-kit'


const LOG_TAG = "[SessionsSection]";

@Component({
    selector: 'wa-license-manager-section',
    styleUrls: [ './license-manager-section-component.scss' ],
    templateUrl: './license-manager-section-component.html'
  })
  @PluginView("License Manager",{
    iconName: "ico-key" 
})
export class LicenseManagerSectionComponent implements OnInit {

    constructor(private logger: NGXLogger, 
        private toaster: WCToasterService){
        this.logger.debug(LOG_TAG ,"Opening...");
    } 
    
    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG ,"Initializing...");
    }

}
