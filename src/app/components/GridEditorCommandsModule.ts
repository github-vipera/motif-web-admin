import { NgModule } from '@angular/core';
import { GridEditorCommandsGroupComponent } from './Grid/grid-editor-commands-group/grid-editor-commands-group-component';
import { GridEditorCommandComponent } from './Grid/grid-editor-command/grid-editor-command-component';
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        CommonModule
    ],
    entryComponents: [
    ],
    declarations: [
        GridEditorCommandsGroupComponent, GridEditorCommandComponent
    ],
    exports: [ GridEditorCommandsGroupComponent, GridEditorCommandComponent
    ],
    providers: [
    ]

  })
  export class GridEditorCommandsModule { }



