import { NotificationCenter } from './../../../components/Commons/notification-center';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { PluginView } from 'web-console-core';
import { ServiceCatalogSelectorDialogComponent, SelectionEvent } from 'src/app/components/UI/selectors/service-catalog-selector/service-catalog-selector-dialog';
import { CounterInfoEditDialogComponent, EditType } from './dialogs/new-counter-info-edit-dialog/counter-info-edit-dialog-component';

const LOG_TAG = '[CountersAndThresholdsSection]';

@Component({
    selector: 'wa-counters-and-thresholds-section',
    styleUrls: ['./counters-and-thresholds-section-component.scss'],
    templateUrl: './counters-and-thresholds-section-component.html'
})
@PluginView('Counters & Thresholds', {
    iconName: 'ico-thresholds'
})
export class CountersAndThresholdsSectionComponent implements OnInit {

    @ViewChild('counterInfoDialog') counterInfoDialog: CounterInfoEditDialogComponent;

    constructor(private logger: NGXLogger, 
        private notificationCenter: NotificationCenter) {}

    @ViewChild('entitySelector') _entitySelector: ServiceCatalogSelectorDialogComponent;

    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG, 'Initializing...');
    }

    ontestClick() {
        this.counterInfoDialog.show(EditType.New, 'testname', 'testdesc', true, 'currentPattern', 'testfunction', 'testparams');
    }

    onEntrySelected(selectionEvent: SelectionEvent) {
        this.logger.debug(LOG_TAG, 'onEntrySelected: ', selectionEvent);
    }
}
