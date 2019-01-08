import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { DomainsService, DomainsList, Domain } from '@wa-motif-open-api/platform-service';
import { NGXLogger} from 'web-console-core';
import { NotificationCenter, NotificationType } from '../../components/Commons/notification-center';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

const LOG_TAG = '[DomainSelectorComboBoxComponent]';

export const WC_DOMAIN_SELECTOR_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DomainSelectorComboBoxComponent),
    multi: true
};

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'wc-domain-selector-combobox',
    styles: [
    ],
    template: `
    <kendo-combobox style="width:100%;" [data]="domainList" 
    [allowCustom]="false" [valueField]="'name'" 
    [textField]="'name'" [(ngModel)]="selectedDomain"></kendo-combobox>
    `,
    providers: [WC_DOMAIN_SELECTOR_CONTROL_VALUE_ACCESSOR]
})
export class DomainSelectorComboBoxComponent implements OnInit {

    public domainList: DomainsList = [];
    public _selectedDomain: Domain; // combo box selection
    @Output() domainSelected: EventEmitter<Domain> = new EventEmitter();
    @Output() selectionCancelled: EventEmitter<any> = new EventEmitter();

    constructor(private logger: NGXLogger,
        private domainsService: DomainsService,
        private notificationCenter: NotificationCenter) {
            this.logger.debug(LOG_TAG, 'Creating...');
    }

    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG, 'Initializing...');
        this.refreshDomainList();
    }

    /**
     * Get the list of the available Domains
     */
    public refreshDomainList(): void {
        this.domainsService.getDomains().subscribe( data => {
        this.domainList = data;
        }, error => {
            this.logger.debug(LOG_TAG ,'refreshDomainList error:', error);
            this.notificationCenter.post({
                name:'RefreshDomainListError',
                title: 'Load Domains',
                message: 'Error loading domains:',
                type: NotificationType.Error,
                error: error,
                closable: true
            });
        });
    } 

    /**
     * Set the selcted domain
     */
    @Input()
    public set selectedDomain(domain: Domain) {
        this._selectedDomain = domain;
        if (this._selectedDomain){
            this.logger.debug(LOG_TAG, 'selectedDomain domain=', this._selectedDomain.name);
            this.domainSelected.emit(this._selectedDomain);
            this.propagateChange(domain);
        } else {
            this.logger.debug(LOG_TAG, 'selectedDomain domain=no selection');
            this.selectionCancelled.emit();
            this.propagateChange(null);
        }
    }

    public get selectedDomain(): Domain {
        return this._selectedDomain;
    }

    propagateChange:any = () => {};

    writeValue(value: any) {
        if ( value ) {
         this._selectedDomain = value;
        }
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: () => void): void { }


}
