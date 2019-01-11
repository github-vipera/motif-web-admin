import { Component, OnInit, OnDestroy } from '@angular/core';
import { PluginView } from 'web-console-core';
import { NGXLogger} from 'web-console-core';

import {
    GridDataResult
} from '@progress/kendo-angular-grid';
import * as _ from 'lodash';

const LOG_TAG = '[FooBSection]';

@Component({
    selector: 'foo-b-section-component',
    styleUrls: [ './foo-b-section-component.scss' ],
    templateUrl: './foo-b-section-component.html'
  })
  @PluginView('FooB', {
    iconName: 'ico-plugins'
})
export class FooBSectionComponent implements OnInit, OnDestroy {

    constructor(private logger: NGXLogger) {
        this.logger.debug(LOG_TAG , 'Opening...');

    }

    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG , 'Initializing...');
    }

    ngOnDestroy() {
        this.logger.debug(LOG_TAG , 'ngOnDestroy ');
    }

}
