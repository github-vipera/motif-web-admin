import { CommonsUIModule } from './../../CommonsUIModule';
import { WCUploadPanelComponent } from './wc-upload-panel-component';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { WCUIKitCoreModule } from 'web-console-ui-kit';

@NgModule({
    imports: [
        CommonModule, CommonsUIModule, WCUIKitCoreModule
    ],
    entryComponents: [
    ],
    declarations: [
        WCUploadPanelComponent
    ],
    exports: [ WCUploadPanelComponent, WCUploadPanelComponent
    ],
    providers: [
    ]

  })
  export class UploadPanelModule { }



