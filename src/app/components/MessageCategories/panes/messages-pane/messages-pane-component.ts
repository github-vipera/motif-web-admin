import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { Message, MessageCategory, LocaleMapping } from '../../data/model';
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
    private _localeMapping: LocaleMapping = new LocaleMapping();
    @Output() selectionChange: EventEmitter<Message> = new EventEmitter<Message>();

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
                this.data = data;
                for (let i = 0; i < data.length; i++) {
                    const message = this.data[i];
                    message.localeName = this._localeMapping.findByCode(message.locale);
                }
                this.logger.debug(LOG_TAG , 'reloadMessages: ', data);
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
        this.logger.debug(LOG_TAG , 'onSelectionChange: ', event);
        this.selectionChange.emit(event.selectedRows[0].dataItem);
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
