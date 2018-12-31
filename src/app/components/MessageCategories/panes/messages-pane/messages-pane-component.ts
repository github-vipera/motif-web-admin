import { Component, OnInit, Input } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { Message, MessageCategory } from '../../data/model';

const LOG_TAG = '[MessagesPaneComponent]';

@Component({
    selector: 'wa-message-categories-messages-pane',
    styleUrls: [ './messages-pane-component.scss', '../../message-categories-component-shared.scss' ],
    templateUrl: './messages-pane-component.html'
})
export class MessagesPaneComponent implements OnInit  {

    private _category: MessageCategory;
    private _domain: string;


    data: Message[] = [
        {name: 'Server Down', id: 'server_down', locale: 'eng' }
    ];

    constructor(private logger: NGXLogger) {

    }

    ngOnInit() {
        this.logger.debug(LOG_TAG , 'Initializing...');
    }

    
    @Input()
    set category(category: MessageCategory) {
        this._category = category;
        this.logger.debug(LOG_TAG , 'Category changed: ', this._category);
    }

    get category(): MessageCategory {
        return this._category;
    }

    onSelectionChange(event){
        // TODO!!
    }

    @Input()
    set domai(domain: string) {
        this._domain = domain;
    }

    get domain(): string {
        return this._domain;
    }

}
