import { Component, OnInit } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { Domain, Application, User } from '@wa-motif-open-api/platform-service';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { OTPDataSourceComponent } from './otp-data-source-component';
import { OtpService, OTPEntity, OTPList } from '@wa-motif-open-api/otp-service'

const LOG_TAG = '[OTPUtilityComponent]';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'wa-utilities-otp-component',
    styleUrls: ['./utilities-otp-tab-component.scss'],
    templateUrl: './utilities-otp-tab-component.html'
})
export class OTPUtilityComponent implements OnInit {

    public faArrowAltCircleRight = faArrowAltCircleRight;
    public application: Application;
    public domain: Domain;
    public user: User;
    public dataSource: OTPDataSourceComponent;

    constructor(private logger: NGXLogger, private otpService: OtpService) {
        this.dataSource = new OTPDataSourceComponent(logger, otpService);

        this.dataSource.dataChanged.subscribe( (dataSource: OTPDataSourceComponent) => {
            this.logger.debug(LOG_TAG, 'Data source changed: ', dataSource.data);
        });
        this.dataSource.error.subscribe( (error) => {
            this.logger.error(LOG_TAG, 'Data source error: ', error);
        });

    }

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
