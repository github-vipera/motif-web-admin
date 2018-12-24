import { Injectable } from '@angular/core';
import { ErrorMessageBuilderService } from './error-message-builder-service';
import { ToasterUtilsService } from '../UI/toaster-utils-service';
import { NotificationService, Type } from '@progress/kendo-angular-notification';

export enum NotificationType {
    Info = 1,
    Success,
    Warning,
    Error
}

export interface Notification {
    name: string;
    message: string;
    title: string;
    object?: any;
    userInfo?: any;
    error?: any;
    type: NotificationType;
    closable?: boolean;
}


@Injectable()
export class NotificationCenter {

    constructor(private errorMessageBuilderService: ErrorMessageBuilderService,
        private toasterService: ToasterUtilsService,
        private notificationService: NotificationService) {
    }

    public post(notification: Notification): void {
        this.handleNotification(notification);
        // TODO!! collect notifications in a browsable pane
    }

    private handleNotification(notification: Notification): void {
        const closable = (notification.closable ? notification.closable : false);
        this.notificationService.show({
            content: this.messageFromNotification(notification),
            animation: { type: 'fade', duration: 200 },
            position: { horizontal: 'center', vertical: 'bottom' },
            type: this.typeFromNotification(notification),
            closable: closable
        });
    }

    private messageFromNotification(notification: Notification): string {
        let message = '';
        if ((notification.type === NotificationType.Error) && notification.error) {
            message = notification.message + ' ' + this.errorMessageBuilderService.buildErrorMessage(notification.error);
        } else {
            message = notification.message;
        }
        return message;
    }

    private typeFromNotification(notification: Notification): Type {
        if (notification.type === NotificationType.Info) {
            return { style: 'info', icon: true };
        } else if (notification.type === NotificationType.Success) {
            return { style: 'success', icon: true };
        } else if (notification.type === NotificationType.Warning) {
            return { style: 'warning', icon: true };
        } else if (notification.type === NotificationType.Error) {
            return { style: 'error', icon: true };
        } else {
            return { style: 'info', icon: true };
        }
    }

}
