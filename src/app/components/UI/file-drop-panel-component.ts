
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NGXLogger} from 'web-console-core'
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';


const LOG_TAG = "[FileDropComponent]";

@Component({
    selector: 'wc-file-drop-panel',
    styles: [
        '.wc-file-drop-panel {  width: 100%; height: 100%; border: 1px dashed #8b8c8c; display:flex;align-items: center;justify-content: center; flex-direction:column;}',
        '.wc-file-drop-panel.dragover { background-color: #4c4c4c; }',
        '.wc-file-drop-panel-caption { font-size: .7rem;font-family: montserrat; text-transform: uppercase; vertical-align: middle; text-align: center;padding-top: 4px;}',
        '.wc-file-drop-panel-caption-filename { font-size: .6rem;}'
    ],
    template:`
        <div droppable (filesDropped)="handleFilesDropped($event)" class="wc-file-drop-panel" role="button" #dropzone="droppable">
        <label *ngIf="!dropzone.isHover" class="btn small wc-file-drop-panel-caption">{{caption}}</label>
        <label *ngIf="dropzone.isHover" class="btn small wc-file-drop-panel-caption">{{altCaption}}</label>
        <label *ngIf="droppedFileName" class="wc-file-drop-panel-caption wc-file-drop-panel-caption-filename">{{droppedFileName}}</label>
        </div>
    `
})
export class FileDropPanelComponent implements OnInit {

    @Input() caption:string = "Drop files here or click";
    @Input() altCaption:string = "Drop the file";

    public droppedFileName:string;
    private _droppedFile:File;

    constructor(private logger: NGXLogger){
            this.logger.debug(LOG_TAG ,"Creating...");
    } 

    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG ,"Initializing...");
    }

    public handleFilesDropped(event){
        this.logger.debug(LOG_TAG ,"File dropped: ", event);
        this._droppedFile = event[0];
        this.droppedFileName = event[0].name;
    }

    public get file():File {
        return this._droppedFile;
    }

    public reset():void {
        this._droppedFile = null;
        this.droppedFileName = null;
    }
}

