import { Component, OnInit } from '@angular/core';
import { NGXLogger} from 'web-console-core';

const LOG_TAG = '[MessageCategoriesComponent]';

@Component({
    selector: 'wa-message-categories-component',
    styleUrls: [ './message-categories-component.scss', './message-categories-component-shared.scss' ],
    templateUrl: './message-categories-component.html'
})
export class MessageCategoriesComponent implements OnInit  {

    constructor(private logger: NGXLogger) {

    }

    ngOnInit() {
        this.logger.debug(LOG_TAG , 'Initializing...');
    }

}
