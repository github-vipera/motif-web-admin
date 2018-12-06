import { Component, OnInit, ViewChild, Renderer, ElementRef, Renderer2} from '@angular/core';
import { PluginView } from 'web-console-core'
import { NGXLogger} from 'web-console-core'
import { LogService, LogLevel, LogTail } from '@wa-motif-open-api/log-service'
import * as _ from 'lodash';
import { ClipboardService } from 'ngx-clipboard'
import * as FileSaver from 'file-saver'
import { faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons';
import { faFileImport, faDownload, faCopy, faPaste } from '@fortawesome/free-solid-svg-icons'
import { NotificationCenter, NotificationType } from '../../../components/Commons/notification-center'

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

    faFileImport = faFileImport;
    faDownload = faDownload;
    faExternalLinkSquareAlt = faExternalLinkSquareAlt;
    faCopy = faCopy;
    faPaste = faPaste;

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
        private notificationCenter: NotificationCenter,
        private logService: LogService,
        private renderer2:Renderer2,
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

    public onRefreshClicked():void {
        this.logger.debug(LOG_TAG ,"linesCount :", this.linesCount);
        this.logService.tailCurrentLog(this.linesCount).subscribe((logTail:LogTail)=>{
            this.tailLines = logTail.data;
            this.currentTailLinesCount = logTail.lines;
        }, (error)=>{
            this.logger.error(LOG_TAG ,"tailCurrentLog error:", error);
        });
    }

    public onCopyToClipboardClicked():void {
        this.clipboardService.copyFromContent(this.tailLines);

        this.notificationCenter.post({
            name:"LogTailCopy",
            title: "Log tail Copy",
            message: "The current displayed log has been copied to the clipboard.",
            type: NotificationType.Info
        });

    }

    public set rootLogLevel(logLevel:LogLevel){
        if (logLevel){
            this._rootLogLevel = logLevel;
            this.logger.debug(LOG_TAG ,"Changing ROOT log level :", logLevel);
            this.logService.setRootLogLevel(this._rootLogLevel).subscribe((data)=>{
                this.logger.debug(LOG_TAG ,"Changed ROOT log level :", data);
               
                this.notificationCenter.post({
                    name:"RootLogLevelChangeSuccess",
                    title: "Log Management",
                    message: "The ROOT Log Level has been changed to " + logLevel.level,
                    type: NotificationType.Success
                });
    
            }, (error)=>{
                this.logger.error(LOG_TAG ,"Error changing ROOT Log Level:", error);

                this.notificationCenter.post({
                    name:"RootLogLevelChangeError",
                    title: "Log Management",
                    message: "Error changing ROOT Log Level:",
                    type: NotificationType.Error,
                    error: error
                });
    
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

        this.notificationCenter.post({
            name:"LogDownload",
            title: "Download Log",
            message: "Downloading Log file...",
            type: NotificationType.Info
        });


        this.logService.downloadCurrentLog().subscribe((data)=>{
            this.logger.debug(LOG_TAG ,"Export done.", data);

            var blob = new Blob([data], {type: 'application/zip'});
         
            let fileName = "motif_log_" + new Date().getTime() +".zip";
            FileSaver.saveAs(blob, fileName);   
            this.logger.debug(LOG_TAG ,"Log saved: ", fileName);

            this.notificationCenter.post({
                name:"LogExportSuccess",
                title: "Download Log",
                message: "The Log file has been downloaded.",
                type: NotificationType.Success
            });

        }, (error)=>{
            this.logger.error(LOG_TAG ,"Log download error:", error);

            this.notificationCenter.post({
                name:"LogExportError",
                title: "Download Log",
                message: "Error downloading the Log file:",
                type: NotificationType.Error,
                error: error
            });

        });
    }

    public onExportClicked():void {
        //this.renderer2.removeClass(this.exportSlideDown.nativeElement, 'closed');
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
            this.renderer2.removeClass(this.exportSlideDown.nativeElement, 'closed');
        } else {
            this.renderer2.addClass(this.exportSlideDown.nativeElement, 'closed');
        } 
    }

}
