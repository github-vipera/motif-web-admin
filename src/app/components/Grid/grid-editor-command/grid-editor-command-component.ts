import { Component, Input } from '@angular/core';
import * as uuidv1 from 'uuid/v1';

@Component({
    selector: 'wc-grid-editor-command',
    styleUrls: [ './grid-editor-command-component.scss' ],
    templateUrl: './grid-editor-command-component.html'
})
export class GridEditorCommandComponent {

    @Input() disabled: boolean;
    @Input() title:string;
    @Input() hasConfirmation: boolean;
    @Input() confirmationTitle: string;
    @Input() commandIcon: string;

    controlUID: string;
    private _actionDisplayed: boolean;


    constructor() {
        this.controlUID = uuidv1();
    }

    onCheckChange(event){
        this._actionDisplayed = event.target.checked;
        console.log(">>>>>> STO CAMBIANDO!! this._actionDisplayed", this._actionDisplayed);
    }

    onCommandClick(event) {
        console.log(">>>>>> onCommandClick", event);
    }

}
