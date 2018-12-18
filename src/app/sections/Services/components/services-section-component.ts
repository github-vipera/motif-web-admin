import { Component, OnInit, Input, ViewChild } from '@angular/core';
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

import {
    GridComponent,
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';

import * as _ from 'lodash';
import { faLessThan } from '@fortawesome/free-solid-svg-icons';
import { ServiceCatalogEditorChanges } from './editors/service-catalog-editor-context';

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

    faGlobe = faGlobe;
    faBoxOpen = faBoxOpen;
    faArchive = faArchive;
    faCompass = faCompass;
    faDesktop = faDesktop;

    public gridData: DataResult;
    public gridView: DataResult;
    public sort: SortDescriptor[] = [];
    public groups: GroupDescriptor[] = [];

    selectedNode: TreeNode;

    @Input() tableModel: ServiceCatalogTableModel;

    public loading: boolean;
    private _currentRowElement: any;

    @ViewChild('servicesEditor') _servicesEditor: ServiceCataglogEditorComponent;

    constructor(private logger: NGXLogger,
        private registryService: RegistryService,
        private serviceCatalogService: ServiceCatalogService,
        private notificationCenter: NotificationCenter) {
        this.logger.debug(LOG_TAG, 'Opening...');

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

    nodeSelect(event) {
        this.logger.debug(LOG_TAG, 'Node selected: ', event.node.data);

        const catalogEntry = event.node.data.catalogEntry;
        const nodeType = event.node.data.nodeType;

        if (nodeType === 'Domain') {
            this._servicesEditor.startEditDomain(catalogEntry.domain);
        } else if (nodeType === 'Application') {
            this._servicesEditor.startEditApplication(catalogEntry.domain, catalogEntry.application);
        } else if (nodeType === 'Service') {
            this._servicesEditor.startEditService(catalogEntry.domain, 
                catalogEntry.application,
                catalogEntry.service);
        } else if (nodeType === 'Operation') {
            this._servicesEditor.startEditOperation(catalogEntry.domain,
                catalogEntry.application,
                catalogEntry.service,
                catalogEntry.operation);
        }
    }

    nodeUnselect(event) {
        this.logger.debug(LOG_TAG, 'Node unselected: ', event.node.data);
    }

    public onFilterChange(event) {
        // TODO!!
    }

    public onChangesSaved(event: ServiceCatalogEditorChanges) {
        this.logger.debug(LOG_TAG, 'onChangesSaved: ', event);
        // TODO!! update the table model without reloading it
    }

}
