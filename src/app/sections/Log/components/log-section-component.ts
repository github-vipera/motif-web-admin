import { Component, OnInit, ViewChild, Renderer, ElementRef, Renderer2} from '@angular/core';
import { PluginView } from 'web-console-core'
import { NGXLogger} from 'web-console-core'
import { WCToasterService } from 'web-console-ui-kit'
import { LogService, LogLevel, LogTail } from '@wa-motif-open-api/log-service'
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
    public linesCount:number = 100;
    public currentTailLinesCount:number;
    public logLevels:LogLevel[];    
    private _rootLogLevel:LogLevel;
    public dataRecordTypes:string[] = [ "TRANSACTION", "DIAGNOSTIC", "PERFORMANCE", "SUBSCRIBER", "THRESHOLD", "SECURITY"];
    public dataRecordType:string;
    public range = { start: null, end: null };

    @ViewChild('logPane') logPane:ElementRef;
    @ViewChild('exportSlideDown') exportSlideDown:ElementRef;

    constructor(private logger: NGXLogger, 
        private toaster: WCToasterService,
        private logService: LogService,
        private renderer:Renderer2,
        private clipboardService: ClipboardService){
        this.logger.debug(LOG_TAG ,"Opening...");
        
        this.logLevels = [];
        this.logLevels.push({level:"ERROR"})
        this.logLevels.push({level:"WARN"})
        this.logLevels.push({level:"INFO"})
        this.logLevels.push({level:"DEBUG"})
        this.logLevels.push({level:"TRACE"})
    } 
    
    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG ,"Initializing...");
        this.tailLines = ""
        this.refreshData();
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
        this.logger.debug(LOG_TAG ,"linesCount :", this.linesCount);
        this.logService.tailCurrentLog(this.linesCount).subscribe((logTail:LogTail)=>{
            //this.logger.debug(LOG_TAG ,"tailCurrentLog :", logTail);
            //this.logger.debug(LOG_TAG ,"tailCurrentLog string:", logTail.data);
            this.tailLines = logTail.data;
            this.currentTailLinesCount = logTail.lines;
        }, (error)=>{
            this.logger.error(LOG_TAG ,"tailCurrentLog error:", error);
        });
    }

    public onCopyToClipboardClicked():void {
        this.clipboardService.copyFromContent(this.tailLines);
        this.showInfo("Log Tail", "The current displayed log has been copied to the clipboard");
    }

    public set rootLogLevel(logLevel:LogLevel){
        if (logLevel){
            this._rootLogLevel = logLevel;
            this.logger.debug(LOG_TAG ,"Changing ROOT log level :", logLevel);
            this.logService.setRootLogLevel(this._rootLogLevel).subscribe((data)=>{
                this.logger.debug(LOG_TAG ,"Changed ROOT log level :", data);
                this.showInfo("Log Management", "The ROOT Log Level has been changed to " + logLevel.level);
            }, (error)=>{
                this.showError("Log Management", "Error chaning ROOT Log Level: " + error.error);
            })
        }
    }

    public get rootLogLevel():LogLevel{
        return this._rootLogLevel;
    }

    public refreshData(){
        this.logService.getRootLogLevel().subscribe((data:LogLevel)=>{
            this.logger.debug(LOG_TAG ,"Getting ROOT log level :", data);
            this._rootLogLevel = data;
        }, (error)=>{
            this.logger.error(LOG_TAG ,"Error Getting ROOT log level :", error);
        })
    }

    public onDownloadClicked():void {
        this.showInfo("Log Management", "Download not yet implemented.");
        //TODO!!
    }

    public onExportClicked():void {
        //this.renderer.removeClass(this.exportSlideDown.nativeElement, 'closed');
        this.slideDownExportPanel(true);
    }

    public onExportConfirm():void{
        this.slideDownExportPanel(false);
        //TODO!!
    }

    public onExportCancel():void{
        this.slideDownExportPanel(false);
    }

    private slideDownExportPanel(show:boolean):void {
        if (show){
            this.renderer.removeClass(this.exportSlideDown.nativeElement, 'closed');
        } else {
            this.renderer.addClass(this.exportSlideDown.nativeElement, 'closed');
        } 
    }

}
