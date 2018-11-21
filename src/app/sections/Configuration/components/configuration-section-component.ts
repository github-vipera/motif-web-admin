import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { PluginView } from 'web-console-core'
import { NGXLogger} from 'web-console-core'
import { SettingsService } from '@wa-motif-open-api/configuration-service'
import { MotifService, MotifServicesList, ConfigurationRow } from '../data/model'
import { ConfirmationDialogComponent } from 'src/app/components/ConfirmationDialog/confirmation-dialog-component';

@Component({
    selector: 'wa-configuration-section',
    styleUrls: [ './configuration-section.component.scss' ],
    templateUrl: './configuration-section.component.html'
  })
  @PluginView("Configuration",{
    iconName: "ico-configuration" 
  })
export class ConfigurationSectionComponent implements OnInit {
 
    servicesList:MotifServicesList = []; //the list of available services
    _selectedService:MotifService; //the combobox selection
    _selectedRowIndex:number = -1;
    _selectedRowData:ConfigurationRow;
    gridData = [];
    loading:boolean = false;
    editDataItem:ConfigurationRow;
    _dirty:boolean = false;
    @ViewChild(ConfirmationDialogComponent) confirmationDialog : ConfirmationDialogComponent;

    constructor(private logger: NGXLogger, private settingsService:SettingsService){
        this.logger.debug("Configuration Section" ,"Opening...");
    } 
    
    ngOnInit() {
        this.logger.debug("Configuration Section" ,"Initializing...");
        //Reload the list of available configurable services
        this.refreshServiceList();
    }

    /**
     * Reload the list of availbale configurable services
     */
    public refreshServiceList():void {
        this.logger.debug("Configuration Section" ,"refreshServiceList called.");
        this.settingsService.getServices().subscribe((response)=>{
            this.servicesList = response;
            this.logger.debug("Configuration Section" ,"refreshServiceList done: ", response);
        }, (error)=>{
            this.servicesList = [];
            this.logger.error("Configuration Section" ,"refreshServiceList error: ", error);
        });
    }

    /**
     * Reload the list of parameters for a given service
     * @param service 
     */
    private reloadConfigurationParamsForService(service:MotifService){
        this.logger.debug("Configuration Section", "Reloading paramters for service:", service);
        this.loading = true;
        this.settingsService.getSettings(service.name).subscribe((data)=>{
            this.logger.debug("Configuration Section" ,"reloadConfigurationParamsForService done: ", data);
            this.gridData = data;
            this.loading = false;
        }, (error)=>{
            this.logger.error("Configuration Section" ,"reloadConfigurationParamsForService error: ", error);
            this.loading = false;
        });
    }
    
    /**
     * User selection from Combobox
     */
    @Input()
    public set selectedService(service:MotifService){
        this._selectedService = service;
        this.reloadConfigurationParams();
    }

    private reloadConfigurationParams():void {
        if (this._selectedService){
            this.reloadConfigurationParamsForService(this._selectedService);
        } else {
            this.gridData = [];
        }
    }

    /**
     * User selection on click
     * @param param0 
     */
    public editClick({ dataItem, rowIndex, columnIndex }: any): void {
        this._selectedRowData = dataItem;
        this._selectedRowIndex = rowIndex;
    }

    /**
     * Trigger the Edit Row
     */
    public doubleClickFunction(){
        this.logger.debug("Configuration Section" ,"Double click on ", this._selectedRowData);
        //Open the editor
        this.editDataItem = this._selectedRowData;
    }

    /**
     * Event emitted by the editor form
     */
    onEditCancel():void {
        this.logger.debug("Configuration Section" ,"On Edit Cancelled");
        this.editDataItem = undefined;
    }

    /**
     * Event emitted by the editor form
     * @param configurationRow  the new value
     */
    onEditCommit(configurationRow:ConfigurationRow):void {
        this.logger.debug("Configuration Section" ,"On Edit Committed for ", configurationRow);
        this._selectedRowData = configurationRow;
        this._selectedRowData.dirty = true;
        this.gridData[this._selectedRowIndex] = this._selectedRowData;
        this.editDataItem = undefined;
        this._dirty = true;
    }

    /**
     * Button event
     */
    onRefreshClicked():void {
        if (this._dirty){
            this.confirmationDialog.open("Warning",
                "Attention, in the configuration there are unsaved changes. Proceeding with the refresh these changes will be lost. Do you want to continue?",
                { "action" : "refresh" });
        } else {
            this.reloadConfigurationParams();
        }
    }

    onSaveClicked():void {
        this.logger.debug("Configuration Section" ,"onSaveClicked");
        this.confirmationDialog.open("Warning",
            "Attention, in the configuration there are unsaved changes. Proceeding with the refresh these changes will be lost. Do you want to continue?",
            { "action" : "refresh" });
    }

    onExportClicked(): void{
        alert("onExportClicked!");
    }

    onAddPropertyClicked(): void{
        alert("onAddPropertyClicked!");
    }

    onConfirmationCancel(userData):void {
        this.logger.debug("Configuration Section" ,"onConfirmationCancel for:", userData);
    }

    onConfirmationOK(userData):void {
        this.logger.debug("Configuration Section" ,"onConfirmationOK for:", userData);

        if (userData && userData.action==="refresh"){
            this.reloadConfigurationParams();
        }
    }
}
