import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { Domain, Application, User } from '@wa-motif-open-api/platform-service';
import { faCoffee, faMobile, faMobileAlt } from '@fortawesome/free-solid-svg-icons';

const LOG_TAG = '[OTPUtilityComponent]';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'wa-utilities-otp-component',
    styleUrls: ['./utilities-otp-tab-component.scss'],
    templateUrl: './utilities-otp-tab-component.html'
})
export class OTPUtilityComponent implements OnInit {

    public faCoffee = faCoffee;
    public application: Application;
    public domain: Domain;
    public user: User;

    constructor(private logger: NGXLogger) {}

    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG, 'Initializing...');
    }

    onDomainSelected(domain: Domain) {
        this.domain = domain;
        this.logger.debug(LOG_TAG, 'onDomainSelected: ', this.domain);
    }

    onApplicationSelected(application: Application) {
        this.application = application;
        this.logger.debug(LOG_TAG, 'onApplicationSelected: ', this.application);
    }


    onSendClicked(): void {
        alert('TODO!!');
    }

}
