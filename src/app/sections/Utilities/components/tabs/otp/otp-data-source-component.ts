import { OnInit, Input, EventEmitter } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { OtpService, OTPList } from '@wa-motif-open-api/otp-service';
import { Domain, User } from '@wa-motif-open-api/platform-service';
import * as _ from 'lodash';
import { SubscriptionHandler } from '../../../../../components/Commons/subscription-handler';

const LOG_TAG = '[OTPdataSourceComponent]';

export class OTPDataSourceComponent implements OnInit {

    private _domain: Domain;
    private _user: User;
    private _data: OTPList;

    public dataChanged: EventEmitter<OTPDataSourceComponent> =  new EventEmitter<OTPDataSourceComponent>();
    public error: EventEmitter<any> =  new EventEmitter();

    private _subHandler: SubscriptionHandler = new SubscriptionHandler();

    constructor(private logger: NGXLogger,
        private otpService: OtpService) {}

    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG, 'Initializing...');
    }

    public close() {
        this._domain = null;
        this._user = null;
        this._data = null;
        this._subHandler.unsubscribe();
        this._subHandler = null;
    }

    @Input('user')
    public set user(user: User) {
        this.logger.debug(LOG_TAG, 'set user: ', user);
        this._user = user;
        this.reload();
    }

    @Input('domain')
    public set domain(domain: Domain) {
        this.logger.debug(LOG_TAG, 'set domain: ', domain);
        this._domain = domain;
        this.reload();
    }

    public get user(): User {
        return this._user;
    }

    public get domain(): Domain {
        return this._domain;
    }

    public reload(): void {
        this.logger.debug(LOG_TAG, 'refreshData called...');
        if (this._domain && this.user) {
            this._subHandler.add(this.otpService.getOtpList(this._domain.name, this._user.userId).subscribe( (list: OTPList) => {
                this.logger.debug(LOG_TAG, 'refreshData done: ', list);

                this._data = _.forEach(list, function (element) {
                    if (element.created) {
                        element.created = new Date(element.created);
                    }
                });
                this.dataChanged.emit(this);
                this.logger.debug(LOG_TAG, 'refreshData done: ', list);

            }, (error) => {
                this.logger.error(LOG_TAG, 'refreshData error: ', error);
                this.error.emit(error);
            }));
        }
    }

    public get data(): OTPList {
        return this._data;
    }

}
