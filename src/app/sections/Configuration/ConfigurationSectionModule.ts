import { CommonSelectorsModule } from './../../components/CommonsSelectorsModule';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { ConfigurationServiceModule } from '@wa-motif-open-api/configuration-service'
import { ConfigurationSectionComponent } from './components/configuration-section-component'
import { LoggerModule } from 'ngx-logger';
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule, WCGridModule } from 'web-console-ui-kit'
import { CommonsUIModule } from '../../components/CommonsUIModule'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { DialogModule } from 'primeng/dialog';
import { NewConfigurationParamDialogComponent } from './components/dialog/new-configuration-param-dialog'
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
    imports: [
        DialogModule, 
        ConfigurationServiceModule, 
        GridModule, 
        LoggerModule, 
        WebConsoleUIKitCoreModule, 
        WebConsoleUIKitDataModule, 
        WebConsoleUIKitKendoProviderModule,
        CommonsUIModule,
        FontAwesomeModule,
        InputSwitchModule,
        FormsModule,
        CommonSelectorsModule,
        WCGridModule
    ],
    entryComponents: [
        ConfigurationSectionComponent
    ],
    declarations: [
        ConfigurationSectionComponent, NewConfigurationParamDialogComponent
    ],
    exports: [ ConfigurationSectionComponent ],
    providers: [ 
    ]
    
  })
  export class ConfigurationSectionModule { }
  


