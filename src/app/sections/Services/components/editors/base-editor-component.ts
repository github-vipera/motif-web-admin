import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { NGXLogger } from 'web-console-core';
import { WCPropertyEditorModel, WCPropertyEditorItemType, WCPropertyEditorItem } from 'web-console-ui-kit';
import { NotificationCenter, NotificationType } from '../../../../components/Commons/notification-center'
import { EditorContext } from './service-catalog-editor-context';
import { ifError } from 'assert';

const LOG_TAG = '[BaseEditorComponent]';

export abstract class BaseEditorComponent  {

    private _currentEditorContext: EditorContext;

    public propertyModel: WCPropertyEditorModel;

    @Output() public startLoading: EventEmitter<any> = new EventEmitter();
    @Output() public endLoading: EventEmitter<any> = new EventEmitter();

    @Output() public startSaving: EventEmitter<any> = new EventEmitter();
    @Output() public endSaving: EventEmitter<any> = new EventEmitter();

    constructor(public logger: NGXLogger,
        public notificationCenter: NotificationCenter) {
    }

    protected setModel(model:WCPropertyEditorModel) {
        this.propertyModel = model;
    }

    @Input()
    public set editorContext(editorContext: EditorContext) {
        this._currentEditorContext = editorContext;
        this.startLoading.emit();
        this.doRefreshData(this._currentEditorContext).subscribe((event) => {
            this.endLoading.emit();
        }, (error) => {
            this.endLoading.emit();
        });
    }

    public saveChanges() {
        this.startSaving.emit();
        this.doSaveChanges(this._currentEditorContext).subscribe((event) => {
            this.endSaving.emit();
        }, (error) => {
            this.endSaving.emit();
        });
    }

    public discardChanges() {
        this.logger.debug(LOG_TAG, 'discardChanges called.');
        this.startLoading.emit();
        this.doRefreshData(this._currentEditorContext).subscribe((data) => {
            this.endLoading.emit();
        }, (error) => {
            this.endLoading.emit();
        });
    }

    protected getPropertyItem(field: string): WCPropertyEditorItem {
        const items: WCPropertyEditorItem[] = this.propertyModel.items;
        for (let i = 0; i< items.length; i++) {
            if (items[i].field === field) {
                return items[i];
            }
        }
        return null;
    } 

    abstract doRefreshData(editorContext: EditorContext): Observable<any>;

    abstract doSaveChanges(editorContext: EditorContext): Observable<any>;

}
