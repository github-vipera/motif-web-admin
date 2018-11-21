import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { PluginView } from 'web-console-core'
import { NGXLogger} from 'web-console-core'
import { SettingsService } from '@wa-motif-open-api/configuration-service'
import { MotifService, MotifServicesList, ConfigurationRow } from '../data/model'
import { ConfirmationDialogComponent } from 'src/app/components/ConfirmationDialog/confirmation-dialog-component';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

@Component({
    selector: 'wa-configuration-section',
    styleUrls: [ './configuration-section.component.scss' ],
    templateUrl: './configuration-section.component.html'
  })
  @PluginView("Configuration",{
    iconName: "ico-configuration" 
  })
export class ConfigurationSectionComponent implements OnInit {
    
    // Data binding
    public servicesList:MotifServicesList = []; //the list of available services
    public gridData = [];
    public loading:boolean = false;
    public editDataItem:ConfigurationRow;
    public refreshCaption:string = "Refresh";
    
    @ViewChild(ConfirmationDialogComponent) confirmationDialog : ConfirmationDialogComponent;
    @ViewChild(ComboBoxComponent) servicesComboBox: ComboBoxComponent;

    //Buttons
    public isNewProperty : boolean = false;
    public canSave:boolean = false;
    public canRefresh:boolean = false;
    public canExport:boolean = false;
    public canAddProperty:boolean = false;

    //internal
    private _dirty:boolean = false;
    private _selectedService:MotifService; //the combobox selection
    private _selectedRowIndex:number = -1;
    private _selectedRowData:ConfigurationRow;

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
        if (service){
            this.loading = true;
            this.settingsService.getSettings(service.name).subscribe((data)=>{
                this.logger.debug("Configuration Section" ,"reloadConfigurationParamsForService done: ", data);
                this.gridData = data;
                this.loading = false;
            }, (error)=>{
                this.logger.error("Configuration Section" ,"reloadConfigurationParamsForService error: ", error);
                this.loading = false;
            });
        } else {
            this.gridData = [];
        }
        this.selectRow(undefined,-1);
        this.setDirty(false);
        this.setOptions(true, true, true, true);
    }
    
    /**
     * User selection from Combobox
     */
    @Input()
    public set selectedService(service:MotifService){
        this._selectedService = service;
        this.reloadConfigurationParams();
        if (service){
            this.setOptions(true, true, true, true);
        } else {
            this.setOptions(false, false, false, false);
        }
    }

    /**
     * Reload current configuration for the current selected service
     */
    private reloadConfigurationParams():void {
        this.reloadConfigurationParamsForService(this._selectedService);
    }

    /**
     * User selection on click
     * @param param0 
     */
    public editClick({ dataItem, rowIndex, columnIndex }: any): void {
        this.selectRow(dataItem,  rowIndex);
    }

    /**
     * Set the current selection
     * @param dataItem 
     * @param rowIndex 
     */
    private selectRow(dataItem, rowIndex):void {
        this._selectedRowData = dataItem;
        this._selectedRowIndex = rowIndex;
    }

    /**
     * Trigger the Edit Row
     */
    public doubleClickFunction(){
        this.logger.debug("Configuration Section" ,"Double click on ", this._selectedRowData);
        //Open the editor
        this.isNewProperty = false;
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
        this.setDirty(true);
        this.setOptions(true, true, false, true);
    }   

    /**
     * Set the dirty flag that indicates that some changes are made on current dataset
     * @param dirty 
     */
    private setDirty(dirty:boolean):void{
        if (dirty){
            this._dirty = true;
            this.servicesComboBox.disabled = true;
            this.refreshCaption = "Revert Changes";
        } else {
            this._dirty = false;
            this.servicesComboBox.disabled = false;
            this.refreshCaption = "Refresh";
        }
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

    /**
     * Button event
     */
    onSaveClicked():void {
        alert("onSaveClicked!");
    }

    /**
     * Button event
     */
    onExportClicked(): void{
        alert("onExportClicked!");
    }

    /**
     * Button event
     */
    onAddPropertyClicked(): void{
        //alert("onAddPropertyClicked!");
        //Open the editor
        let newDataItem = new ConfigurationRow();
        this.isNewProperty = true;
        this.editDataItem = newDataItem;
    }

    /**
     * Event emitted by the confirmation dialog
     * @param userData 
     */
    onConfirmationCancel(userData):void {
        this.logger.debug("Configuration Section" ,"onConfirmationCancel for:", userData);
    }

    /**
     * Event emitted by the confirmation dialog
     * @param userData 
     */
    onConfirmationOK(userData):void {
        this.logger.debug("Configuration Section" ,"onConfirmationOK for:", userData);

        if (userData && userData.action==="refresh"){
            this.reloadConfigurationParams();
        }
    }

    /**
     * Enable or disable buttons
     * @param canSave 
     * @param canRefresh 
     * @param canExport 
     * @param canAddProperty 
     */
    private setOptions(canSave:boolean, canRefresh:boolean, canExport:boolean, canAddProperty:boolean) : void {
        this.canSave = canSave;
        this.canRefresh = canRefresh;
        this.canExport = canExport;
        this.canAddProperty = canAddProperty;
    }

}
