import { Component, OnInit } from '@angular/core';
import { NGXLogger} from 'web-console-core';

const LOG_TAG = '[CategoryPaneComponent]';

@Component({
    selector: 'wa-message-categories-category-pane',
    styleUrls: [ './category-pane-component.scss' ],
    templateUrl: './category-pane-component.html'
})
export class CategoryPaneComponent implements OnInit  {

    constructor(private logger: NGXLogger) {

    }

    ngOnInit() {
        this.logger.debug(LOG_TAG , 'Initializing...');
    }

}
