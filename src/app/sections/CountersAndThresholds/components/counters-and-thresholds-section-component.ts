import { NotificationCenter } from './../../../components/Commons/notification-center';
import { ServiceCatalogSelectorDialogComponent, SelectionEvent } from './../../../components/UI/selectors/service-catalog-selector/service-catalog-selector-dialog';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { PluginView } from 'web-console-core';

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
        this._entitySelector.open('Select an Entity');
    }

    onEntrySelected(selectionEvent: SelectionEvent) {
        this.logger.debug(LOG_TAG, 'onEntrySelected: ', selectionEvent);
    }
}