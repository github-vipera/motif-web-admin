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

    @ViewChild('cmd1') cmd1: GridEditorCommandComponent;
    @ViewChild('cmd2') cmd2: GridEditorCommandComponent;
    @ViewChild('cmd3') cmd3: GridEditorCommandComponent;
    @ViewChild('cmd4') cmd4: GridEditorCommandComponent;

    @Input() public contentStyle: string;
    @Input() public alignMode = 'center';

    constructor() {}

    onCommandClick(event: GridEditorCommandComponentEvent) {
        console.log(">>>>>> onCommandClick:", event);
    }

    onCommandConfirm(event: GridEditorCommandComponentEvent) {
        console.log(">>>>>> onCommandConfirm:", event);
    }

    onCommandCancel(event: GridEditorCommandComponentEvent) {
        console.log(">>>>>> onCommandCancel:", event);
    }

    onActionStatusChange(event: GridEditorCommandComponentEvent) {
        if (event.id === 'cmd1') {
            this.cmd2.disabled = event.actionDisplay;
            this.cmd3.disabled = event.actionDisplay;
            this.cmd4.disabled = event.actionDisplay;
        } else if (event.id === 'cmd2') {
            this.cmd1.disabled = event.actionDisplay;
            this.cmd3.disabled = event.actionDisplay;
            this.cmd4.disabled = event.actionDisplay;
        } else if (event.id === 'cmd3') {
            this.cmd1.disabled = event.actionDisplay;
            this.cmd2.disabled = event.actionDisplay;
            this.cmd4.disabled = event.actionDisplay;
        } else if (event.id === 'cmd4') {
            this.cmd1.disabled = event.actionDisplay;
            this.cmd2.disabled = event.actionDisplay;
            this.cmd3.disabled = event.actionDisplay;
        }
    }


}
