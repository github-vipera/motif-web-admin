import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PluginView } from 'web-console-core'
import { NGXLogger} from 'web-console-core'
import { SettingsService } from '@wa-motif-open-api/configuration-service'
import { MotifService, MotifServicesList, ConfigurationRow } from '../data/model'

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
    opened:boolean = false;

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
    private reloadConfigurationParams(service:MotifService){
        this.logger.debug("Configuration Section", "Reloading paramters for service:", service);
        this.loading = true;
        this.settingsService.getSettings(service.name).subscribe((data)=>{
            this.logger.debug("Configuration Section" ,"reloadConfigurationParams done: ", data);
            this.gridData = data;
            this.loading = false;
        }, (error)=>{
            this.logger.error("Configuration Section" ,"reloadConfigurationParams error: ", error);
            this.loading = false;
        });
    }
    
    /**
     * User selection from Combobox
     */
    @Input()
    public set selectedService(service:MotifService){
        this._selectedService = service;
        if (this._selectedService){
            this.reloadConfigurationParams(this._selectedService);
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
        this._selectedRowData.dirty = true;
        this.opened = true;
        //TODO!!
    }

}
