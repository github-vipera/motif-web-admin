import { Component, OnInit } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { Application } from '@wa-motif-open-api/platform-service';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { OTPDataSourceComponent } from './otp-data-source-component';
import { OtpService, Otp, OtpCreate } from '@wa-motif-open-api/otp-service'
import { NotificationCenter, NotificationType } from '../../../../../components/Commons/notification-center';

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
    public dataSource: OTPDataSourceComponent;

    constructor(private logger: NGXLogger,
        private otpService: OtpService,
        private notificationCenter: NotificationCenter
    ) {
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


    onSendClicked(): void {
        this.logger.debug(LOG_TAG, 'onSendClicked: ', this.dataSource.domain, this.application, this.dataSource.user);
        this.createOtp();
    }

    private createOtp(): void {
        const otpCreate: OtpCreate = {
            application: this.application.name
        };
        this.otpService.createOtp(this.dataSource.domain.name, this.dataSource.user.userId, otpCreate).subscribe( (otp: Otp) => {
            this.logger.debug(LOG_TAG, 'createOtp done: ', otp);

            this.notificationCenter.post({
                name: 'CreateOTPSuccess',
                title: 'Create OTP',
                message: 'OTP created successfully.',
                type: NotificationType.Success
            });

            this.dataSource.reload();
        }, (error) => {
            this.logger.error(LOG_TAG, 'createOtp error: ', error);

            this.notificationCenter.post({
                name: 'CreateOTPError',
                title: 'Create OTP',
                message: 'Error creating OTP:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });

        });
    }

}
