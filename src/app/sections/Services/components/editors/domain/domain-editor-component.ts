import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'web-console-core';
import { WCPropertyEditorModel, WCPropertyEditorItemType } from 'web-console-ui-kit';
import { DomainsService, Domain } from '@wa-motif-open-api/platform-service';
import { NotificationCenter, NotificationType } from '../../../../../components/Commons/notification-center'
import { EditorContext } from '../service-catalog-editor-context';
import { BaseEditorComponent } from '../base-editor-component'
import { Observable } from 'rxjs';

const LOG_TAG = '[ServicesSectionDomainEditor]';

@Component({
    selector: 'wa-services-domain-editor',
    styleUrls: ['./domain-editor-component.scss'],
    templateUrl: './domain-editor-component.html'
})
export class DomainEditorComponent extends BaseEditorComponent implements OnInit {

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
    constructor(public logger: NGXLogger,
        public domainService: DomainsService,
        public notificationCenter: NotificationCenter) {
            super(logger, notificationCenter);
    }

    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG, 'Initializing...');
    }

    doRefreshData(editorContext: EditorContext): Observable<any> {
        return this.refreshDomainInfo(editorContext.domainName);
    }

    doSaveChanges(editorContext: EditorContext): Observable<any> {
        return null;
    }

    private refreshDomainInfo(domainName: string) {
        return new Observable((observer) => {

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

                observer.next({});

            }, (error) => {

                this.logger.error(LOG_TAG , 'setDomain error: ', error);

                this.notificationCenter.post({
                    name: 'LoadDomainConfigError',
                    title: 'Load Domain COnfiguration',
                    message: 'Error loading domain configuration:',
                    type: NotificationType.Error,
                    error: error
                });

                observer.error(error);

            });

        });
    }


}
