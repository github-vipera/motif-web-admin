import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'web-console-core';
import { Application } from '@wa-motif-open-api/platform-service';
import { faCube } from '@fortawesome/free-solid-svg-icons';
import { OTPDataSourceComponent } from './otp-data-source-component';
import { OtpService, Otp, OtpCreate } from '@wa-motif-open-api/otp-service';
import {
  NotificationCenter,
  NotificationType
} from '../../../../../components/Commons/notification-center';

const LOG_TAG = '[OTPUtilityComponent]';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'wa-utilities-otp-component',
  styleUrls: ['./utilities-otp-tab-component.scss'],
  templateUrl: './utilities-otp-tab-component.html'
})
export class OTPUtilityComponent implements OnInit {
  public faCube = faCube;
  public application: Application;
  public dataSource: OTPDataSourceComponent;

  constructor(
    private logger: NGXLogger,
    private otpService: OtpService,
    private notificationCenter: NotificationCenter
  ) {
    this.dataSource = new OTPDataSourceComponent(logger, otpService);

    this.dataSource.error.subscribe(error => {
      this.logger.error(LOG_TAG, 'Data source error: ', error);
      this.notificationCenter.post({
        name: 'LoadOTPError',
        title: 'Load OTP',
        message: 'Error loading OTP:',
        type: NotificationType.Error,
        error: error,
        closable: true
      });
    });
  }

  /**
   * Angular ngOnInit
   */
  ngOnInit() {
    this.logger.debug(LOG_TAG, 'Initializing...');
  }

  onCreateClicked(): void {
    this.logger.debug(
      LOG_TAG,
      'onCreateClicked: ',
      this.dataSource.domain,
      this.application,
      this.dataSource.user
    );
    this.createOTP();
  }

  onRefreshClicked(): void {
    this.dataSource.reload();
  }

  private createOTP(): void {
    if (this.dataSource.domain && this.dataSource.user && this.application){
      const otpCreate: OtpCreate = {
        application: this.application.name
      };
      this.otpService
        .createOtp(
          this.dataSource.domain.name,
          this.dataSource.user.userId,
          otpCreate
        )
        .subscribe(
          (otp: Otp) => {
            this.logger.debug(LOG_TAG, 'createOtp done: ', otp);

            this.notificationCenter.post({
              name: 'CreateOTPSuccess',
              title: 'Create OTP',
              message: 'OTP created successfully.',
              type: NotificationType.Success
            });

            this.dataSource.reload();
          },
          error => {
            this.logger.error(LOG_TAG, 'createOtp error: ', error);

            this.notificationCenter.post({
              name: 'CreateOTPError',
              title: 'Create OTP',
              message: 'Error creating OTP:',
              type: NotificationType.Error,
              error: error,
              closable: true
            });
          }
        );
    } else {
      this.notificationCenter.post({
        name: 'CreateOTPWarn',
        title: 'Create OTP',
        message: 'You need to specify Doman, Application and User correctly.',
        type: NotificationType.Warning
      });
    }
  }

  onDeleteOKPressed(item: Otp): void {
    this.logger.debug(LOG_TAG, 'onDeleteOKPressed: ', item);
    this.deleteOTP(parseInt(item.id, 10));
  }

  private deleteOTP(otpId: number): void {
    this.logger.debug(LOG_TAG, 'deleteOTP: ', otpId);
    this.otpService.deleteOtp(otpId).subscribe(
      data => {
        this.logger.debug(LOG_TAG, 'deleteOTP done: ', otpId);

        this.notificationCenter.post({
          name: 'DeleteOTPSuccess',
          title: 'Delete OTP',
          message: 'OTP deleted successfully.',
          type: NotificationType.Success
        });

        this.dataSource.reload();
      },
      error => {
        this.logger.error(LOG_TAG, 'deleteOTP error: ', error);

        this.notificationCenter.post({
          name: 'DeleteOTPError',
          title: 'Delete OTP',
          message: 'Error deleting OTP:',
          type: NotificationType.Error,
          error: error,
          closable: true
        });
      }
    );
  }
}
