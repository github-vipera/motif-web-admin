import { Component, OnInit, Input } from '@angular/core';
import { NGXLogger } from 'web-console-core';
import { WCPropertyEditorModel, WCPropertyEditorItemType } from 'web-console-ui-kit';

const LOG_TAG = '[OfflineMessagesSettingsComponent]';

@Component({
    selector: 'wa-services-offline-messages-editor',
    styleUrls: ['./offline-messages-settings-component.scss'],
    templateUrl: './offline-messages-settings-component.html'
})
export class OfflineMessagesSettingsComponent implements OnInit {

    displayDialog: boolean;

    constructor() {}

    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG, 'Initializing...');
    }

    public show(): void {
        this.displayDialog = true;
    }

    public hide(): void {
        this.displayDialog = false;
    }

    public get isShowed(): boolean {
        return this.displayDialog;
    }
    
}