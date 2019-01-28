import { UploadPanelModule } from 'src/app/components/UI/wc-upload-panel-component/UploadPanelModule';
import { WebContentUpdateDialogComponent } from './components/dialog/webcontent-update-dialog';
import { CommonSelectorsModule } from './../../components/CommonsSelectorsModule';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { LoggerModule } from 'ngx-logger'
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule, WCGridModule } from 'web-console-ui-kit'
import { CommonsUIModule } from '../../components/CommonsUIModule'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { InputSwitchModule } from 'primeng/inputswitch';
import { WebContentSectionComponent } from './components/webcontent-section-component';
import { WebContentServiceModule } from '@wa-motif-open-api/web-content-service';
import { DialogModule } from 'primeng/dialog';

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
        DialogModule,
        UploadPanelModule,
        WCGridModule
    ],
    entryComponents: [
        WebContentSectionComponent
    ],
    declarations: [
        WebContentSectionComponent, WebContentUpdateDialogComponent
    ],
    exports: [ WebContentSectionComponent ],
    providers: [ 
    ]
    
  })
  export class WebContentSectionModule { }
  


