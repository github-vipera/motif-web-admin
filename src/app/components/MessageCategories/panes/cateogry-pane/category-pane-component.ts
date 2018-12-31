import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { MessageCategory } from '../../data/model';

const LOG_TAG = '[CategoryPaneComponent]';

@Component({
    selector: 'wa-message-categories-category-pane',
    styleUrls: [ './category-pane-component.scss', '../../message-categories-component-shared.scss' ],
    templateUrl: './category-pane-component.html'
})
export class CategoryPaneComponent implements OnInit  {

    data: MessageCategory[] = [
        {name: 'Server Down', id: 'server_down' },
        {name: 'Server Restarting', id: 'server_restarting' },
        {name: 'Maintenance Mode', id: 'maintenance' },
        {name: 'Server Down 2', id: 'server_down2' }
    ];

    @Output() selectionChange: EventEmitter<MessageCategory> = new EventEmitter<MessageCategory>();

    constructor(private logger: NGXLogger) {

    }

    ngOnInit() {
        this.logger.debug(LOG_TAG , 'Initializing...');
    }

    onSelectionChange(event){
        this.logger.debug(LOG_TAG , 'onSelectionChange: ', event);
        this.selectionChange.emit(event.selectedRows[0].dataItem);
    }

}
