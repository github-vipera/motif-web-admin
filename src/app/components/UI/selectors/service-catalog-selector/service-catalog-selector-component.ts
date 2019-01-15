import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { NotificationCenter, NotificationType } from './../../../Commons/notification-center';
import { ServiceCatalogService } from './../../../../services/ServiceCatalogService';
import { ServiceCatalogTableModel, DataFilter, CatalogEntry } from './data/model';
import { TreeNode } from 'primeng/api';
import { SubscriptionHandler } from 'src/app/components/Commons/subscription-handler';
export { DataFilter, CatalogEntry } from './data/model';

const LOG_TAG = '[ServiceCatalogSelectorComponent]';


export enum ServiceCatalogNodeType {
    Domain = 'Domain',
    Application  = 'Application',
    Service = 'Service',
    Operation = 'Operation'
}

export interface ServiceCatalogNode {
    nodeType: ServiceCatalogNodeType;
    name: string;
    description: string;
    domain: string;
    application?: string;
    service?: string;
    operation?: string;
    channel?: string;
    data?: any;
}

export interface ServiceCatalogNodeSelectionEvent {
    node: ServiceCatalogNode
}

export interface ServiceCatalogDblClickEvent {
    node: ServiceCatalogNode
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'wa-service-catalog-selector',
    styleUrls: ['./service-catalog-selector-component.scss'],
    templateUrl: './service-catalog-selector-component.html'
})
export class ServiceCatalogSelectorComponent implements OnInit, OnDestroy {

    tableModel: ServiceCatalogTableModel;
    _selectedNode: TreeNode;
    loading = false;
    private _subHandler: SubscriptionHandler = new SubscriptionHandler();
    private _dataFilter: DataFilter;

    @Output() nodeSelection: EventEmitter<ServiceCatalogNodeSelectionEvent> = new EventEmitter();

    constructor(
        private logger: NGXLogger,
        private notificationCenter: NotificationCenter,
        private serviceCatalogService: ServiceCatalogService
    ) {}

    ngOnInit() {
        this.tableModel = new ServiceCatalogTableModel();
        this.reloadData()
    }

    ngOnDestroy() {
        this.logger.debug(LOG_TAG , 'ngOnDestroy ');
        this.freeMem();
    }

    freeMem() {
        this.tableModel.close();
    }

    set selectedNode(node: TreeNode) {
        this._selectedNode = node;
        this.nodeSelect(node);
    }

    get selectedNode(): TreeNode {
        return this._selectedNode;
    }

    get selectedServiceCatalogEntry(): ServiceCatalogNode {
        const treeNode = this.selectedNode;
        if (treeNode){
            return this.buildServiceCatalogNode(treeNode);
        } else {
            return null;
        }
    }

    nodeSelect(node: TreeNode) {
        this.logger.debug(LOG_TAG, 'Node selected: ', node);
        
        let selectionEvent:ServiceCatalogNodeSelectionEvent = null;
        const selectedNode = this.buildServiceCatalogNode(node);
        if (selectedNode){
            selectionEvent =  { node: selectedNode };
        }

        this.nodeSelection.emit(selectionEvent);
    }

    private buildServiceCatalogNode(node: TreeNode) {
        if (node){
            const catalogEntry = node.data.catalogEntry;
            const nodeType: ServiceCatalogNodeType = this.toNodeType(node.data.nodeType);
            return {
                nodeType: nodeType,
                name: node.data.name,
                description: node.data.description,
                domain: catalogEntry.domain,
                application: catalogEntry.application,
                service: catalogEntry.service,
                operation: catalogEntry.operation,
                channel: catalogEntry.channel,
                data: catalogEntry
            } 
        } else {
            return null;
        }
    }

    toNodeType(value: string): ServiceCatalogNodeType {
        if ( value === 'Domain' ) {
            return ServiceCatalogNodeType.Domain;
        } else if ( value === 'Application' ) {
            return ServiceCatalogNodeType.Application;
        } else if ( value === 'Service' ) {
            return ServiceCatalogNodeType.Service;
        } else if ( value === 'Operation' ) {
            return ServiceCatalogNodeType.Operation;
        }
    }

    nodeUnselect(event: any) {
        this.logger.debug(LOG_TAG, 'Node unselected: ', event.node.data);
        // nop
    }

    public reloadData() {
        this.loading = true;
        this._subHandler.add(this.serviceCatalogService.getServiceCatalog().subscribe(data => {
            this.logger.debug(LOG_TAG, 'getServiceCatalog done.');
            this.logger.trace(LOG_TAG, 'getServiceCatalog services: ', data);
            this.tableModel.loadData(data, this._dataFilter);
            this.loading = false;
        }, (error) => {
            this.logger.error(LOG_TAG, 'getServiceCatalog error: ', error);
            this.notificationCenter.post({
                name: 'GetServiceCatalogError',
                title: 'Get Service catalog',
                message: 'Error getting service catalog:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });
            this.loading = false;
        }));
    }

    @Input() set dataFilter(dataFilter: DataFilter) {
        this._dataFilter = dataFilter;
        this.reloadData();
    }

}