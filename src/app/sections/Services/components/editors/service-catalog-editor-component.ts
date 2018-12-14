import { Component, OnInit, Input } from '@angular/core';
import { NGXLogger } from 'web-console-core';

const LOG_TAG = '[ServicesCatalogEditor]';

enum EditingType {
    None,
    Domain,
    Application,
    Service,
    Operation
}

interface EditorContext {
    domainName: string;
    applicationName?: string;
    serviceName?: string;
    operationName?: string;
    userdata?: any;
    editingType: EditingType;
}

@Component({
    selector: 'wa-services-editor',
    styleUrls: ['./service-catalog-editor-component.scss'],
    templateUrl: './service-catalog-editor-component.html'
})
export class ServiceCataglogEditorComponent implements OnInit {

    private _editorContext: EditorContext;
    private _title = 'No selection.';

    constructor(private logger: NGXLogger) {

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
        // TODO!!
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
}
