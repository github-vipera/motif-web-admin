import { CommonsUIModule } from './../../CommonsUIModule';
import { WCUploadPanelComponent } from './wc-upload-panel-component';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        CommonModule, CommonsUIModule
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



