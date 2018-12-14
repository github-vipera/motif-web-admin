import { Component, OnInit, Input } from '@angular/core';
import { NGXLogger } from 'web-console-core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
        // TODO!!
    }

    public startEditApplication(domainName: string, applicationName: string): void {
        this._editorContext = {
            domainName: domainName,
            applicationName: applicationName,
            editingType: EditingType.Application
        };
        // TODO!!
    }

    public startEditService(domainName: string, applicationName: string, serviceName: string): void {
        this._editorContext = {
            domainName: domainName,
            applicationName: applicationName,
            serviceName: serviceName,
            editingType: EditingType.Service
        };
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

}
