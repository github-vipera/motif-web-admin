import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PluginView } from 'web-console-core'
import { LoggerModule, NGXLogger, NgxLoggerLevel } from 'web-console-core'
import { SettingsService } from '@wa-motif-open-api/configuration-service'

export interface MotifService {
    id:string;
    name:string;
    description:string;
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
    selectedService:MotifService; //the combobox selection

    constructor(private logger: NGXLogger, private settingsService:SettingsService){
        this.logger.info("Configuration Section" ,"Opening...");
    } 
    
    ngOnInit() {
        this.logger.debug("Configuration Section" ,"Initializing...");

        this.refreshServiceList();
    }

    public refreshServiceList():void {
        this.logger.debug("Configuration Section" ,"refreshServiceList called.");
        this.settingsService.getServices().subscribe((response)=>{
            this.logger.debug("Configuration Section" ,"refreshServiceList done: ", response);
        }, (error)=>{
            this.logger.error("Configuration Section" ,"refreshServiceList error: ", error);
        });

        this.servicesList = [
            { "id": "123456", "name":"pippo", "description" : "pippo desc"},
            { "id": "123457", "name":"pluto", "description" : "pluto desc"}
        ];
    }
    


}
