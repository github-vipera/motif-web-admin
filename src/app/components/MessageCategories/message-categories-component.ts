import { Component, OnInit, Input } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { Message, MessageCategory } from './data/model';

const LOG_TAG = '[MessageCategoriesComponent]';

@Component({
    selector: 'wa-message-categories-component',
    styleUrls: [ './message-categories-component.scss', './message-categories-component-shared.scss' ],
    templateUrl: './message-categories-component.html'
})
export class MessageCategoriesComponent implements OnInit  {

    public selectedCategory: MessageCategory;

    private _domain: string;



    constructor(private logger: NGXLogger) {

    }

    ngOnInit() {
        this.logger.debug(LOG_TAG , 'Initializing...');
    }

    onCategorySelection(category: MessageCategory) {
        this.logger.debug(LOG_TAG, 'On category selected: ', category);
        this.selectedCategory = category;
    }

    @Input()
    set domain(domain: string) {
        this._domain = domain;
    }

    get domain(): string {
        return this._domain;
    }

}
