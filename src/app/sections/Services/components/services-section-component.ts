import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { PluginView } from 'web-console-core'
import { NGXLogger } from 'web-console-core'
import { RegistryService, PluginList, Plugin } from '@wa-motif-open-api/plugin-registry-service'
import { SortDescriptor, orderBy, GroupDescriptor, process, DataResult } from '@progress/kendo-data-query';
import { faGlobe, faArchive, faBoxOpen, faCompass, faDesktop } from '@fortawesome/free-solid-svg-icons';
import { DomainsService, Domain, ApplicationsService, ApplicationsList, Application } from '@wa-motif-open-api/platform-service'
import { WCPropertyEditorModel, WCPropertyEditorComponent, WCPropertyEditorItem, WCPropertyEditorItemType } from 'web-console-ui-kit'
import { ServiceCatalogService } from '../../../services/ServiceCatalogService'
import { TreeNode } from 'primeng/api';
import { ServiceCatalogTableModel } from '../data/model';

import {
    GridComponent,
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';

import * as _ from 'lodash';
import { faLessThan } from '@fortawesome/free-solid-svg-icons';

const LOG_TAG = "[ServicesSection]";

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

    public propertyModel:WCPropertyEditorModel = {
        items: [
          {
            name: "Description",
            field: "description",
            type: WCPropertyEditorItemType.String,
            value: "Vipera platform secure"
          },
          {
            name: "Offline",
            field: "offline",
            type: WCPropertyEditorItemType.Boolean,
            value: true
          },
          {
            name: "OTP expiry",
            field: "otpExpiry",
            type: WCPropertyEditorItemType.String,
            value: "-1"
          },
          {
            name: "Disabled Value",
            field: "disabledValue",
            type: WCPropertyEditorItemType.String,
            value: "this is disabled",
            disabled:true
          },
          {
            name: "Age",
            field: "age",
            type: WCPropertyEditorItemType.String,
            value: "45",
            htmlInputType: "number"
          },
          {
            name: "Car Type",
            field: "carType",
            type: WCPropertyEditorItemType.List,
            value: "BMW",
            listValues: ["Audi", "Mercedes", "Alfa Romeo", "BMW", "Mini Cooper"]
          }
    
        ]
      }

    @Input() tableModel: ServiceCatalogTableModel;

    public loading: boolean;
    private _currentRowElement: any;

    constructor(private logger: NGXLogger,
        private registryService: RegistryService,
        private serviceCatalogService: ServiceCatalogService) {
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
            this.logger.debug(LOG_TAG, 'getServiceCatalog services: ', data);
            this.logger.debug(LOG_TAG, 'getServiceCatalog services: ', JSON.stringify(data));
            this.tableModel.loadData(data);
            this.logger.debug(LOG_TAG, 'getServiceCatalog model: ', this.tableModel.model);
            this.loading = false;
        });
    }

    @Input() onSavePropertiesPressed(): void {
        // TODO!!
    }

}
