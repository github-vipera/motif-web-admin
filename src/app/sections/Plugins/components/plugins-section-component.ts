import { Component, OnInit, ViewChild, Renderer, ElementRef, Renderer2} from '@angular/core';
import { PluginView } from 'web-console-core'
import { NGXLogger} from 'web-console-core'
import { RegistryService, PluginList, Plugin } from '@wa-motif-open-api/plugin-registry-service'
import { SafeStyle } from '@angular/platform-browser';

const LOG_TAG = "[PluginsSection]";

@Component({
    selector: 'wa-log-section',
    styleUrls: [ './plugins-section-component.scss' ],
    templateUrl: './plugins-section-component.html'
  })
  @PluginView("Plugins",{
    iconName: "ico-plugins" 
})
export class PluginsSectionComponent implements OnInit {

    public data:PluginList;

    constructor(private logger: NGXLogger,
        private registryService:RegistryService){
        this.logger.debug(LOG_TAG ,"Opening...");
    } 
    
    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG ,"Initializing...");
    }

    public onRefreshClicked():void {
        this.logger.debug(LOG_TAG ,"Refresh clicked");
        this.refreshData();
    }

    public refreshData(){
        this.registryService.getPlugins(true, 'REGISTERED').subscribe((data:PluginList)=>{
            this.data = data;
            console.log("refreshData: ", data);
        }, (error)=>{
            console.error("refreshData error: ", error);
        });
    }

    public statusColorCode(plugin:Plugin):SafeStyle {
        if (plugin.status === 'ACTIVE'){
            return '#1ab31a'
        } else {
            return "inherit";
        }
    }

}
