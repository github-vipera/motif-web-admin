import { GridEditorCommandsModule } from './../../components/GridEditorCommandsModule';
import { CommonSelectorsModule } from './../../components/CommonsSelectorsModule';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { LoggerModule } from 'web-console-core'
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit'
import { EditService } from '../../components/Grid/edit.service';
import { CommonsUIModule } from '../../components/CommonsUIModule'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { InputSwitchModule } from 'primeng/inputswitch';
import { WebContentSectionComponent } from './components/webcontent-section-component';
import { WebContentServiceModule } from '@wa-motif-open-api/web-content-service';

@NgModule({
    imports: [
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
        WebContentServiceModule,
        GridEditorCommandsModule
    ],
    entryComponents: [
        WebContentSectionComponent
    ],
    declarations: [
        WebContentSectionComponent
    ],
    exports: [ WebContentSectionComponent ],
    providers: [ 
        EditService
    ]
    
  })
  export class WebContentSectionModule { }
  

