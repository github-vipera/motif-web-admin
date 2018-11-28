import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '@progress/kendo-angular-grid';
import { SecurityServiceModule } from '@wa-motif-open-api/security-service'
import { DialogModule } from '@progress/kendo-angular-dialog';
import { SessionsSectionComponent } from './components/sessions-section-component'
import { LoggerModule } from 'web-console-core'
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit'
import { EditService } from '../../components/Grid/edit.service';

@NgModule({
    imports: [
        DialogModule, 
        SecurityServiceModule, 
        GridModule, 
        LoggerModule, 
        WebConsoleUIKitCoreModule, 
        WebConsoleUIKitDataModule, 
        WebConsoleUIKitKendoProviderModule
    ],
    entryComponents:[
        SessionsSectionComponent
    ],
    declarations: [
        SessionsSectionComponent
    ],
    exports: [ SessionsSectionComponent ],
    providers: [ 
        EditService
    ]
    
  })
  export class SessionsSectionModule { }
  


