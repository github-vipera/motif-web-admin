import { Component, OnInit, OnDestroy } from '@angular/core';
import { PluginView } from 'web-console-core';
import { NGXLogger} from 'web-console-core';

import {
    GridDataResult
} from '@progress/kendo-angular-grid';
import * as _ from 'lodash';

const LOG_TAG = '[FooASection]';

@Component({
    selector: 'foo-a-section-component',
    styleUrls: [ './foo-a-section-component.scss' ],
    templateUrl: './foo-a-section-component.html'
  })
  @PluginView('FooA', {
    iconName: 'ico-plugins'
})
export class FooASectionComponent implements OnInit, OnDestroy {

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
