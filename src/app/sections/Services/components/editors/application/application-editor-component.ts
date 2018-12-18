import { Component, OnInit, EventEmitter, ViewChild, Output } from '@angular/core';
import { NGXLogger } from 'web-console-core';
import { WCPropertyEditorModel, WCPropertyEditorItemType, PropertyChangeEvent, MinitButtonClickEvent } from 'web-console-ui-kit';
import { OfflineMessagesSettingsComponent } from '../commons/offline_messages/offline-messages-settings-component'
import { EditorPropertyChangeEvent } from '../commons/editors-events';
import { BaseEditorComponent } from '../base-editor-component';
import { Observable } from 'rxjs';
import { NotificationCenter, NotificationType } from '../../../../../components/Commons/notification-center';
import { ApplicationsService, ApplicationsList, Application } from '@wa-motif-open-api/platform-service';
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
            linkTo: ['offlineMessage']
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
            field: 'allowMultipleApps',
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
            field: 'maxLoginFailures',
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
            field: 'registerPassword',
            type: WCPropertyEditorItemType.Boolean,
            value: false
          },
          {
            name: 'User Activation',
            field: 'userActivation',
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
            field: 'UserIdLength',
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
    return null;
    /*
      return new Observable((observer) => {

          this.logger.debug(LOG_TAG, 'Saving changes on domain: ', this._currentDomain.name);

          const propertyItem: WCPropertyEditorItem = this.getPropertyItem('description');

          this.domainService.updateDomain(this._currentDomain.name,
                  { 'description' : propertyItem.value }).subscribe((data) => {

                      this.logger.debug(LOG_TAG, 'Current domain: ', this._currentDomain);

                      this.notificationCenter.post({
                          name: 'SaveDomainConfig',
                          title: 'Save Domain Configuration',
                          message: 'Domain configuration changed successfully.',
                          type: NotificationType.Success
                      });

                      observer.next({});

          }, (error) => {

              this.logger.error(LOG_TAG , 'setDomain error: ', error);

              this.notificationCenter.post({
                  name: 'SaveDomainConfigError',
                  title: 'Save Domain Configuration',
                  message: 'Error saving domain configuration:',
                  type: NotificationType.Error,
                  error: error
              });

              observer.error(error);

          });
      });
      */
  }

  private refreshApplicationInfo(domainName: string, applicationName: string) {
      return new Observable((observer) => {

          this.logger.debug(LOG_TAG, 'Selected domain and application ', domainName, applicationName);
          this.applicationService.getApplication(domainName, applicationName).subscribe((application: Application) => {
              this._currentApplication = application;

              this.getPropertyItem('description').value = application.description;
              this.getPropertyItem('offline').value = application.offline;
              this.getPropertyItem('otpExpiry').value = application.otpExpiry;
              this.getPropertyItem('otpFormat').value = application.otpFormat;
              this.getPropertyItem('otpLength').value = application.otpLength;
              this.getPropertyItem('otpReuse').value = application.otpReuse;
              this.getPropertyItem('otpMaxFailures').value = application.otpMaxFailures;
              this.getPropertyItem('allowMultipleSessions').value = application.allowMultipleSessions;
              this.getPropertyItem('instanceKeyLength').value = application.instanceKeyLength;
              this.getPropertyItem('allowMultipleApps').value = application.allowMultipleInstall;
              this.getPropertyItem('passwordHistory').value = application.passwordHistory;
              this.getPropertyItem('passwordExpiry').value = application.passwordExpiry;
              this.getPropertyItem('passwordFormat').value = application.passwordFormat;
              this.getPropertyItem('maxLoginFailures').value = application.passwordMaxFailures;
              this.getPropertyItem('registerUser').value = application.registerUser;
              this.getPropertyItem('registerPassword').value = application.registerPasswd;
              //this.getPropertyItem('userActivation').value = application.userActivation;
              this.getPropertyItem('verifyClientIp').value = application.verifyClientIp;
              this.getPropertyItem('viperaSerialFormat').value = application.viperaSerialFormat;
              this.getPropertyItem('viperaSerialLength').value = application.viperaSerialLength;
              this.getPropertyItem('userIdFormat').value = application.userIdFormat;
              this.getPropertyItem('userIdLength').value = application.userIdLength;

              this.logger.debug(LOG_TAG, 'Current application: ', this._currentApplication);

              observer.next(null);

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
