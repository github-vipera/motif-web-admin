import { Component, Input, ViewChild } from '@angular/core';
import { GridEditorCommandComponent, GridEditorCommandComponentEvent } from '../grid-editor-command/grid-editor-command-component';


export interface GridEditorCommandConfig {
    commandId: string;
    commandIcon: string;
    title?: string;
    hasConfirmation?: boolean;
    confirmationTitle?: string;
}

export interface GridEditorCommandsConfig extends Array<GridEditorCommandConfig>{}

@Component({
    selector: 'wc-grid-editor-commands-group',
    styleUrls: [ './grid-editor-commands-group-component.scss' ],
    templateUrl: './grid-editor-commands-group-component.html'
})
export class GridEditorCommandsGroupComponent {

    @Input() commands: GridEditorCommandsConfig;

    @Input() public contentStyle: string;
    @Input() public alignMode = 'center';

    constructor() {}

    onCommandClick(event: GridEditorCommandComponentEvent) {
        console.log(">>>>>> onCommandClick:", event);
        // TODO!!! Emit
    }

    onCommandConfirm(event: GridEditorCommandComponentEvent) {
        console.log(">>>>>> onCommandConfirm:", event);
        // TODO!!! Emit
    }

    onCommandCancel(event: GridEditorCommandComponentEvent) {
        console.log(">>>>>> onCommandCancel:", event);
        // TODO!!! Emit
    }

    onActionStatusChange(event: GridEditorCommandComponentEvent) {
        console.log(">>>>>> onActionStatusChange:", event);
        // TODO!!! Emit
    }


}
