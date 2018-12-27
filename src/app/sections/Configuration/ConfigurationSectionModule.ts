import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import { ConfigurationServiceModule } from '@wa-motif-open-api/configuration-service'
import { ConfigurationSectionComponent } from './components/configuration-section-component'
import { LoggerModule } from 'web-console-core'
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit'
import { EditService } from '../../components/Grid/edit.service';
import { CommonsUIModule } from '../../components/CommonsUIModule'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { DialogModule } from 'primeng/dialog';
import { NewConfigurationParamDialogComponent } from './components/dialog/new-configuration-param-dialog'

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
        FontAwesomeModule
    ],
    entryComponents:[
        ConfigurationSectionComponent
    ],
    declarations: [
        ConfigurationSectionComponent, NewConfigurationParamDialogComponent
    ],
    exports: [ ConfigurationSectionComponent ],
    providers: [ 
        EditService
    ]
    
  })
  export class ConfigurationSectionModule { }
  


