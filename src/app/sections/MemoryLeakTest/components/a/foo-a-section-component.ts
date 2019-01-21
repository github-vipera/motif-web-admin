import { ServiceCatalogSelectorComponent, ServiceCatalogNodeSelectionEvent } from './../../../../components/UI/selectors/service-catalog-selector/service-catalog-selector-component';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PluginView } from 'web-console-core';
import { NGXLogger} from 'web-console-core';

import {
    GridDataResult
} from '@progress/kendo-angular-grid';
import * as _ from 'lodash';
import { MenuItem, TreeNode } from 'primeng/api';

const LOG_TAG = '[FooASection]';

@Component({
    selector: 'foo-a-section-component',
    styleUrls: [ './foo-a-section-component.scss' ],
    templateUrl: './foo-a-section-component.html'
  })
  @PluginView('FooA', {
    iconName: 'ico-plugins'
})
export class FooASectionComponent implements OnInit, OnDestroy {

    @ViewChild('serviceCatalog') serviceCatalog: ServiceCatalogSelectorComponent;
    menuItems: MenuItem[];
    // Menus
    private _deleteMenuItem: MenuItem;
    private _addDomainMenuItem: MenuItem;
    private _addApplicationMenuItem: MenuItem;
    private _addServiceMenuItem: MenuItem;
    private _addOperationMenuItem: MenuItem;
    private _addMenuItem: MenuItem;

    constructor(private logger: NGXLogger) {
        this.logger.debug(LOG_TAG , 'Opening...');
        
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

    onDeleteSelectedNode(){
        alert("onDeleteSelectedNode");
    }

    onAddDomainClick() {
        alert("onAddDomainClick");
    }

    onAddApplicationClick(){
        alert("onAddApplicationClick");
    }

    onAddServiceClick(){
        alert("onAddServiceClick");
    }

    onAddOperationClick(){
        alert("onAddOperationClick");
    }

    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG , 'Initializing...');
        this.serviceCatalog.reloadData();
    }

    ngOnDestroy() {
        this.logger.debug(LOG_TAG , 'ngOnDestroy ');
    }

    nodeSelect(nodeEvent: ServiceCatalogNodeSelectionEvent) {
        this.logger.debug(LOG_TAG, 'Node selected: ', nodeEvent);

        const catalogEntry = nodeEvent.node.data;
        const nodeType = nodeEvent.node.nodeType;

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
}
