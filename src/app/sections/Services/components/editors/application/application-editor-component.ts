import { Component, OnInit, Input } from '@angular/core';
import { NGXLogger } from 'web-console-core';

const LOG_TAG = '[ServicesSectionApplicationEditor]';

@Component({
    selector: 'wa-services-application-editor',
    styleUrls: ['./application-editor-component.scss'],
    templateUrl: './application-editor-component.html'
})
export class ApplicationEditorComponent implements OnInit {

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
