import { Component, OnInit, Input } from '@angular/core';
import { NGXLogger } from 'web-console-core';

const LOG_TAG = '[ServicesSectionServiceEditor]';

@Component({
    selector: 'wa-services-service-editor',
    styleUrls: ['./service-editor-component.scss'],
    templateUrl: './service-editor-component.html'
})
export class ServiceEditorComponent implements OnInit {

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
