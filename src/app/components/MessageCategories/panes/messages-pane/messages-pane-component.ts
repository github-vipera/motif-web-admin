import { Component, OnInit, Input } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { Message, MessageCategory } from '../../data/model';
import { SystemService } from '@wa-motif-open-api/platform-service';

const LOG_TAG = '[MessagesPaneComponent]';

@Component({
    selector: 'wa-message-categories-messages-pane',
    styleUrls: [ './messages-pane-component.scss', '../../message-categories-component-shared.scss' ],
    templateUrl: './messages-pane-component.html'
})
export class MessagesPaneComponent implements OnInit  {

    private _category: MessageCategory;
    private _domain: string;


    data: Message[] = [];

    constructor(private logger: NGXLogger,
        private systemService: SystemService) {

    }

    ngOnInit() {
        this.logger.debug(LOG_TAG , 'Initializing...');
    }

    private reloadMessages() {
        if (this._category && this._domain){
            this.logger.debug(LOG_TAG , 'reloadMessages for ', this._domain, this._category.name);
            this.systemService.getSystemMessages(this._domain, this._category.name).subscribe((data) => {
                this.logger.debug(LOG_TAG , 'reloadMessages: ', data);
                this.data = data;
            }, (error) => {
                this.logger.error(LOG_TAG , 'reloadMessages error: ', error);
            });
        } else {
            this.data = [];
        }
    }

    @Input()
    set category(category: MessageCategory) {
        this._category = category;
        this.reloadMessages();
        this.logger.debug(LOG_TAG , 'Category changed: ', this._category);
    }

    get category(): MessageCategory {
        return this._category;
    }

    onSelectionChange(event){
        // TODO!!
    }

    @Input()
    set domain(domain: string) {
        this._domain = domain;
        this._category = null;
        this.reloadMessages();
    }

    get domain(): string {
        return this._domain;
    }

}
