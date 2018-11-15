import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PluginView } from 'web-console-core'
import { LoggerModule, NGXLogger, NgxLoggerLevel } from 'web-console-core'
import { ConfigurationsService } from '@wa-motif-open-api/configuration-service'

@Component({
    selector: 'wa-configuration-section',
    styleUrls: [ './configuration-section.component.scss' ],
    templateUrl: './configuration-section.component.html'
  })
  @PluginView("Configuration",{
    iconName: "ico-configuration" 
  })
export class ConfigurationSectionComponent implements OnInit {

    constructor(private logger: NGXLogger, private configurationService:ConfigurationsService){
        this.logger.info("Configuration Section" ,"Opening...");
    } 
    
    ngOnInit() {
    }
    


}
