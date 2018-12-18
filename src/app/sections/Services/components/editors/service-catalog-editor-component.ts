import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { NGXLogger } from 'web-console-core';
import { EditingType, EditorContext } from './service-catalog-editor-context';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { BaseEditorComponent } from './base-editor-component';
import { ServiceCatalogEditorChanges } from './service-catalog-editor-context';

const LOG_TAG = '[ServicesCatalogEditor]';


@Component({
    selector: 'wa-services-editor',
    styleUrls: ['./service-catalog-editor-component.scss'],
    templateUrl: './service-catalog-editor-component.html'
})
export class ServiceCataglogEditorComponent implements OnInit {

    faCircleNotch = faCircleNotch;

    private _editorContext: EditorContext;
    private _title = 'No selection.';
    loading: boolean;

    @ViewChild('domainEditor') _domainEditor: BaseEditorComponent;

    @Output() changesSaved: EventEmitter<ServiceCatalogEditorChanges> = new EventEmitter();

    constructor(private logger: NGXLogger,
        private changeDetector: ChangeDetectorRef) {
    }

    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG, 'Initializing...');
        this._editorContext = {
            domainName: null,
            editingType: EditingType.None
        };
    }

    public startEditDomain(domainName: string): void {
        this._editorContext = {
            domainName: domainName,
            editingType: EditingType.Domain
        };
        this.setTitle('Domain \'' + domainName + '\'');
        this.logger.debug(LOG_TAG, 'startEditDomain: ', this._editorContext);
        this.changeDetector.detectChanges();
    }

    public startEditApplication(domainName: string, applicationName: string): void {
        this._editorContext = {
            domainName: domainName,
            applicationName: applicationName,
            editingType: EditingType.Application
        };
        this.logger.debug(LOG_TAG, 'startEditApplication: ', this._editorContext);
        this.setTitle('Application \'' + applicationName + '\'');
        // TODO!!
    }

    public startEditService(domainName: string, applicationName: string, serviceName: string): void {
        this._editorContext = {
            domainName: domainName,
            applicationName: applicationName,
            serviceName: serviceName,
            editingType: EditingType.Service
        };
        this.logger.debug(LOG_TAG, 'startEditService: ', this._editorContext);
        this.setTitle('Service \''  + serviceName + '\'');
        // TODO!!
    }

    public startEditOperation(domainName: string, applicationName: string, serviceName: string, operationName: string): void {
        this._editorContext = {
            domainName: domainName,
            applicationName: applicationName,
            serviceName: serviceName,
            operationName: operationName,
            editingType: EditingType.Operation
        };
        this.logger.debug(LOG_TAG, 'startEditOperation: ', this._editorContext);
        this.setTitle('Operation \'' + operationName + '\'');
        // TODO!!
    }

    public get editorContext(): EditorContext {
        return this._editorContext;
    }

    public isDomainEditing(): boolean {
        return (this._editorContext.editingType === EditingType.Domain);
    }

    public isApplicationEditing(): boolean {
        return (this._editorContext.editingType === EditingType.Application);
    }

    public isServiceEditing(): boolean {
        return (this._editorContext.editingType === EditingType.Service);
    }

    public isOperationEditing(): boolean {
        return (this._editorContext.editingType === EditingType.Operation);
    }

    @Input() get title(): string {
        return this._title;
    }

    private setTitle(title: string): void {
        this._title = title;
    }

    @Input() get namespace(): string {
        let namespace = '';

        if (this._editorContext.domainName) {
            namespace += this._editorContext.domainName;
        }
        if (this._editorContext.applicationName) {
            namespace += '/' + this._editorContext.applicationName;
        }
        if (this._editorContext.serviceName) {
            namespace += '/' + this._editorContext.serviceName;
        }
        if (this._editorContext.operationName) {
            namespace += '/' + this._editorContext.operationName;
        }
        return namespace;
    }

    onSaveButtonClick(event) {
        this._domainEditor.saveChanges();
    }

    onReloadButtonClick(event) {
        this._domainEditor.discardChanges();
    }

    onLoading(loading: boolean) {
        this.logger.debug(LOG_TAG, 'onLoading: ', loading);
        this.loading = loading;
    }

    onDataSaved(changes: ServiceCatalogEditorChanges) {
        this.logger.debug(LOG_TAG, 'onDataSaved: ', changes);
        this.changesSaved.emit(changes);
    }

}
