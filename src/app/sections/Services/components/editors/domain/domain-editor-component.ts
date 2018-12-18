import { Component, OnInit, Input } from '@angular/core';
import { NGXLogger } from 'web-console-core';
import { WCPropertyEditorModel, WCPropertyEditorItemType } from 'web-console-ui-kit';
import { DomainsService, Domain } from '@wa-motif-open-api/platform-service';
import { NotificationCenter, NotificationType } from '../../../../../components/Commons/notification-center'
import { EditorContext } from '../service-catalog-editor-context';

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
            value: ''
          }
        ]
    };

    private _currentDomain: Domain;
    private _currentEditorContext: EditorContext;
    public loading: boolean;

    constructor(private logger: NGXLogger,
        private domainService: DomainsService,
        private notificationCenter: NotificationCenter) {
    }

    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG, 'Initializing...');
    }

    private refreshDomainInfo(domainName: string) {
        this.loading = true;
        this.logger.debug(LOG_TAG, 'Selected domain: ', domainName);
        this.domainService.getDomain(domainName).subscribe((domain: Domain) => {
            this._currentDomain = domain;
            this.propertyModel = {
                items: [
                    {
                        name: 'Description',
                        field: 'description',
                        type: WCPropertyEditorItemType.String,
                        value: domain.description
                    }
                ]
            };
            this.logger.debug(LOG_TAG, 'Current domain: ', this._currentDomain);

        }, (error) => {

            this.logger.error(LOG_TAG , 'setDomain error: ', error);
            this.loading = false;

            this.notificationCenter.post({
                name: 'LoadDomainConfigError',
                title: 'Load Domain COnfiguration',
                message: 'Error loading domain configuration:',
                type: NotificationType.Error,
                error: error
            });

        });
    }

    @Input()
    public set editorContext(editorContext: EditorContext) {
        this._currentEditorContext = editorContext;
        this.refreshDomainInfo(editorContext.domainName);
    }

}
