import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { NGXLogger} from 'web-console-core'
import * as _ from 'lodash';
import { fas, faCoffee, faAdjust, faBatteryHalf, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { AssetsService,  } from '@wa-motif-open-api/app-content-service'
import { MobileApplicaton } from '../../../data/model'
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { Observable } from 'rxjs/Observable';
import { DataResult } from '@progress/kendo-data-query';
import { DomainSelectorComboBoxComponent } from '../../../../../components/UI/domain-selector-combobox-component'
import { EditService, EditServiceConfiguration } from '../../../../../components/Grid/edit.service';
import { Domain } from '@wa-motif-open-api/platform-service'
import { map } from 'rxjs/operators/map';
import { NotificationCenter, NotificationType } from '../../../../../components/Commons/notification-center'


const LOG_TAG = "[AssetsAppContentSection]";

@Component({
    selector: 'wa-assets-appcontent-tab-component',
    styleUrls: [ './assets-appcontent-tab-component.scss' ],
    templateUrl: './assets-appcontent-tab-component.html'
  })
export class AssetsTabComponent implements OnInit {

    faCoffee = faCoffee;
    faAdjust = faAdjust;
    faBatteryHalf = faBatteryHalf;
    faCircleNotch = faCircleNotch;
    fas = fas;

    public view: Observable<GridDataResult>;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 10
    };
    public changes: any = {};
    public editDataItem:MobileApplicaton;

    public gridView: DataResult;
    public loading:boolean;

    @ViewChild ('domainSelector') domainSelector: DomainSelectorComboBoxComponent;
    @ViewChild('exportSlideDown') exportSlideDown:ElementRef;

    private _editServiceConfig:EditServiceConfiguration = { idField:"name" , dirtyField:"dirty", isNewField:"isNew"};
    private editService:EditService;

    //Buttons
    public canRefresh:boolean = false;
    
    constructor(private logger: NGXLogger, 
        private notificationCenter: NotificationCenter,
        private assetsService:AssetsService){
        this.logger.debug(LOG_TAG ,"Opening...");
        this.editService = new EditService();
        this.editService.init();
        this.logger.debug(LOG_TAG ,"Opening...");
    } 
    
    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG ,"Initializing...");
        this.view = this.editService.pipe(map(data => process(data, this.gridState)));
    }

    /**
     * Triggered by the grid component
     * @param state 
     */
    public onStateChange(state: State) {
        this.gridState = state;
        this.logger.debug(LOG_TAG ,"onStateChange: ", state);
    }

    public onDomainSelected(domain:Domain){
        if (domain){
            this.loadData(domain);
            this.setOptions(true, true, true, true);
        }  else {
            this.editService.read([], this._editServiceConfig);
            this.setOptions(false, false, true, false);
        }
    }

    public loadData(domain:Domain):void {
        this.loading = true;
        /*
        this.assetsService.(domain.name).subscribe((data)=>{
            this.logger.debug(LOG_TAG, "Engines for domain="+ domain.name+ ": ", data);

            data = _.forEach(data, function(element) {
                if (element.lastAppCheck){
                    element.lastAppCheck = new Date(element.lastAppCheck);
                }
                if (element.created){
                    element.created = new Date(element.created);
                }
            });

            this.logger.debug(LOG_TAG ,"reloadConfigurationParamsForService done: ", data);
            this.editService.cancelChanges();
            this.editService.read(data, this._editServiceConfig);
            this.loading = false;

        }, (error)=>{
            this.logger.error(LOG_TAG, "Load Engines for domain="+ domain.name+ " error: ", error);
            this.toasterService.showError("Get Applications", "Error getting applications: "+ this.errorMessageBuilderService.buildErrorMessage(error));
            this.loading = false;
        });
        */
        this.setOptions(true, true, true, true);
    }

   /**
     * Enable or disable buttons
     * @param canSave 
     * @param canRefresh 
     * @param canExport 
     * @param canAddProperty 
     */
    private setOptions(canSave:boolean, canRefresh:boolean, canExport:boolean, canAddProperty:boolean) : void {
        this.canRefresh = canRefresh;
    }

     /**
     * Button event
     */
    public onRefreshClicked():void {
        /*
        if (this.editService.hasChanges()){
            this.confirmationDialog.open("Pending Changes",
                "Attention, in the configuration there are unsaved changes. Proceeding with the refresh these changes will be lost. Do you want to continue?",
                { "action" : "refresh" });
        } else {
            this.refreshData();
        }
        */
    }

        /**
     * User selection on click
     * triggered by the grid
     * @param param0 
     */
    public cellClickHandler({ sender, rowIndex, columnIndex, dataItem, isEdited }): void {
        /*
        if (!isEdited) {
            sender.editCell(rowIndex, columnIndex, this.createFormGroupForEdit(dataItem));
        }
        */
    }

      /**
     * triggered by the grid
     */
    public cellCloseHandler(args: any) {
        /*
        const { formGroup, dataItem } = args;
        if (!formGroup.valid) {
             // prevent closing the edited cell if there are invalid values.
            args.preventDefault();
        } else if (formGroup.dirty) {
            this.editService.assignValues(dataItem, formGroup.value);
            this.editService.update(dataItem);
        }
        */
    }

    public onAssetBundleAddConfirm():void {
        //TODO
    }

    public onAssetBundleAddCancel():void {
        //TODO!!
    }
}
