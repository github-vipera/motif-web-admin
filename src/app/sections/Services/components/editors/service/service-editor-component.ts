import { Component, OnInit, EventEmitter, ViewChild, Output } from '@angular/core';
import { NGXLogger } from 'web-console-core';
import { WCPropertyEditorModel, WCPropertyEditorItemType, WCPropertyEditorItem,  MinitButtonClickEvent } from 'web-console-ui-kit';
import { OfflineMessagesSettingsComponent } from '../commons/offline_messages/offline-messages-settings-component'
import { EditorPropertyChangeEvent } from '../commons/editors-events';
import { BaseEditorComponent } from '../base-editor-component';
import { Observable } from 'rxjs';
import { NotificationCenter, NotificationType } from '../../../../../components/Commons/notification-center';
import { EditorContext } from '../service-catalog-editor-context';
import { ServicesService, Service, ServiceUpdate } from '@wa-motif-open-api/catalog-service';

const LOG_TAG = '[ServicesSectionServiceEditor]';

@Component({
    selector: 'wa-services-service-editor',
    styleUrls: ['./service-editor-component.scss'],
    templateUrl: './service-editor-component.html'
})
export class ServiceEditorComponent extends BaseEditorComponent implements OnInit {

    @ViewChild('offlineMessagesEditor') offlineMessagesEditor: OfflineMessagesSettingsComponent;

    @Output() propertyChange: EventEmitter<EditorPropertyChangeEvent> = new EventEmitter();

    private _currentService: Service;

    public offlineMessages: string[] = ['uno', 'due', 'tre'];

    public serviceModel: WCPropertyEditorModel = {
        items: [
          {
            name: 'Enabled',
            field: 'enabled',
            type: WCPropertyEditorItemType.Boolean,
            value: true
          },
          {
            name: 'Offline Message',
            field: 'offlineMessage',
            type: WCPropertyEditorItemType.List,
            value: '',
            listValues: ['Uno', 'Due', 'Tre', 'Quattro', 'Cinque'],
            disabled: true,
            miniCommand: true,
            miniCommandCaption: 'Setup...'
          },
          {
            name: 'Counters Plugin',
            field: 'countersPlugin',
            type: WCPropertyEditorItemType.String,
            value: '',
            disabled: false
          },
          {
            name: 'Threshold Checks Plugin',
            field: 'thresholdChecksPlugin',
            type: WCPropertyEditorItemType.String,
            value: '',
            disabled: false
          },
          {
            name: 'Threshold Actions Plugin',
            field: 'thresholdActionsPlugin',
            type: WCPropertyEditorItemType.String,
            value: '',
            disabled: false
          }
        ]
      };

      constructor(public logger: NGXLogger,
        private servicesService: ServicesService,
        public notificationCenter: NotificationCenter) {
          super(logger, notificationCenter);
          this.setModel(this.serviceModel);
      }


    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG, 'Initializing...');
    }

    onMiniButtonClick(event: MinitButtonClickEvent): void {
      this.logger.debug(LOG_TAG, 'onMiniButtonClick:', event);
      // TODO!!
      this.offlineMessagesEditor.show();
    }

    doRefreshData(editorContext: EditorContext): Observable<any> {
      return this.refreshServiceInfo(editorContext.domainName, editorContext.applicationName, editorContext.serviceName, 'JSON');
    }

    doSaveChanges(editorContext: EditorContext): Observable<any> {
      // TODO!!
      return null;
    }

    private refreshServiceInfo(domainName: string, applicationName: string, serviceName: string, channel: string): Observable<any> {
      return new Observable((observer) => {

        this.logger.debug(LOG_TAG, 'refreshServiceInfo for ', domainName, applicationName, serviceName, channel);

        this.servicesService.getService(channel, domainName, applicationName, serviceName).subscribe((service: Service) => {

          this._currentService = service;

          this.toModel(service);

          this.logger.debug(LOG_TAG, 'Current service: ', this._currentService);

          observer.next(null);
          observer.complete();

        }, (error) => {

          this.logger.error(LOG_TAG , 'Get Applcation error: ', error);

              this.notificationCenter.post({
                  name: 'LoadServiceConfigError',
                  title: 'Load Service Configuration',
                  message: 'Error loading service configuration:',
                  type: NotificationType.Error,
                  error: error
              });

              observer.error(error);

        });

      });
    }

    private fromModel(): ServiceUpdate {
      this.logger.debug(LOG_TAG, 'fromModel called.');

      const changedProperties: WCPropertyEditorItem[] = this.getChangedProperties();

      this.logger.trace(LOG_TAG, 'fromModel changedProperties:', changedProperties);

      // TODO!!
      /*
      const changedProps: Property[] = [];
      for (let i = 0 ; i < changedProperties.length; i++) {
        const changedProperty = changedProperties[i];
        if ((changedProperty.field !== 'description') && (changedProperty.field !== 'category')) {
          const property = {
            key : changedProperty.field,
            value: changedProperty.value
          };
          changedProps.push(property);
        } else {
          this.logger.debug(LOG_TAG, 'fromModel discarded field >>>>', changedProperty);
        }
      }
  
      const application: ApplicationUpdate = {
      };
  
      const descriptionProperty: WCPropertyEditorItem = this.getPropertyItem('description');
      const categoryProperty: WCPropertyEditorItem = this.getPropertyItem('category');
  
      if (descriptionProperty.valueChanged) {
        application.description = descriptionProperty.value;
      }
  
      if (categoryProperty.valueChanged) {
        application.category = categoryProperty.value;
      }
  
      if (changedProps.length > 0) {
        application.properties = changedProps;
      }
  
      this.logger.debug(LOG_TAG, 'fromModel updateApp: ', application);
  
      return application;
      */
     return null;
    }

    private toModel(service: Service): void {
      this.getPropertyItem('enabled').value = service.enabled;
      // TODO!! add other fields (where are??)
    }


}
