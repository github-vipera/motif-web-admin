import { Component, OnInit, EventEmitter, ViewChild, Output } from '@angular/core';
import { NGXLogger } from 'web-console-core';
import { WCPropertyEditorModel, WCPropertyEditorItemType, WCPropertyEditorItem,  MinitButtonClickEvent } from 'web-console-ui-kit';
import { OfflineMessagesSettingsComponent } from '../commons/offline_messages/offline-messages-settings-component'
import { EditorPropertyChangeEvent } from '../commons/editors-events';
import { BaseEditorComponent } from '../base-editor-component';
import { Observable } from 'rxjs';
import { NotificationCenter, NotificationType } from '../../../../../components/Commons/notification-center';
import { ApplicationsService, ApplicationsList, Application, ApplicationUpdate, Property } from '@wa-motif-open-api/platform-service';
import { EditorContext } from '../service-catalog-editor-context';

const LOG_TAG = '[ServicesSectionApplicationEditor]';


@Component({
    selector: 'wa-services-application-editor',
    styleUrls: ['./application-editor-component.scss'],
    templateUrl: './application-editor-component.html'
})
export class ApplicationEditorComponent  extends BaseEditorComponent implements OnInit {

    @ViewChild('offlineMessagesEditor') offlineMessagesEditor: OfflineMessagesSettingsComponent;

    @Output() propertyChange: EventEmitter<EditorPropertyChangeEvent> = new EventEmitter();

    private _currentApplication: Application;

    public offlineMessages: string[] = ['uno', 'due', 'tre'];

    public applicationModel: WCPropertyEditorModel = {
        items: [
          {
            name: 'Description',
            field: 'description',
            type: WCPropertyEditorItemType.String,
            value: 'Vipera platform secure'
          },
          {
            name: 'Offline',
            field: 'offline',
            type: WCPropertyEditorItemType.Boolean,
            value: false,
            linkTo: ['category']
          },
          {
            name: 'Offline Message',
            field: 'category',
            type: WCPropertyEditorItemType.List,
            value: '',
            listValues: ['Uno', 'Due', 'Tre', 'Quattro', 'Cinque'],
            disabled: true,
            miniCommand: true,
            miniCommandCaption: 'Setup...'
          },
          {
            name: 'OTP expiry',
            field: 'otpExpiry',
            type: WCPropertyEditorItemType.String,
            htmlInputType: 'number',
            value: '-1'
          },
          {
            name: 'OTP Format',
            field: 'otpFormat',
            type: WCPropertyEditorItemType.String,
            value: '[a-z0-9]+',
            disabled: false
          },
          {
            name: 'OTP Length',
            field: 'otpLength',
            type: WCPropertyEditorItemType.String,
            value: '6',
            htmlInputType: 'number',
            disabled: false
          },
          {
            name: 'OTP Reuse',
            field: 'otpReuse',
            type: WCPropertyEditorItemType.Boolean,
            value: false
          },
          {
            name: 'OTP Max Failures',
            field: 'otpMaxFailures',
            type: WCPropertyEditorItemType.String,
            value: '3',
            htmlInputType: 'number',
            disabled: false
          },
          {
            name: 'Allow Multiple Sessions',
            field: 'allowMultipleSessions',
            type: WCPropertyEditorItemType.Boolean,
            value: false
          },
          {
            name: 'Instance Key Length',
            field: 'instanceKeyLength',
            type: WCPropertyEditorItemType.String,
            value: '32',
            htmlInputType: 'number',
            disabled: false
          },
          {
            name: 'Allow Multiple Apps',
            field: 'allowMultipleInstall',
            type: WCPropertyEditorItemType.Boolean,
            value: false
          },
          {
            name: 'Password History',
            field: 'passwordHistory',
            type: WCPropertyEditorItemType.String,
            value: '32',
            htmlInputType: 'number',
            disabled: false
          },
          {
            name: 'Password Expiry',
            field: 'passwordExpiry',
            type: WCPropertyEditorItemType.String,
            value: '32',
            htmlInputType: 'number',
            disabled: false
          },
          {
            name: 'Password Format',
            field: 'passwordFormat',
            type: WCPropertyEditorItemType.String,
            value: '.+',
            disabled: false
          },
          {
            name: 'Max Login Failures',
            field: 'passwordMaxFailures',
            type: WCPropertyEditorItemType.String,
            value: '-1',
            htmlInputType: 'number',
            disabled: false
          },
          {
            name: 'Register User',
            field: 'registerUser',
            type: WCPropertyEditorItemType.Boolean,
            value: false
          },
          {
            name: 'Register Password',
            field: 'registerPasswd',
            type: WCPropertyEditorItemType.Boolean,
            value: false
          },
          {
            name: 'User Activation',
            field: 'needsActivation',
            type: WCPropertyEditorItemType.Boolean,
            value: true
          },
          {
            name: 'Verify Client IP',
            field: 'verifyClientIp',
            type: WCPropertyEditorItemType.Boolean,
            value: true
          },
          {
            name: 'Vipera Serial Format',
            field: 'viperaSerialFormat',
            type: WCPropertyEditorItemType.String,
            value: '[a-zA-Z0-9]+',
            disabled: false
          },
          {
            name: 'Vipera Serial Length',
            field: 'viperaSerialLength',
            type: WCPropertyEditorItemType.String,
            value: '16',
            htmlInputType: 'number',
            disabled: false
          },
          {
            name: 'UserID Format',
            field: 'userIdFormat',
            type: WCPropertyEditorItemType.String,
            value: '[a-zA-Z0-9]+',
            disabled: false
          },
          {
            name: 'UserID Length',
            field: 'userIdLength',
            type: WCPropertyEditorItemType.String,
            value: '16',
            htmlInputType: 'number',
            disabled: false
          }
        ]
      };

