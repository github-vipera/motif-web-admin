import { DomainSelectorComboBoxComponent } from './../../../../components/UI/selectors/domain-selector-combobox-component';
import { UsersSelectorComboBoxComponent } from './../../../../components/UI/selectors/users-selector-combobox-component';
import { SubscriptionHandler } from './../../../../components/Commons/subscription-handler';
import { GridComponent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Domain } from '@wa-motif-open-api/platform-service';
import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { NGXLogger, MotifQuerySort, MotifQueryResults} from 'web-console-core';
import { NotificationCenter, NotificationType } from '../../../../components/Commons/notification-center';
import { User } from '@wa-motif-open-api/auth-access-control-service';
import { UsersService } from '@wa-motif-open-api/counters-thresholds-service';
import { SortDescriptor } from '@progress/kendo-data-query';

const LOG_TAG = '[CountersListComponent]';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'wa-counters-list-component',
    styleUrls: ['./counters-list-component.scss'],
    templateUrl: './counters-list-component.html'
})
export class CountersListComponent implements OnInit, OnDestroy {

    @ViewChild(GridComponent) _grid: GridComponent;
    @ViewChild('userSelector') userSelector: UsersSelectorComboBoxComponent;
    @ViewChild('domainSelector') domainSelector: DomainSelectorComboBoxComponent;

    @Input() public selectedDomain: Domain;
    private _selectedUser: User;
    public loading = false;

    private _subHandler: SubscriptionHandler = new SubscriptionHandler();

    // Grid Management
    public pageSize = 15;
    public skip = 0;
    public currentPage = 1;
    public totalPages = 0;
    public totalRecords = 0;
    public sort: SortDescriptor[] = [];

    constructor(
        private logger: NGXLogger,
        private notificationCenter: NotificationCenter,
        private usersService: UsersService
    ) {}

    ngOnInit() {
    }

    ngOnDestroy() {
        this.logger.debug(LOG_TAG , 'ngOnDestroy ');
        this.freeMem();
    }

    freeMem() {
    }

    private loadData(domain: Domain, user: User, pageIndex: number, pageSize: number) {
        // tslint:disable-next-line:max-line-length
        this.logger.debug(LOG_TAG, 'loadData domain=\'' + domain + '\' user=\'' + user + '\' pageIndex=', pageIndex, ' pageSize=', pageSize);

        this.loading = true;

        const sort: MotifQuerySort = this.buildQuerySort();

        const domainName = (domain ? domain.name : null);
        const userId = (user ? user.userId : null);
        const counterInfo: string = null;

        this._subHandler.add(this.usersService.getUserCounters(domainName, userId, counterInfo, pageIndex, pageSize, null, 'response').subscribe((response) => {

            const results: MotifQueryResults = MotifQueryResults.fromHttpResponse(response);

            this.logger.debug(LOG_TAG, 'loadUserCounters Query results:', results);

            /*
            this._sessionRows = _.forEach(results.data, function (element) {
                element.lastAccess = new Date(element.lastAccess);
            });

            this.totalPages = results.totalPages;
            this.totalRecords = results.totalRecords;
            this.currentPage = results.pageIndex;
            this.gridView = {
                data: this._sessionRows,
                total: results.totalRecords
            };
            */
            this.loading = false;

        }, error => {
            this.logger.error(LOG_TAG, 'loadUserCounters failed: ', error);
            this.loading = false;

            this.notificationCenter.post({
                name: 'LoadUserCountersError',
                title: 'Load User Counters',
                message: 'Error loading user counters:',
                type: NotificationType.Error,
                error: error,
                closable: true

            });
            this.loading = false;

        }));
    }

    public pageChange({ skip, take }: PageChangeEvent): void {
        this.logger.debug(LOG_TAG, 'pageChange skip=', skip, ' take=', take);
        this.skip = skip;
        this.pageSize = take;
        const newPageIndex = this.calculatePageIndex(skip, take);
        this.loadData(this.domainSelector.selectedDomain, this.userSelector.selectedUser, newPageIndex, this.pageSize);
    }

    private calculatePageIndex(skip: number, take: number): number {
        return (skip / take) + 1;
    }

    private buildQuerySort(): MotifQuerySort {
        this.logger.debug(LOG_TAG, 'buildQuerySort: ', this.sort);
        const querySort = new MotifQuerySort();
        if (this.sort) {
            for (let i = 0; i < this.sort.length; i++) {
                const sortInfo = this.sort[i];
                if (sortInfo.dir && sortInfo.dir === 'asc') {
                    querySort.orderAscendingBy(sortInfo.field);
                } else if (sortInfo.dir && sortInfo.dir === 'desc') {
                    querySort.orderDescendingBy(sortInfo.field);
                }
            }
        }
        return querySort;
    }


    /**
     * Reload the list of the current sessions
     */
    public refreshData(): void {
        if (this.canRefresh){
            this.loadData(this.selectedDomain, this.userSelector.selectedUser, this.currentPage, this.pageSize);
        }
    }

    public onRefreshClicked(): void {
        this.refreshData();
    }

    public get canRefresh(): boolean {
        return (this.domainSelector.selectedDomain != null && this.userSelector.selectedUser != null);
    }

    @Input() public set selectedUser(user: User) {
        this._selectedUser = user;
        this.refreshData();
    }

    public get selectedUser(): User {
        return this._selectedUser;
    }


}
