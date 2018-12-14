import { Component, OnInit, Input } from '@angular/core';
import { NGXLogger } from 'web-console-core';

const LOG_TAG = '[ServicesSectionServiceEditor]';

@Component({
    selector: 'wa-services-operation-editor',
    styleUrls: ['./operation-editor-component.scss'],
    templateUrl: './operation-editor-component.html'
})
export class OperationEditorComponent implements OnInit {

    constructor(private logger: NGXLogger) {

    }

    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG, 'Initializing...');
    }

    public setDomain(domainName: string) {
        // TODO!!
    }


}
