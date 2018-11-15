import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PluginView } from 'web-console-core'
import { LoggerModule, NGXLogger, NgxLoggerLevel } from 'web-console-core'

@Component({
    selector: 'wa-configuration-section',
    styleUrls: [ './configuration-section.component.scss' ],
    templateUrl: './configuration-section.component.html'
  })
  @PluginView("Configuration",{
    iconName: "ico-configuration" 
  })
export class ConfigurationSectionComponent implements OnInit {

    constructor(private logger: NGXLogger){
        this.logger.info("AppModule" ,"Starting application");
    } 
    
    ngOnInit() {
    }
    


}
