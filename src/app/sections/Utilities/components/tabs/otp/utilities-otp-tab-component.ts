import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NGXLogger} from 'web-console-core';

const LOG_TAG = '[OTPUtilityComponent]';

@Component({
    selector: 'wa-utilities-otp-component',
    styleUrls: ['./utilities-otp-tab-component.scss'],
    templateUrl: './utilities-otp-tab-component.html'
})
export class OTPUtilityComponent implements OnInit {

    constructor(private logger: NGXLogger) {}

    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG, 'Initializing...');
    }

}