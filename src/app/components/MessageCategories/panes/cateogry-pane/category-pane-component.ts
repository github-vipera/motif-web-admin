import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { MessageCategory } from '../../data/model';
import { SystemService } from '@wa-motif-open-api/platform-service';


const LOG_TAG = '[CategoryPaneComponent]';

@Component({
    selector: 'wa-message-categories-category-pane',
    styleUrls: [ './category-pane-component.scss', '../../message-categories-component-shared.scss' ],
    templateUrl: './category-pane-component.html'
})
export class CategoryPaneComponent implements OnInit  {

    data: MessageCategory[] = [];

    @Output() selectionChange: EventEmitter<MessageCategory> = new EventEmitter<MessageCategory>();
    private _domain: string;


    constructor(private logger: NGXLogger,
        private systemService: SystemService) {
    }

    ngOnInit() {
        this.logger.debug(LOG_TAG , 'Initializing...');
        this.reloadCategories();
    }

    private reloadCategories(): void {
        if (this._domain) {
            this.systemService.getSystemCategories(this._domain).subscribe((data) => {
                this.logger.debug(LOG_TAG , 'reloadCategories: ', data);
                this.data = data;
            }, (error) => {
                this.logger.error(LOG_TAG , 'reloadCategories error: ', error);
            });
        } else {
            this.data = [];
        }
    }

    onSelectionChange(event){
        this.logger.debug(LOG_TAG , 'onSelectionChange: ', event);
        this.selectionChange.emit(event.selectedRows[0].dataItem);
    }

    @Input()
    set domain(domain: string) {
        this._domain = domain;
        this.reloadCategories();
    }

    get domain(): string {
        return this._domain;
    }
}
