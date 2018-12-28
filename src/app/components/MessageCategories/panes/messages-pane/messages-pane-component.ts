import { Component, OnInit } from '@angular/core';
import { NGXLogger} from 'web-console-core';

const LOG_TAG = '[MessagesPaneComponent]';

@Component({
    selector: 'wa-message-categories-messages-pane',
    styleUrls: [ './messages-pane-component.scss' ],
    templateUrl: './messages-pane-component.html'
})
export class MessagesPaneComponent implements OnInit  {

    constructor(private logger: NGXLogger) {

    }

    ngOnInit() {
        this.logger.debug(LOG_TAG , 'Initializing...');
    }

}