    constructor(public logger: NGXLogger,
      public applicationService: ApplicationsService,
      public notificationCenter: NotificationCenter) {
        super(logger, notificationCenter);
        this.setModel(this.applicationModel);
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
      return this.refreshApplicationInfo(editorContext.domainName, editorContext.applicationName);
  }

  doSaveChanges(editorContext: EditorContext): Observable<any> {
      return new Observable((observer) => {

          this.logger.debug(LOG_TAG, 'Saving changes on application: ', this.editorContext.domainName, this._currentApplication.name);

          const updatedApplication = this.fromModel();

          this.logger.debug(LOG_TAG, 'application update: ', updatedApplication);

          this.applicationService.updateApplication(this.editorContext.domainName,
            this.editorContext.applicationName,
            updatedApplication).subscribe((data) => {

              this.logger.debug(LOG_TAG, 'Updated application: ', this.editorContext.domainName, this._currentApplication.name, data);

              this.notificationCenter.post({
                  name: 'SaveApplicationConfig',
                  title: 'Save Application Configuration',
                  message: 'Application configuration changed successfully.',
                  type: NotificationType.Success
              });

              observer.next({});
              observer.complete();

            }, (error) => {

              this.logger.error(LOG_TAG , 'save Application error: ', error);

              this.notificationCenter.post({
                  name: 'SaveApplicationConfigError',
                  title: 'Save Application Configuration',
                  message: 'Error saving application configuration:',
                  type: NotificationType.Error,
                  error: error
              });

              observer.error(error);

            });

      });
  }

  private fromModel(): ApplicationUpdate {
    this.logger.debug(LOG_TAG, 'fromModel called.');

    const changedProperties: WCPropertyEditorItem[] = this.getChangedProperties();

    this.logger.trace(LOG_TAG, 'fromModel changedProperties:', changedProperties);

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
  }

  private toModel(application: Application): void {
    this.getPropertyItem('description').value = application.description;
    this.getPropertyItem('offline').value = application.offline;
    this.getPropertyItem('otpExpiry').value = application.otpExpiry;
    this.getPropertyItem('otpFormat').value = application.otpFormat;
    this.getPropertyItem('otpLength').value = application.otpLength;
    this.getPropertyItem('otpReuse').value = application.otpReuse;
    this.getPropertyItem('otpMaxFailures').value = application.otpMaxFailures;
    this.getPropertyItem('allowMultipleSessions').value = application.allowMultipleSessions;
    this.getPropertyItem('instanceKeyLength').value = application.instanceKeyLength;
    this.getPropertyItem('allowMultipleInstall').value = application.allowMultipleInstall;
    this.getPropertyItem('passwordHistory').value = application.passwordHistory;
    this.getPropertyItem('passwordExpiry').value = application.passwordExpiry;
    this.getPropertyItem('passwordFormat').value = application.passwordFormat;
    this.getPropertyItem('passwordMaxFailures').value = application.passwordMaxFailures;
    this.getPropertyItem('registerUser').value = application.registerUser;
    this.getPropertyItem('registerPasswd').value = application.registerPasswd;
    this.getPropertyItem('needsActivation').value = application.needsActivation;
    this.getPropertyItem('verifyClientIp').value = application.verifyClientIp;
    this.getPropertyItem('viperaSerialFormat').value = application.viperaSerialFormat;
    this.getPropertyItem('viperaSerialLength').value = application.viperaSerialLength;
    this.getPropertyItem('userIdFormat').value = application.userIdFormat;
    this.getPropertyItem('userIdLength').value = application.userIdLength;
  }

  private refreshApplicationInfo(domainName: string, applicationName: string): Observable<any> {
      return new Observable((observer) => {

          this.logger.debug(LOG_TAG, 'Selected domain and application ', domainName, applicationName);
          this.applicationService.getApplication(domainName, applicationName).subscribe((application: Application) => {
              this._currentApplication = application;

              this.toModel(application);

              this.logger.debug(LOG_TAG, 'Current application: ', this._currentApplication);

              observer.next(null);
              observer.complete();

          }, (error) => {

              this.logger.error(LOG_TAG , 'Get Applcation error: ', error);

              this.notificationCenter.post({
                  name: 'LoadApplicationConfigError',
                  title: 'Load Application Configuration',
                  message: 'Error loading application configuration:',
                  type: NotificationType.Error,
                  error: error
              });

              observer.error(error);

          });

      });
  }


}
