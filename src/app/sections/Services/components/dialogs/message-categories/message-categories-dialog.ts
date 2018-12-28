import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'web-console-core';

const LOG_TAG = '[MessageCategoriesDialogComponent]';



@Component({
    selector: 'wa-services-section-message-cateogries-dialog',
    styleUrls: ['./message-categories-dialog.scss'],
    templateUrl: './message-categories-dialog.html'
})
export class MessageCategoriesDialogComponent implements OnInit {

    display: boolean;

    constructor(private logger: NGXLogger) {}

    ngOnInit() {
        this.logger.debug(LOG_TAG, 'Initializing...');
    }

    public show(): void {
        this.display = true;
    }

    public hide() {
        this.display = false;
    }


}
