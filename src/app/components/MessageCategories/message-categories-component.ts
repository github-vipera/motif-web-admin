import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { Message, MessageCategory } from './data/model';

const LOG_TAG = '[MessageCategoriesComponent]';

export interface MessageCategorySelectionEvent {
    domain: string;
    category: string;
    message: string;
    locale: string;
}

@Component({
    selector: 'wa-message-categories-component',
    styleUrls: [ './message-categories-component.scss', './message-categories-component-shared.scss' ],
    templateUrl: './message-categories-component.html'
})
export class MessageCategoriesComponent implements OnInit  {

    @Output() public selectedCategory: MessageCategory;
    @Output() public selectedMessage: Message;
    @Output() public selectionChange: EventEmitter<MessageCategorySelectionEvent> = new EventEmitter();

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

    onMessageSelectionChange(message: Message) {
        this.logger.debug(LOG_TAG, 'On message selected: ', message);
        this.selectedMessage = message;
        this.emitSelectionEvent();
    }

    private emitSelectionEvent(){
        if (this._domain && this.selectedCategory && this.selectedMessage) {
            this.selectionChange.emit({
                domain: this._domain,
                category: this.selectedCategory.name,
                message: this.selectedMessage.message,
                locale: this.selectedMessage.locale
            });
        }
    }

    @Input()
    set domain(domain: string) {
        this._domain = domain;
    }

    get domain(): string {
        return this._domain;
    }

}
