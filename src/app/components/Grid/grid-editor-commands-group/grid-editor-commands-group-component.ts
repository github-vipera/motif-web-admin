import { Component, Input } from '@angular/core';

@Component({
    selector: 'wc-grid-editor-commands-group',
    styleUrls: [ './grid-editor-commands-group-component.scss' ],
    templateUrl: './grid-editor-commands-group-component.html'
})
export class GridEditorCommandsGroupComponent {


    @Input() public visible: boolean;

    constructor() {}

    onCommandClick(event) {
        console.log(">>>>>> onCommandClick:", event);
    }

    onCommandConfirm(event){
        console.log(">>>>>> onCommandConfirm:", event);
    }

    onCommandCancel(event){
        console.log(">>>>>> onCommandCancel:", event);
    }


}
