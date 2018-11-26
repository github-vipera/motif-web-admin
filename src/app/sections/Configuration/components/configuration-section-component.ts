import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PluginView } from 'web-console-core'
import { NGXLogger} from 'web-console-core'
import { SettingsService, ConfigurationsService, SettingUpdate, SettingCreate } from '@wa-motif-open-api/configuration-service'
import { MotifService, MotifServicesList, ConfigurationRow } from '../data/model'
import { ConfirmationDialogComponent } from 'src/app/components/ConfirmationDialog/confirmation-dialog-component';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import * as FileSaver from 'file-saver'
import { EditService, EditServiceConfiguration } from '../../../components/Grid/edit.service';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { map } from 'rxjs/operators/map';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigurationSectionEditFormComponent } from './editor-form.component'
import { WCToasterService } from 'web-console-ui-kit'
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin'

const LOG_TAG = "Configuration Section";

@Component({
    selector: 'wa-configuration-section',
    styleUrls: [ './configuration-section.component.scss' ],
    templateUrl: './configuration-section.component.html'
  })
  @PluginView("Configuration",{
    iconName: "ico-configuration" 
  })
export class ConfigurationSectionComponent implements OnInit {
    
    public view: Observable<GridDataResult>;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 10
    };
    public changes: any = {};


    // Data binding
    public servicesList:MotifServicesList = []; //the list of available services
    public loading:boolean = false;
    public editDataItem:ConfigurationRow;

    @ViewChild(ConfirmationDialogComponent) confirmationDialog : ConfirmationDialogComponent;
    @ViewChild(ComboBoxComponent) servicesComboBox: ComboBoxComponent;
    @ViewChild('datagrid') grid: GridComponent;
    @ViewChild('newPropertyDialog') propertyEditorDialog : ConfigurationSectionEditFormComponent;

    //Buttons
    public canSave:boolean = false;
    public canRefresh:boolean = false;
    public canExport:boolean = true;
    public canAddProperty:boolean = false;

    //internal
    private _selectedService:MotifService; //the combobox selection
    private _editServiceConfig:EditServiceConfiguration = { idField:"name" , dirtyField:"dirty", isNewField:"isNew"};
    public mySwitchModel : boolean = true;

    constructor(private logger: NGXLogger, 
        private settingsService:SettingsService,
        private configurationService:ConfigurationsService,
        public editService: EditService,
        private formBuilder: FormBuilder,
        private toaster: WCToasterService){
        this.logger.debug("Configuration Section" ,"Opening...");
    } 
    
    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug("Configuration Section" ,"Initializing...");
        //Reload the list of available configurable services
        this.refreshServiceList();

        this.view = this.editService.pipe(map(data => process(data, this.gridState)));
    }

    /**
     * Triggered by the grid component
     * @param state 
     */
    public onStateChange(state: State) {
        this.gridState = state;
        this.logger.debug("Configuration Section" ,"onStateChange: ", state);
        //this.editService.read();
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
                this.editService.cancelChanges();
                this.editService.read(data, this._editServiceConfig);
                this.loading = false;
            }, (error)=>{
                this.logger.error("Configuration Section" ,"reloadConfigurationParamsForService error: ", error);
                this.loading = false;
            });
        } else {
            this.editService.read([], this._editServiceConfig);
        }
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
            this.setOptions(false, false, true, false);
        }
    }

    public get selectedService():MotifService {
        return this._selectedService;
    }

    /**
     * Reload current configuration for the current selected service
     */
    private reloadConfigurationParams():void {
        this.reloadConfigurationParamsForService(this._selectedService);
    }

    /**
     * User selection on click
     * triggered by the grid
     * @param param0 
     */
    public cellClickHandler({ sender, rowIndex, columnIndex, dataItem, isEdited }): void {
        if (!isEdited) {
            sender.editCell(rowIndex, columnIndex, this.createFormGroupForEdit(dataItem));
        }
    }

    /**
     * triggered by the grid
     */
    public cellCloseHandler(args: any) {
        const { formGroup, dataItem } = args;
        if (!formGroup.valid) {
             // prevent closing the edited cell if there are invalid values.
            args.preventDefault();
        } else if (formGroup.dirty) {
            this.editService.assignValues(dataItem, formGroup.value);
            this.editService.update(dataItem);
        }
    }

    /**
     * Prepare edit form for inline editing
     */
    public createFormGroupForEdit(dataItem: ConfigurationRow): FormGroup {
        this.logger.debug("Configuration Section" ,"createFormGroupForEdit:", dataItem.value);
        return this.formBuilder.group({
            'value': dataItem.value
        });
    }

    /* Inline edit -> disabled
    public createFormGroupForNew(dataItem: ConfigurationRow): FormGroup {
        return this.formBuilder.group({
            'name': dataItem.name,
            'value': dataItem.value,
            'type': dataItem.type,
            'dynamic': dataItem.dynamic,
            'crypted': dataItem.crypted
        });
    }
    */

    /**
     * Export current configuration
     */
    private exportConfigurationFile() : void {
        this.configurationService.downloadXml().subscribe((data)=>{
            this.logger.debug("Configuration Section" ,"Export done:", data);

            let fileName = "motif_configuration_" + new Date().getTime() +".xml";
            FileSaver.saveAs(data, fileName);   
            this.logger.debug("Configuration Section" ,"Configuration saved: ", fileName);

            this.toaster.info("Export Done", "Configuration Export", {
                positionClass: 'toast-top-center'
              });
      
        }, (error)=>{
            this.logger.error("Configuration Section" ,"Export error:", error);
        });
    }

    /**
     * Event emitted by the editor form
     */
    onEditCancel():void {
        this.logger.debug("Configuration Section" ,"On Edit Cancelled");
        this.editDataItem = undefined;
    }

    /**
     * Button event
     */
    onRefreshClicked():void {
        if (this.editService.hasChanges()){
            this.confirmationDialog.open("Pending Changes",
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
        this.logger.debug("Configuration Section" ,"Save clicked");
        this.saveAllChanges().subscribe((responses)=>{
            this.logger.debug("Configuration Section" ,"Settings saved successfully: ", responses);
            this.toaster.info("Settings saved successfully.", "Settings Update", {
                positionClass: 'toast-top-center'
              });
        }, (error)=>{
            this.logger.debug("Configuration Section" ,"Error saving settings: ", error);
            this.toaster.info("Error saving settings: " +  error, "Settings Update Error", {
                positionClass: 'toast-top-center'
            });
        });
        }

    private saveAllChanges():Observable<any[]> {
        this.logger.debug("Configuration Section" ,"Saving all changes...");

        let itemsToAdd = this.editService.createdItems;
        let itemsToUpdate = this.editService.updatedItems;
        let itemsToRemove = this.editService.deletedItems;
        
        let responses = [];

        let i = 0;  

        //Add new
        for (i=0;i<itemsToAdd.length;i++){
            let settingCreate : SettingCreate = {
                name : itemsToAdd[i].name,
                crypted : itemsToAdd[i].crypted,
                dynamic : itemsToAdd[i].dynamic,
                type : itemsToAdd[i].type,
                value : itemsToAdd[i].value
            };
            let response = this.settingsService.createSetting(this.selectedService.name, settingCreate);
            responses.push(response);
        }

        //Update existing
        for (i=0;i<itemsToUpdate.length;i++){
            let settingName = itemsToUpdate[i].name;
            let settingUpdate : SettingUpdate = {
                crypted : itemsToUpdate[i].crypted,
                dynamic : itemsToUpdate[i].dynamic,
                type : itemsToUpdate[i].type,
                value : itemsToUpdate[i].value
            };
            let response = this.settingsService.updateSetting(this.selectedService.name, settingName, settingUpdate);
            responses.push(response);
        }

        //Delete existing
        for (i=0;i<itemsToRemove.length;i++){
            let settingName = itemsToRemove[i].name;
            let response = this.settingsService.deleteSetting(this.selectedService.name,settingName);
            responses.push(response);
        }
        
        this.logger.debug("Configuration Section" ,"Waiting for all changes commit.");
        return forkJoin(responses);
    }


    /**
     * Button Event
     */
    onDiscardClicked():void {
        if (this.editService.hasChanges()){
            this.confirmationDialog.open("Pending Changes",
                "Attention, in the configuration there are unsaved changes. Proceeding all these changes will be lost. Do you want to continue?",
                { "action" : "discardChanges" });
        } else {
            this.reloadConfigurationParams();
        }
    }

    /**
     * Button event
     */
    onExportClicked(): void {
        this.logger.debug("Configuration Section" ,"Export clicked");
        this.exportConfigurationFile();
    }

    /**     
     * Button event
     */
    onImportClicked():void {
        this.logger.debug("Configuration Section" ,"Import clicked");
        this.toaster.info("Not yet implemented", "Attention Please", {
            positionClass: 'toast-top-center'
          });
          //TODO!!
    }

    /**
     * Button event
     */
    onAddPropertyClicked(): void {
        //display new item dialog
        this.propertyEditorDialog.isNew = true;
        let newConfigurationRow = new ConfigurationRow();
        newConfigurationRow.isNew = true;
        this.editDataItem = newConfigurationRow;
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
        if (userData && userData.action==="discardChanges"){
            this.editService.cancelChanges();
        }
    }

    /**
     * Triggered by the new Property Editor Dialog
     * @param event 
     */
    onEditCommit(newConfigurationRow:ConfigurationRow):void {
        this.logger.debug("Configuration Section" ,"onEditCommit new row:", newConfigurationRow);
        this.editService.create(newConfigurationRow);
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

    /**
     * Triggered by the grid delete button
     * @param dataItem 
     */
    onDeleteOKPressed(dataItem:ConfigurationRow):void {
        this.logger.debug(LOG_TAG ,"onDeleteOKPressed for item: ", dataItem);
        this.editService.remove(dataItem);
        /*
        this.toaster.info("Not yet implemented", "Attention Please", {
          positionClass: 'toast-top-center'
        });
        */
      }
    
}
