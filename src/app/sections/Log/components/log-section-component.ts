import { Component, OnInit, ViewChild, Renderer, ElementRef} from '@angular/core';
import { PluginView } from 'web-console-core'
import { NGXLogger} from 'web-console-core'
import { WCToasterService } from 'web-console-ui-kit'
import { LogService } from '@wa-motif-open-api/log-service'
import * as _ from 'lodash';
import { ClipboardService } from 'ngx-clipboard'

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
    
    public tailLines:string;
    public linesCount:number;

    @ViewChild('logPane') logPane:ElementRef;

    constructor(private logger: NGXLogger, 
        private toaster: WCToasterService,
        private logService: LogService,
        private renderer:Renderer,
        private clipboardService: ClipboardService){
        this.logger.debug(LOG_TAG ,"Opening...");
    } 
    
    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG ,"Initializing...");
        this.tailLines = ""
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

    public onRefreshClicked():void {
        this.logService.tailCurrentLog(100).subscribe((logTail:LogTail)=>{
            //this.logger.debug(LOG_TAG ,"tailCurrentLog :", logTail);
            //this.logger.debug(LOG_TAG ,"tailCurrentLog string:", logTail.data);
            this.tailLines = logTail.data;
            this.linesCount = logTail.lines;
        }, (error)=>{
            this.logger.error(LOG_TAG ,"tailCurrentLog error:", error);
        });
    }

    public onCopyToClipboardClicked():void {
        this.clipboardService.copyFromContent(this.tailLines);
        this.showInfo("Log Tail", "The current displayed log has been copied to the clipboard");
    }

}
