import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { GridEditorCommandComponent, GridEditorCommandComponentEvent } from '../grid-editor-command/grid-editor-command-component';

export { GridEditorCommandComponentEvent } from '../grid-editor-command/grid-editor-command-component';

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
    // row data
    @Input() dataItem:any;
    @Input() rowIndex:number;
    @Input() columnIndex:number;
    @Input() column:number;
    @Input() value:any;

    @Input() public contentStyle: string;
    @Input() public alignMode = 'center';

    @Output() commandClick:EventEmitter<GridEditorCommandComponentEvent> = new EventEmitter<GridEditorCommandComponentEvent>();
    @Output() commandConfirm:EventEmitter<GridEditorCommandComponentEvent> = new EventEmitter<GridEditorCommandComponentEvent>();
    @Output() commandCancel:EventEmitter<GridEditorCommandComponentEvent> = new EventEmitter<GridEditorCommandComponentEvent>();
    @Output() actionStatusChange:EventEmitter<GridEditorCommandComponentEvent> = new EventEmitter<GridEditorCommandComponentEvent>();

    constructor() {}

    onCommandClick(event: GridEditorCommandComponentEvent) {
        this.commandClick.emit(event);
    }

    onCommandConfirm(event: GridEditorCommandComponentEvent) {
        this.commandConfirm.emit(event);
    }

    onCommandCancel(event: GridEditorCommandComponentEvent) {
        this.commandCancel.emit(event);
    }

    onActionStatusChange(event: GridEditorCommandComponentEvent) {
        this.actionStatusChange.emit(event);
    }


}
