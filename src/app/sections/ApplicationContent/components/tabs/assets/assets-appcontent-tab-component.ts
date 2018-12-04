import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { PluginView } from 'web-console-core'
import { NGXLogger} from 'web-console-core'
import { WCToasterService } from 'web-console-ui-kit'
import * as _ from 'lodash';
import { fas, faCoffee, faAdjust, faBatteryHalf, faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const LOG_TAG = "[AssetsAppContentSection]";

@Component({
    selector: 'wa-assets-appcontent-tab-component',
    styleUrls: [ './assets-appcontent-tab-component.scss' ],
    templateUrl: './assets-appcontent-tab-component.html'
  })
export class AssetsTabComponent implements OnInit {

    faCoffee = faCoffee;
    faAdjust = faAdjust;
    faBatteryHalf = faBatteryHalf;
    faCircleNotch = faCircleNotch;
    fas = fas;

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
