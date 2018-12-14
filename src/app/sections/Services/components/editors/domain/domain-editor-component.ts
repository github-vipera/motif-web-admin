import { Component, OnInit, Input } from '@angular/core';
import { NGXLogger } from 'web-console-core';

const LOG_TAG = '[ServicesSectionDomainEditor]';

@Component({
    selector: 'wa-services-domain-editor',
    styleUrls: ['./domain-editor-component.scss'],
    templateUrl: './domain-editor-component.html'
})
export class DomainEditorComponent implements OnInit {

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
