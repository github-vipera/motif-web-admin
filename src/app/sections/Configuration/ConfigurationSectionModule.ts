import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import { ConfigurationServiceModule } from '@wa-motif-open-api/configuration-service'
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ConfigurationSectionComponent } from './components/configuration-section-component'
import { LoggerModule } from 'web-console-core'
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit'
import { ConfigurationSectionEditFormComponent } from './components/editor-form.component'
//import { ConfirmationDialogComponent } from '../../components/ConfirmationDialog/confirmation-dialog-component'
import { EditService } from '../../components/Grid/edit.service';
import { CommonsUIModule } from '../../components/CommonsUIModule'

@NgModule({
    imports: [
        DialogModule, 
        ConfigurationServiceModule, 
        GridModule, 
        LoggerModule, 
        WebConsoleUIKitCoreModule, 
        WebConsoleUIKitDataModule, 
        WebConsoleUIKitKendoProviderModule,
        CommonsUIModule
    ],
    entryComponents:[
        ConfigurationSectionComponent
    ],
    declarations: [
        ConfigurationSectionComponent, ConfigurationSectionEditFormComponent
    ],
    exports: [ ConfigurationSectionComponent ],
    providers: [ 
        EditService
    ]
    
  })
  export class ConfigurationSectionModule { }
  


