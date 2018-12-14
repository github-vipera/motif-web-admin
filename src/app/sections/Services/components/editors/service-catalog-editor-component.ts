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

}
