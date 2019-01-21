import { Domain } from '@wa-motif-open-api/platform-service';
import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { NGXLogger} from 'web-console-core';
import { NotificationCenter, NotificationType } from '../../../../components/Commons/notification-center';
import { ServiceCatalogSelectorDialogComponent, SelectionEvent } from 'src/app/components/UI/selectors/service-catalog-selector/service-catalog-selector-dialog';
import { SelectionEvent as CounterInfoSelectionEvent } from '../counter-infos/counter-infos-component'
import { faFileImport, faDownload } from '@fortawesome/free-solid-svg-icons';
import { User } from '@wa-motif-open-api/auth-access-control-service';

const LOG_TAG = '[CountersListComponent]';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'wa-counters-list-component',
    styleUrls: ['./counters-list-component.scss'],
    templateUrl: './counters-list-component.html'
})
export class CountersListComponent implements OnInit, OnDestroy {

    faDownload = faDownload;
    faFileImport = faFileImport;
    selectedCounterInfo: any;

    @Input() public selectedDomain: Domain;
    @Input() public selectedUser: User;

    constructor(
        private logger: NGXLogger,
        private notificationCenter: NotificationCenter
    ) {}

    ngOnInit() {
    }

    ngOnDestroy() {
        this.logger.debug(LOG_TAG , 'ngOnDestroy ');
        this.freeMem();
    }

    freeMem() {
    }



}
