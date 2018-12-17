import { Component, OnInit, Input } from '@angular/core';
import { NGXLogger } from 'web-console-core';
import { WCPropertyEditorModel, WCPropertyEditorItemType } from 'web-console-ui-kit';

const LOG_TAG = '[ServicesSectionDomainEditor]';

@Component({
    selector: 'wa-services-domain-editor',
    styleUrls: ['./domain-editor-component.scss'],
    templateUrl: './domain-editor-component.html'
})
export class DomainEditorComponent implements OnInit {

    public propertyModel: WCPropertyEditorModel = {
        items: [
          {
            name: 'Description',
            field: 'description',
            type: WCPropertyEditorItemType.String,
            value: 'Vipera platform secure'
          }
        ]
    };

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
