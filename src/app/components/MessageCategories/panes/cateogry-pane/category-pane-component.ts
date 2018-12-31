import { Component, OnInit } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { MessageCategory } from '../../data/model'

const LOG_TAG = '[CategoryPaneComponent]';

@Component({
    selector: 'wa-message-categories-category-pane',
    styleUrls: [ './category-pane-component.scss', '../../message-categories-component-shared.scss' ],
    templateUrl: './category-pane-component.html'
})
export class CategoryPaneComponent implements OnInit  {

    data: MessageCategory[];

    constructor(private logger: NGXLogger) {

    }

    ngOnInit() {
        this.logger.debug(LOG_TAG , 'Initializing...');
    }

}
