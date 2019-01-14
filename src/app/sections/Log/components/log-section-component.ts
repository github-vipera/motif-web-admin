import { Component, OnInit, ViewChild, OnDestroy, ElementRef, Renderer2} from '@angular/core';
import { PluginView } from 'web-console-core';
import { NGXLogger} from 'web-console-core';
import { LogService, LogLevel, LogTail } from '@wa-motif-open-api/log-service';
import * as _ from 'lodash';
import { ClipboardService } from 'ngx-clipboard';
import * as FileSaver from 'file-saver';
import { faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons';
import { faFileImport, faDownload, faCopy, faPaste } from '@fortawesome/free-solid-svg-icons';
import { NotificationCenter, NotificationType } from '../../../components/Commons/notification-center';
import { saveAs } from '@progress/kendo-file-saver';
import { DatarecordsService } from '@wa-motif-open-api/datarecords-service';
import { SubscriptionHandler } from '../../../components/Commons/subscription-handler';
import { formatDate } from '@angular/common';

const LOG_TAG = '[LogSection]';

@Component({
    selector: 'wa-log-section',
    styleUrls: [ './log-section-component.scss' ],
    templateUrl: './log-section-component.html'
  })
  @PluginView('Log', {
    iconName: 'ico-log'
})
export class LogSectionComponent implements OnInit, OnDestroy {

    faFileImport = faFileImport;
    faDownload = faDownload;
    faExternalLinkSquareAlt = faExternalLinkSquareAlt;
    faCopy = faCopy;
    faPaste = faPaste;

    public tailLines: string;
    public linesCount = 100;
    public currentTailLinesCount: number;
    public logLevels: LogLevel[];
    private _rootLogLevel: LogLevel;
    public dataRecordTypes: string[] = [ ];
    public dataRecordType: string;
    public range = { start: null, end: null };

    loading: boolean;

    @ViewChild('logPane') logPane: ElementRef;
    @ViewChild('exportSlideDown') exportSlideDown: ElementRef;

    private _subHandler: SubscriptionHandler = new SubscriptionHandler();

    constructor(private logger: NGXLogger,
        private notificationCenter: NotificationCenter,
        private logService: LogService,
        private renderer2: Renderer2,
        private clipboardService: ClipboardService,
        private datarecordsService: DatarecordsService) {
        this.logger.debug(LOG_TAG , 'Opening...');

        this.logLevels = [];
        this.logLevels.push({level: 'ERROR'});
        this.logLevels.push({level: 'WARN'});
        this.logLevels.push({level: 'INFO'});
        this.logLevels.push({level: 'DEBUG'});
        this.logLevels.push({level: 'TRACE'});
    }

    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG , 'Initializing...');
        this.tailLines = '';
        this.loadDatarecordsTypes();
        this.refreshData();
    }

    ngOnDestroy() {
        this.logger.debug(LOG_TAG , 'ngOnDestroy ');
        this.freeMem();
    }

    freeMem() {
        this.tailLines = null;
        this.logLevels = null;
        this.dataRecordTypes = null;
        this._subHandler.unsubscribe();
        this._subHandler = null;
    }

    public onRefreshClicked(): void {
        this.logger.debug(LOG_TAG , 'linesCount :', this.linesCount);
        this.loading = true;
        this._subHandler.add(this.logService.tailCurrentLog(this.linesCount).subscribe((logTail: LogTail) => {
            this.tailLines = logTail.data;
            this.currentTailLinesCount = logTail.lines;
            this.loading = false;
        }, (error) => {
            this.logger.error(LOG_TAG , 'tailCurrentLog error:', error);
            this.notificationCenter.post({
                name: 'RefreshLogTailError',
                title: 'Tail Log',
                message: 'Error refreshing log:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });
            this.loading = false;
        }));
    }

    public onCopyToClipboardClicked(): void {
        this.clipboardService.copyFromContent(this.tailLines);

        this.notificationCenter.post({
            name: 'LogTailCopy',
            title: 'Log tail Copy',
            message: 'The current displayed log has been copied to the clipboard.',
            type: NotificationType.Info
        });

    }

    public set rootLogLevel(logLevel: LogLevel) {
        if (logLevel) {
            this._rootLogLevel = logLevel;
            this.logger.debug(LOG_TAG , 'Changing ROOT log level :', logLevel);
            this._subHandler.add(this.logService.setRootLogLevel(this._rootLogLevel).subscribe((data) => {
                this.logger.debug(LOG_TAG , 'Changed ROOT log level :', data);

                this.notificationCenter.post({
                    name: 'RootLogLevelChangeSuccess',
                    title: 'Log Management',
                    message: 'The ROOT Log Level has been changed to ' + logLevel.level,
                    type: NotificationType.Success
                });

            }, (error) => {
                this.logger.error(LOG_TAG , 'Error changing ROOT Log Level:', error);

                this.notificationCenter.post({
                    name: 'RootLogLevelChangeError',
                    title: 'Log Management',
                    message: 'Error changing ROOT Log Level:',
                    type: NotificationType.Error,
                    error: error,
                    closable: true
                });

            }));
        }
    }

    public get rootLogLevel(): LogLevel {
        return this._rootLogLevel;
    }

    public refreshData() {
        this.logService.getRootLogLevel().subscribe((data: LogLevel) => {
            this.logger.debug(LOG_TAG , 'Getting ROOT log level :', data);
            this._rootLogLevel = data;
        }, (error) => {
            this.logger.error(LOG_TAG , 'Error Getting ROOT log level :', error);
        });
    }

    public onDownloadClicked(): void {

        this.notificationCenter.post({
            name: 'LogDownload',
            title: 'Download Log',
            message: 'Downloading Log file...',
            type: NotificationType.Info
        });


        this._subHandler.add(this.logService.downloadCurrentLog().subscribe((data) => {
            this.logger.debug(LOG_TAG , 'Export done.', data);

            const blob = new Blob([data], {type: 'application/zip'});

            const fileName = 'motif_log_' + new Date().getTime() + '.zip';

            this.logger.debug(LOG_TAG , 'Saving to: ', blob);

            saveAs(blob, fileName);
            // FileSaver.saveAs(blob, fileName);
            this.logger.debug(LOG_TAG , 'Log saved: ', fileName);

            this.notificationCenter.post({
                name: 'LogExportSuccess',
                title: 'Download Log',
                message: 'The Log file has been downloaded.',
                type: NotificationType.Success
            });

        }, (error) => {
            this.logger.error(LOG_TAG , 'Log download error:', error);

            this.notificationCenter.post({
                name: 'LogExportError',
                title: 'Download Log',
                message: 'Error downloading the Log file:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });

        }));
    }

    public onExportClicked(): void {
        this.slideDownExportPanel(true);
    }

    public onExportConfirm(): void {
        this.exportDataRecords();
        this.slideDownExportPanel(false);
    }

    public onExportCancel(): void {
        this.slideDownExportPanel(false);
    }

    private slideDownExportPanel(show: boolean): void {
        if (show) {
            this.renderer2.removeClass(this.exportSlideDown.nativeElement, 'closed');
        } else {
            this.renderer2.addClass(this.exportSlideDown.nativeElement, 'closed');
        }
    }

    private convertDate(date: Date): string {
        return formatDate(date, 'yyyy/MM/dd HH:mm:ss', 'en-US');
    }

    private exportDataRecords(): void {
        this.logger.debug(LOG_TAG , 'exportDataRecords: ', this.dataRecordType, this.range.start, this.range.end);
        this.notificationCenter.post({
            name: 'ExportDataRecordsProgress',
            title: 'DataRecords Export',
            message: 'Exporting datarecords...',
            type: NotificationType.Info,
            closable: false
        });
        const startDate = this.convertDate(this.range.start);
        const endDate = this.convertDate(this.range.end);
        this.logger.debug(LOG_TAG , 'exportDataRecords: ', this.dataRecordType, startDate, endDate);
        this._subHandler.add(this.datarecordsService.exportDatarecords(this.dataRecordType, null, null, null, 
            startDate, endDate ).subscribe( (data) => {
                this.logger.debug(LOG_TAG , 'exportDataRecords done: ', data);

                const blob = new Blob([data], {type: 'application/zip'});
                const fileName = 'motif_datarecords_' + new Date().getTime() + '.zip';
                this.logger.debug(LOG_TAG , 'Saving to: ', blob);
                saveAs(blob, fileName);
                this.logger.debug(LOG_TAG , 'Log saved: ', fileName);

                this.notificationCenter.post({
                    name: 'ExportDataRecordsSuccess',
                    title: 'DataRecords Export',
                    message: 'Datarecords exported successfully.',
                    type: NotificationType.Success,
                    closable: false
                });
        
        }, (error) => {

            this.logger.error(LOG_TAG , 'exportDataRecords error: ', error);

            this.notificationCenter.post({
                name: 'ExportDataRecordsError',
                title: 'DataRecord Export',
                message: 'Error exporting datarecords:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });

        }));
    }

    private loadDatarecordsTypes(): void {
        this._subHandler.add(this.datarecordsService.getDatarecordsTypes().subscribe((data) => {
            this.logger.debug(LOG_TAG , 'loadDatarecordsTypes: ', data);
            this.dataRecordTypes = data;
        }, (error) => {
            this.logger.error(LOG_TAG , 'loadDatarecordsTypes error: ', error);

            this.notificationCenter.post({
                name: 'GetDataRecordTypesError',
                title: 'Get DataRecord Types',
                message: 'Error getting the datarecord types:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });

        }));
    }

}
