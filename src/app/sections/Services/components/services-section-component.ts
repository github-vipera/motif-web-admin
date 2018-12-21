import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { PluginView } from 'web-console-core';
import { NGXLogger } from 'web-console-core';
import { RegistryService } from '@wa-motif-open-api/plugin-registry-service';
import { SortDescriptor, GroupDescriptor, DataResult } from '@progress/kendo-data-query';
import { faGlobe, faArchive, faBoxOpen, faCompass, faDesktop, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { WCPropertyEditorModel, WCPropertyEditorItemType } from 'web-console-ui-kit';
import { ServiceCatalogService } from '../../../services/ServiceCatalogService';
import { TreeNode } from 'primeng/api';
import { ServiceCatalogTableModel } from '../data/model';
import { ServiceCataglogEditorComponent } from './editors/service-catalog-editor-component'
import { NotificationCenter, NotificationType } from '../../../components/Commons/notification-center'
import {MenuItem} from 'primeng/api';

import {
    GridComponent,
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';

import * as _ from 'lodash';
import { faLessThan } from '@fortawesome/free-solid-svg-icons';
import { ServiceCatalogEditorChangesEvent, EditingType } from './editors/service-catalog-editor-context';

const LOG_TAG = '[ServicesSection]';

@Component({
    selector: 'wa-services-section',
    styleUrls: ['./services-section-component.scss'],
    templateUrl: './services-section-component.html'
})
@PluginView("Services", {
    iconName: "ico-services"
})
export class ServicesSectionComponent implements OnInit {

    private menuItems: MenuItem[];

    addActions: Array<any> = [{
        text: 'Add Domain',
        click: (dataItem) => {
            this.onAddDomainClick();
        }
    }, {
        text: 'Add Application',
        disabled: true,
        click: (dataItem) => {
            this.onAddApplicationClick();
        }
    }, {
        text: 'Add Service',
        disabled: true,
        click: (dataItem) => {
            this.onAddServiceClick();
        }
    }, {
        text: 'Add Operation',
        disabled: true,
        click: (dataItem) => {
            this.onAddOperationClick();
        }
    }];

    faGlobe = faGlobe;
    faBoxOpen = faBoxOpen;
    faArchive = faArchive;
    faCompass = faCompass;
    faDesktop = faDesktop;

    public gridData: DataResult;
    public gridView: DataResult;
    public sort: SortDescriptor[] = [];
    public groups: GroupDescriptor[] = [];

    _selectedNode: TreeNode;

    deleteButtonCaption = 'Delete selected Domain ';
    deleteButtonEnabled: boolean;

    @Input() tableModel: ServiceCatalogTableModel;

    public loading: boolean;
    private _currentRowElement: any;

    @ViewChild('servicesEditor') _servicesEditor: ServiceCataglogEditorComponent;
    @ViewChild('deleteButton') _deleteButton: ElementRef;

    constructor(private logger: NGXLogger,
        private registryService: RegistryService,
        private serviceCatalogService: ServiceCatalogService,
        private notificationCenter: NotificationCenter) {
        this.logger.debug(LOG_TAG, 'Opening...');

        this.menuItems = [
            {
                label: 'New...',
                items: [
                    {
                        label: 'New Domain',
                        command: (event) => { this.onAddDomainClick(); }
                    },
                    {
                        label: 'New Application',
                        disabled: true,
                        command: (event) => { this.onAddApplicationClick(); }
                    },
                    {
                        label: 'New Service',
                        command: (event) => { this.onAddApplicationClick(); }
                    },
                    {
                        label: 'New Operation',
                        command: (event) => { this.onAddApplicationClick(); }
                    }
                ]
            },
            {
                label: 'Delete',
                disabled: true,
                command: (event) => { this.onDeleteSelectedNode(); }
            }
        ];
    }

    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG, 'Initializing...');
        this.groups = [{ field: 'domain' }, { field: 'application' }, { field: 'service' } ];

        this.tableModel = new ServiceCatalogTableModel();

        this.refreshData();
    }

    public onRefreshClicked(): void {
        this.logger.debug(LOG_TAG, 'Refresh clicked');
        this.refreshData();
    }

    public refreshData() {
        this.loading = true;
        this.serviceCatalogService.getServiceCatalog().subscribe(data => {
            this.logger.debug(LOG_TAG, 'getServiceCatalog done.');
            this.logger.trace(LOG_TAG, 'getServiceCatalog services: ', data);
            this.tableModel.loadData(data);
            this.loading = false;
        }, (error) => {
            this.logger.error(LOG_TAG, 'getServiceCatalog error: ', error);
            this.notificationCenter.post({
                name: 'ConfigurationExportError',
                title: 'Export Configuration',
                message: 'Error exporting configuration:',
                type: NotificationType.Error,
                error: error
            });
        });
    }

    @Input() onSavePropertiesPressed(): void {
        // TODO!!
    }

    nodeSelect(node: TreeNode) {
        this.logger.debug(LOG_TAG, 'Node selected: ', node.data);

        const catalogEntry = node.data.catalogEntry;
        const nodeType = node.data.nodeType;

        if (nodeType === 'Domain') {
            this._servicesEditor.startEditDomain(catalogEntry.domain);
        } else if (nodeType === 'Application') {
            this._servicesEditor.startEditApplication(catalogEntry.domain, catalogEntry.application);
        } else if (nodeType === 'Service') {
            this._servicesEditor.startEditService(catalogEntry.domain,
                catalogEntry.application,
                catalogEntry.service,
                catalogEntry.channel);
        } else if (nodeType === 'Operation') {
            this._servicesEditor.startEditOperation(catalogEntry.domain,
                catalogEntry.application,
                catalogEntry.service,
                catalogEntry.channel,
                catalogEntry.operation);
        }
        this.updateCommands(nodeType);
    }

    private updateCommands(nodeType: string) {
        if (nodeType === 'Domain') {
            this.deleteButtonCaption = 'Delete selected Domain';
        } else if (nodeType === 'Application') {
            this.deleteButtonCaption = 'Delete selected Application';
        } else if (nodeType === 'Service') {
            this.deleteButtonCaption = 'Delete selected Service';
        } else if (nodeType === 'Operation') {
            this.deleteButtonCaption = 'Delete selected Operation';
        }

        // TODO!!! update menu items
 
        this.deleteButtonEnabled = true;
    }

    nodeUnselect(event) {
        this.logger.debug(LOG_TAG, 'Node unselected: ', event.node.data);
    }

    public onFilterChange(event) {
        // TODO!!
    }

    public onChangesSaved(event: ServiceCatalogEditorChangesEvent) {
        this.logger.debug(LOG_TAG, 'onChangesSaved: ', event);
        this.handleChanges(event);
    }

    private handleChanges(event: ServiceCatalogEditorChangesEvent) {
        const description = event.model.items[0].value;
        let treeNode: TreeNode;
        if (event.context.editingType === EditingType.Domain) {
            treeNode = this.tableModel.getDomainNode(event.context.domainName);
        } else if (event.context.editingType === EditingType.Application) {
            treeNode = this.tableModel.getApplicationNode(event.context.domainName, event.context.applicationName);
        } else if (event.context.editingType === EditingType.Operation) {
            treeNode = this.tableModel.getOperationNode(event.context.domainName, 
                event.context.applicationName,
                event.context.serviceName,
                event.context.operationName);
        }
        if (treeNode) {
            treeNode.data.description = description;
        }
    }

    /*
    private handleChangesForDomain(event: ServiceCatalogEditorChangesEvent) {
        const domainName = event.context.domainName;
        const description = event.model.items[0].value;
        const treeNode = this.tableModel.getDomainNode(domainName);
        if (treeNode) {
            treeNode.data.description = description;
        }
    }
    */

   private onAddDomainClick(): void {
    alert('onAddDomainClick');
   }

   private onAddApplicationClick(): void {
    alert('onAddApplicationClick');
   }

   private onAddServiceClick(): void {
    alert('onAddServiceClick');
   }

    private onAddOperationClick(): void {
        alert('onAddOperationClick');
    }

    private onDeleteSelectedNode(): void {
        alert('onDeleteSelectedNode: ' + this.selectedNode.data.name);
    }

    set selectedNode(node: TreeNode) {
        this._selectedNode = node;
        this.nodeSelect(node);
    }

    get selectedNode(): TreeNode {
        return this._selectedNode;
    }

}
