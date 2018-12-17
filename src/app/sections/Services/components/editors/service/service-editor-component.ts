import { Component, OnInit, EventEmitter, ViewChild, Output } from '@angular/core';
import { NGXLogger } from 'web-console-core';
import { WCPropertyEditorModel, WCPropertyEditorItemType, PropertyChangeEvent, MinitButtonClickEvent } from 'web-console-ui-kit';
import { OfflineMessagesSettingsComponent } from '../commons/offline_messages/offline-messages-settings-component'
import { EditorPropertyChangeEvent } from '../commons/editors-events';

const LOG_TAG = '[ServicesSectionServiceEditor]';
  
@Component({
    selector: 'wa-services-service-editor',
    styleUrls: ['./service-editor-component.scss'],
    templateUrl: './service-editor-component.html'
})
export class ServiceEditorComponent implements OnInit {

    @ViewChild('offlineMessagesEditor') offlineMessagesEditor: OfflineMessagesSettingsComponent;

    @Output() propertyChange: EventEmitter<EditorPropertyChangeEvent> = new EventEmitter();

    
    public offlineMessages: string[] = ['uno', 'due', 'tre'];

    public propertyModel: WCPropertyEditorModel = {
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
