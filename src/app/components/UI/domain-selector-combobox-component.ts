import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomainsService, DomainsList, Domain } from '@wa-motif-open-api/platform-service'
import { NGXLogger} from 'web-console-core'

const LOG_TAG = "[DomainSelectorComboBoxComponent]";

@Component({
    selector: 'wc-domain-selector-combobox',
    styles: [
    ],
    template: `
    <kendo-combobox style="width:100%;" [data]="domainList" [allowCustom]="false" [valueField]="'name'" [textField]="'name'" [(ngModel)]="selectedDomain"></kendo-combobox>
    `
})
export class DomainSelectorComboBoxComponent implements OnInit {

    public domainList: DomainsList = [];
    public _selectedDomain:Domain; //combo box selection
    @Output() domainSelected: EventEmitter<Domain> = new EventEmitter();
    @Output() selectionCancelled: EventEmitter<any> = new EventEmitter();

    constructor(private logger: NGXLogger, 
        private domainsService:DomainsService ){
            this.logger.debug(LOG_TAG ,"Creating...");
    } 

        /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG ,"Initializing...");
        this.refreshDomainList();
    }

    /**
     * Get the list of the available Domains
     */
    public refreshDomainList():void {
        this.domainsService.getDomains().subscribe(data=>{
        this.domainList = data;
        }, error=>{
        console.error("Error: ", error);
        });
    } 

    /**
     * Set the selcted domain
     */
    @Input()
    public set selectedDomain(domain:Domain){
        this._selectedDomain = domain;
        if (this._selectedDomain){
            this.logger.debug(LOG_TAG, "selectedDomain domain=", this._selectedDomain.name);
            this.domainSelected.emit(this._selectedDomain);
        } else {
            this.logger.debug(LOG_TAG, "selectedDomain domain=no selection");
            this.selectionCancelled.emit();
        }
    }
    
    public get selectedDomain():Domain {
        return this._selectedDomain;
    }

}