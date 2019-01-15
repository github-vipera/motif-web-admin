import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as uuidv1 from 'uuid/v1';
import { id } from '@swimlane/ngx-charts/release/utils';
import { OuterSubscriber } from 'rxjs/internal/OuterSubscriber';

export enum GridEditorCommandComponentEventType {
    Click,
    Confirm,
    Cancel,
    Ask
}

export interface GridEditorCommandComponentEvent {
    id: string;
    uid: string;
    actionDisplay?: boolean;
}

@Component({
    selector: 'wc-grid-editor-command',
    styleUrls: [ './grid-editor-command-component.scss' ],
    templateUrl: './grid-editor-command-component.html'
})
export class GridEditorCommandComponent {

    //@Input() disabled: boolean;
    @Input() title:string;
    @Input() hasConfirmation: boolean;
    @Input() confirmationTitle: string;
    @Input() commandIcon: string;
    @Input() commandId: string;
    
    @Output() commandClick: EventEmitter<GridEditorCommandComponentEvent> = new EventEmitter();
    @Output() commandConfirm: EventEmitter<GridEditorCommandComponentEvent> = new EventEmitter();
    @Output() commandCancel: EventEmitter<GridEditorCommandComponentEvent> = new EventEmitter();
    @Output() actionStatusChange: EventEmitter<GridEditorCommandComponentEvent> = new EventEmitter();
    
    controlUID: string;
    private _actionDisplayed: boolean;
    private _disabled: boolean;

    constructor() {
        this.controlUID = uuidv1();
    }

    onCheckChange(event){
        this._actionDisplayed = event.target.checked;
        this.actionStatusChange.emit({
            id: this.commandId,
            uid: this.controlUID,
            actionDisplay: this._actionDisplayed
        })
    }

    onCommandClick(event) {
        if (!this.disabled){
            this.commandClick.emit({
                id: this.commandId,
                uid: this.controlUID
            })
        }
    }

    onConfirm(event){
        this.commandConfirm.emit({
            id: this.commandId,
            uid: this.controlUID
        })
    }

    onCancel(event) {
        this.commandCancel.emit({
            id: this.commandId,
            uid: this.controlUID
        })
    }

    @Input() get disabled(): boolean {
        return this._disabled;
    }

    set disabled(disabled: boolean) {
        this._disabled = disabled;
    }

    public get enabled(): boolean {
        return !this.disabled;
    }
    
}
