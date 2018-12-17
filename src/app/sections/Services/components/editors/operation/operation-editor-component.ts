import { Component, OnInit, EventEmitter, ViewChild, Output } from '@angular/core';
import { NGXLogger } from 'web-console-core';
import { WCPropertyEditorModel, WCPropertyEditorItemType, PropertyChangeEvent, MinitButtonClickEvent } from 'web-console-ui-kit';
import { OfflineMessagesSettingsComponent } from '../commons/offline_messages/offline-messages-settings-component'
import { EditorPropertyChangeEvent } from '../commons/editors-events';

const LOG_TAG = '[OperationSectionServiceEditor]';

@Component({
    selector: 'wa-services-operation-editor',
    styleUrls: ['./operation-editor-component.scss'],
    templateUrl: './operation-editor-component.html'
})
export class OperationEditorComponent implements OnInit {

    @ViewChild('offlineMessagesEditor') offlineMessagesEditor: OfflineMessagesSettingsComponent;

    @Output() propertyChange: EventEmitter<EditorPropertyChangeEvent> = new EventEmitter();

    
    public offlineMessages: string[] = ['uno', 'due', 'tre'];

    public propertyModel: WCPropertyEditorModel = {
        items: [
          {
            name: 'Description',
            field: 'description',
            type: WCPropertyEditorItemType.String,
            value: ''
          },
          {
            name: 'Plugin Name',
            field: 'pluginName',
            type: WCPropertyEditorItemType.String,
            value: ''
          },
          {
            name: 'Secure',
            field: 'secure',
            type: WCPropertyEditorItemType.Boolean,
            value: false
          },
          {
            name: 'Counted',
            field: 'counter',
            type: WCPropertyEditorItemType.Boolean,
            value: false
          },
          {
            name: 'Session-less',
            field: 'sessionLess',
            type: WCPropertyEditorItemType.Boolean,
            value: false
          },
          {
            name: 'Input Params (JSON)',
            field: 'inputParams',
            type: WCPropertyEditorItemType.String,
            value: ''
          },
          {
            name: 'Output Params (JSON)',
            field: 'outputParams',
            type: WCPropertyEditorItemType.String,
            value: ''
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
