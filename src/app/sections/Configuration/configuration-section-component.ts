import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PluginView } from 'web-console-core'
import { LoggerModule, NGXLogger, NgxLoggerLevel } from 'web-console-core'
import { SettingsService } from '@wa-motif-open-api/configuration-service'

export interface MotifService {
    name:string;
}

export interface MotifServicesList extends Array<MotifService> {
}

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
    
    constructor(private logger: NGXLogger, private settingsService:SettingsService){
        this.logger.info("Configuration Section" ,"Opening...");
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
        this.settingsService.getSettings(service.name).subscribe((data)=>{
            this.logger.debug("Configuration Section" ,"reloadConfigurationParams done: ", data);
        }, (error)=>{
            this.logger.error("Configuration Section" ,"reloadConfigurationParams error: ", error);
        });
    }
    
    @Input()
    public set selectedService(service:MotifService){
        this._selectedService = service;
        if (this._selectedService){
            this.reloadConfigurationParams(this._selectedService);
        } else {
            //TODO!!
        }
    }

}
