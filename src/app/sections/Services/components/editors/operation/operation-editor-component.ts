import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'web-console-core';
import { WCPropertyEditorModel, WCPropertyEditorItemType, WCPropertyEditorItem } from 'web-console-ui-kit';
import { NotificationCenter, NotificationType } from '../../../../../components/Commons/notification-center';
import { EditorContext } from '../service-catalog-editor-context';
import { BaseEditorComponent } from '../base-editor-component';
import { Observable } from 'rxjs';
import { OperationsService, ServiceOperation } from '@wa-motif-open-api/catalog-service';

const LOG_TAG = '[OperationSectionServiceEditor]';

@Component({
    selector: 'wa-services-operation-editor',
    styleUrls: ['./operation-editor-component.scss'],
    templateUrl: './operation-editor-component.html'
})
export class OperationEditorComponent extends BaseEditorComponent implements OnInit {


    public operationModel: WCPropertyEditorModel = {
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
            name: 'Encrypted',
            field: 'encryptActive',
            type: WCPropertyEditorItemType.Boolean,
            value: false
          },
          {
            name: 'Counted',
            field: 'counted',
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
            type: WCPropertyEditorItemType.Text,
            value: ''
          },
          {
            name: 'Output Params (JSON)',
            field: 'outputParams',
            type: WCPropertyEditorItemType.Text,
            value: ''
          }
        ]
      };

    constructor(public logger: NGXLogger,
      public operationsService: OperationsService,
      public notificationCenter: NotificationCenter) {
          super(logger, notificationCenter);
          this.setModel(this.operationModel);
    }

  private _currentOperation: ServiceOperation;

  /**
   * Angular ngOnInit
   */
  ngOnInit() {
      this.logger.debug(LOG_TAG, 'Initializing...');
  }

  doRefreshData(editorContext: EditorContext): Observable<any> {
    this.logger.debug(LOG_TAG, 'doRefreshData called for context:' , editorContext);
    return this.refreshOperationInfo(editorContext.domainName,
      editorContext.applicationName,
      editorContext.serviceName,
      editorContext.operationName,
      editorContext.channel);
  }

  doSaveChanges(editorContext: EditorContext): Observable<any> {
    // TODO!!
    return null;
  }

  private refreshOperationInfo(domainName: string,
    applicationName: string,
    serviceName: string,
    operationName: string,
    channel: string): Observable<any> {
    return new Observable((observer) => {

        this.logger.debug(LOG_TAG, 'refreshOperationInfo called. Selected domain and application ',
        domainName, applicationName, serviceName, operationName, channel);
        this.operationsService.getServiceOperation(channel,
           domainName,
           applicationName,
           serviceName,
           operationName).subscribe((operation: ServiceOperation) => {
            this._currentOperation = operation;

            this.toModel(operation);

            this.logger.debug(LOG_TAG, 'Current operation: ', this._currentOperation);

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

  private toModel(operation: ServiceOperation): void {
    this.logger.debug(LOG_TAG, 'toModel called: ', operation);
    try {
      this.getPropertyItem('description').value = operation.description;
      this.getPropertyItem('encryptActive').value = operation.encryptActive;
      this.getPropertyItem('counted').value = operation.counted;
      this.getPropertyItem('pluginName').value = operation.pluginName;
      this.getPropertyItem('secure').value = operation.secure;
      this.getPropertyItem('sessionless').value = operation.sessionless;
      this.getPropertyItem('inputParams').value = operation.inputParams;
      this.getPropertyItem('outputParams').value = operation.outputParams;
    } catch (ex) {
      this.logger.error(LOG_TAG, 'toModel error: ', ex);
    }
  }

}
