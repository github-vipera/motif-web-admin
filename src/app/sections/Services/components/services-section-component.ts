import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { PluginView } from 'web-console-core';
import { NGXLogger } from 'web-console-core';
import { RegistryService } from '@wa-motif-open-api/plugin-registry-service';
import { faGlobe, faArchive, faBoxOpen, faCompass, faDesktop, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { ServiceCatalogService } from '../../../services/ServiceCatalogService';
import { TreeNode } from 'primeng/api';
import { ServiceCatalogTableModel } from '../data/model';
import { ServiceCataglogEditorComponent } from './editors/service-catalog-editor-component';
import { NotificationCenter, NotificationType } from '../../../components/Commons/notification-center';
import { MenuItem } from 'primeng/api';
import * as _ from 'lodash';
import { NewItemDialogComponent, DialogResult } from './dialogs/new-item-dialog';
import { ServiceCatalogEditorChangesEvent, EditingType } from './editors/service-catalog-editor-context';
import { Domain, Application } from '@wa-motif-open-api/platform-service';

const LOG_TAG = '[ServicesSection]';



@Component({
    selector: 'wa-services-section',
    styleUrls: ['./services-section-component.scss'],
    templateUrl: './services-section-component.html'
})
@PluginView('Services', {
    iconName: 'ico-services'
})
export class ServicesSectionComponent implements OnInit {

    // Menus
    menuItems: MenuItem[];

    // Icons
    faGlobe = faGlobe;
    faBoxOpen = faBoxOpen;
    faArchive = faArchive;
    faCompass = faCompass;
    faDesktop = faDesktop;


    deleteButtonCaption = 'Delete selected Domain ';
    deleteButtonEnabled: boolean;

    @Input() tableModel: ServiceCatalogTableModel;

    public loading: boolean;
    private _currentRowElement: any;
    _selectedNode: TreeNode;

    @ViewChild('servicesEditor') _servicesEditor: ServiceCataglogEditorComponent;
    @ViewChild('newItemDialog') _newItemDialog: NewItemDialogComponent;

    // Menus
    private _deleteMenuItem: MenuItem;
    private _addDomainMenuItem: MenuItem;
    private _addApplicationMenuItem: MenuItem;
    private _addServiceMenuItem: MenuItem;
    private _addOperationMenuItem: MenuItem;
    private _addMenuItem: MenuItem;

    constructor(private logger: NGXLogger,
        private registryService: RegistryService,
        private serviceCatalogService: ServiceCatalogService,
        private notificationCenter: NotificationCenter,
        private renderer2: Renderer2,
        private changeDetector: ChangeDetectorRef
        ) {
        this.logger.debug(LOG_TAG, 'Opening...');

        this._deleteMenuItem = {
            id: 'delete',
            label: 'Delete',
            disabled: true,
            command: (event) => { this.onDeleteSelectedNode(); }
        };
        this._addDomainMenuItem = {
            id: 'newDomain',
            label: 'New Domain',
            command: (event) => { this.onAddDomainClick(); }
        };
        this._addApplicationMenuItem = {
            id: 'newApplication',
            label: 'New Application',
            disabled: true,
            command: (event) => { this.onAddApplicationClick(); }
        };
        this._addServiceMenuItem =  {
            id: 'newService',
            label: 'New Service',
            disabled: true,
            command: (event) => { this.onAddServiceClick(); }
        };
        this._addOperationMenuItem =  {
            id: 'newOperation',
            label: 'New Operation',
            disabled: true,
            command: (event) => { this.onAddOperationClick(); }
        };
        this._addMenuItem = {
            label: 'New...',
            items: [
                this._addDomainMenuItem,
                this._addApplicationMenuItem,
                this._addServiceMenuItem,
                this._addOperationMenuItem
            ]
        };
        this.menuItems = [
            this._addMenuItem,
            this._deleteMenuItem
        ];
    }

    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG, 'Initializing...');

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
        const deleteEnabled = true;
        const addDomainEnabled = true;
        let addApplicationEnabled = false;
        let addServiceEnabled = false;
        let addOperationEnabled = false;

        let deleteButtonCaption = '';
        if (nodeType === 'Domain') {
            deleteButtonCaption = 'Delete selected Domain';
            addApplicationEnabled = true;
        } else if (nodeType === 'Application') {
            deleteButtonCaption = 'Delete selected Application';
            addServiceEnabled = true;
        } else if (nodeType === 'Service') {
            deleteButtonCaption = 'Delete selected Service';
            addOperationEnabled = true;
        } else if (nodeType === 'Operation') {
            deleteButtonCaption = 'Delete selected Operation';
            addOperationEnabled = true;
        }

        // update menu items
        this._deleteMenuItem.label = deleteButtonCaption;
        this._deleteMenuItem.disabled = !deleteEnabled;
        this._addDomainMenuItem.disabled = !addDomainEnabled;
        this._addApplicationMenuItem.disabled = !addApplicationEnabled;
        this._addServiceMenuItem.disabled = !addServiceEnabled;
        this._addOperationMenuItem.disabled = !addOperationEnabled;

    }

    private updateMenuItemStatus(itemId: string, enabled: boolean, label?: string): void {
        const itemIndex = _.findIndex(this.menuItems, function(o: any) { return o.id === itemId; });
        if (itemIndex >= 0 ) {
            this.menuItems[itemIndex].disabled = !enabled;
            if (label) {
                this.menuItems[itemIndex].label = label;
            }
        }
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
        this.logger.debug(LOG_TAG, 'handleChanges: ', event);
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


   private onAddDomainClick(): void {
    this.logger.debug(LOG_TAG, 'onAddDomainClick');
    this._newItemDialog.show(EditingType.Domain);
   }

   private onAddApplicationClick(): void {
    this.logger.debug(LOG_TAG, 'onAddApplicationClick');
    this._newItemDialog.show(EditingType.Application);
   }

   private onAddServiceClick(): void {
    this.logger.debug(LOG_TAG, 'onAddServiceClick');
    this._newItemDialog.show(EditingType.Service);
   }

    private onAddOperationClick(): void {
        this.logger.debug(LOG_TAG, 'onAddOperationClick');
        this._newItemDialog.show(EditingType.Operation);
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

    onNewItemConfirm(event: DialogResult): void {
        if (event.editType === EditingType.Domain) {
            this.createNewDomain(event.name);
        } else if (event.editType === EditingType.Application) {
            this.createNewApplication(this.selectedNode.data.catalogEntry.domain, event.name);
        } else if (event.editType === EditingType.Service) {
            this.createNewService(this.selectedNode.data.catalogEntry.domain,
                this.selectedNode.data.catalogEntry.application,
                event.name, event.channel);
        } else if (event.editType === EditingType.Operation) {
            this.createNewOperation(this.selectedNode.data.catalogEntry.domain,
                this.selectedNode.data.catalogEntry.application,
                this.selectedNode.data.catalogEntry.service,
                event.name);
        }
    }

    private createNewDomain(domainName: string): void {
        this.logger.debug(LOG_TAG, 'createNewDomain called for: ', domainName);

        this.serviceCatalogService.createNewDomain(domainName).subscribe((newDomain: Domain) => {

            this.logger.debug(LOG_TAG, 'New domain added: ', newDomain);

            this.tableModel.addDomainNode(newDomain);

            this.notificationCenter.post({
                name: 'CreateNewDomain',
                title: 'Create New Domain',
                message: 'New Domain created successfully.',
                type: NotificationType.Success
            });

        }, (error) => {

            this.logger.error(LOG_TAG , 'New domain error: ', error);

            this.notificationCenter.post({
                name: 'CreateNewDomainError',
                title: 'Create New Domain',
                message: 'Error creating the new domain:',
                type: NotificationType.Error,
                error: error
            });

        });
    }

    private createNewApplication(domainName: string, applicationName: string): void {
        // TODO!!
        this.logger.debug(LOG_TAG, 'createNewApplication called for: ', domainName, applicationName);

        this.serviceCatalogService.createNewApplication(domainName, applicationName).subscribe((newApplication: Application) => {

            this.logger.debug(LOG_TAG, 'New application added: ', newApplication);

            this.tableModel.addApplicationNode(domainName, newApplication);

            this.notificationCenter.post({
                name: 'CreateNewApplication',
                title: 'Create New Application',
                message: 'New Application created successfully.',
                type: NotificationType.Success
            });

        }, (error) => {

            this.logger.error(LOG_TAG , 'New application error: ', error);

            this.notificationCenter.post({
                name: 'CreateNewApplicationError',
                title: 'Create New Application',
                message: 'Error creating the new application:',
                type: NotificationType.Error,
                error: error
            });

        });
    }

    private createNewService(domain: string,
        application: string,
        serviceName: string,
        channel: string): void {
        // TODO!!
        alert('TODO!! create new service ' + serviceName + ' under ' + domain + '@' + application);
    }

    private createNewOperation(domain: string,
        application: string,
        service: string,
        operationName: string): void {
        // TODO!!
        alert('TODO!! create new operation ' + operationName + ' under ' + domain + '@' + application + '@' + service);
    }

}
