import { Component, OnInit, EventEmitter, ViewChild, Output } from '@angular/core';
import { NGXLogger } from 'web-console-core';
import { WCPropertyEditorModel, WCPropertyEditorItemType, PropertyChangeEvent, MinitButtonClickEvent } from 'web-console-ui-kit';
import { OfflineMessagesSettingsComponent } from '../commons/offline_messages/offline-messages-settings-component'
import { EditorPropertyChangeEvent } from '../commons/editors-events';

const LOG_TAG = '[ServicesSectionApplicationEditor]';


@Component({
    selector: 'wa-services-application-editor',
    styleUrls: ['./application-editor-component.scss'],
    templateUrl: './application-editor-component.html'
})
export class ApplicationEditorComponent implements OnInit {

    @ViewChild('offlineMessagesEditor') offlineMessagesEditor: OfflineMessagesSettingsComponent;

    @Output() propertyChange: EventEmitter<EditorPropertyChangeEvent> = new EventEmitter();

    public offlineMessages: string[] = ['uno', 'due', 'tre'];

    public propertyModel: WCPropertyEditorModel = {
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
            field: 'verifyClientIP',
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
            field: 'userIDFormat',
            type: WCPropertyEditorItemType.String,
            value: '[a-zA-Z0-9]+',
            disabled: false
          },
          {
            name: 'UserID Length',
            field: 'UserIDLength',
            type: WCPropertyEditorItemType.String,
            value: '16',
            htmlInputType: 'number',
            disabled: false
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

    onMiniButtonClick(event: MinitButtonClickEvent): void {
      this.logger.debug(LOG_TAG, 'onMiniButtonClick:', event);
      // TODO!!
      this.offlineMessagesEditor.show();
    }

    onPropertyChange(event: PropertyChangeEvent): void {
      this.logger.debug(LOG_TAG, 'onPropertyChange:', event);
      this.propertyChange.emit({ propertyName: event.item.field, propertyValue: event.newValue });
    }

}
