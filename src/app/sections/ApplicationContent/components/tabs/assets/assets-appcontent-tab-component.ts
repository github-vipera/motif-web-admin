import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { NGXLogger} from 'web-console-core'
import * as _ from 'lodash';
import { fas, faCoffee, faAdjust, faBatteryHalf, faCircleNotch, faMobile, faMobileAlt, faDownload, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { AssetsService, AssetBundleEntity } from '@wa-motif-open-api/app-content-service'
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
import { ConfirmationDialogComponent } from '../../../../../components/ConfirmationDialog/confirmation-dialog-component'


const LOG_TAG = "[AssetsAppContentSection]";

@Component({
    selector: 'wa-assets-appcontent-tab-component',
    styleUrls: [ './assets-appcontent-tab-component.scss' ],
    templateUrl: './assets-appcontent-tab-component.html'
  })
export class AssetsTabComponent implements OnInit {

    faCloudUploadAlt = faCloudUploadAlt;
    faDownload = faDownload;    
    faMobile = faMobile;
    faMobileAlt = faMobileAlt;
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
    @ViewChild(ConfirmationDialogComponent) confirmationDialog : ConfirmationDialogComponent;

    private _editServiceConfig:EditServiceConfiguration = { idField:"name" , dirtyField:"dirty", isNewField:"isNew"};
    public editService:EditService;

    //Buttons
    public canRefresh:boolean = false;
    public canAddBundle:boolean = false;

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
        this.assetsService.getAssets(this.domainSelector.selectedDomain.name).subscribe((data)=>{
            this.logger.debug(LOG_TAG, "Assets for domain="+ domain.name+ ": ", data);

            data = _.forEach(data, function(element) {
                if (element.created){
                    element.created = new Date(element.created);
                }
            });

            this.editService.cancelChanges();
            this.editService.read(data, this._editServiceConfig);
            this.loading = false;
        }, (error)=>{
            this.logger.error(LOG_TAG, "Load Assets for domain="+ domain.name+ " error: ", error);

            this.notificationCenter.post({
                name:"GetAssestsError",
                title: "Get Assets",
                message: "Error getting assets:",
                type: NotificationType.Error,
                error: error
            });

            this.loading = false;
        });

        this.setOptions(true, true, true, true);
    }

   /**
     * Enable or disable buttons
     * @param canSave 
     * @param canRefresh 
     * @param canExport 
     * @param canAddBundle 
     */
    private setOptions(canSave:boolean, canRefresh:boolean, canExport:boolean, canAddBundle:boolean) : void {
        this.canRefresh = canRefresh;
    }

     /**
     * Button event
     */
    public onRefreshClicked():void {
        if (this.editService.hasChanges()){
            this.confirmationDialog.open("Pending Changes",
                "Attention, in the configuration there are unsaved changes. Proceeding with the refresh these changes will be lost. Do you want to continue?",
                { "action" : "refresh" });
        } else {
            this.refreshData();
        }
    }

    public refreshData(){
        if (this.domainSelector.selectedDomain){
            this.loadData(this.domainSelector.selectedDomain);
        }
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

    public onDeleteOKPressed(assetBundle:AssetBundleEntity){
        this.logger.debug(LOG_TAG ,"onDeleteOKPressed for item: ", assetBundle);
        this.editService.remove(assetBundle);
    }

    public onAssetBundleAddConfirm():void {
        //TODO
    }

    public onAssetBundleAddCancel():void {
        //TODO!!
    }

    onConfirmationCancel(event):void {
        //nop
    }

        /**
     * Event emitted by the confirmation dialog
     * @param userData 
     */
    onConfirmationOK(userData):void {
        this.logger.debug(LOG_TAG ,"onConfirmationOK for:", userData);

        if (userData && userData.action==="refresh"){
            this.refreshData();
        } 
        if (userData && userData.action==="discardChanges"){
            this.editService.cancelChanges();
        }
    }

    /**
     * Button event
     */
    onSaveClicked():void {
        /*
        this.saveAllChanges().subscribe((responses)=>{
            this.refreshData();
            this.logger.debug(LOG_TAG,"Applications updated successfully: ", responses);

            this.notificationCenter.post({
                name:"UpdateApplicationSuccess",
                title: "Update Application",
                message: "The application has been successfully updated.",
                type: NotificationType.Success
            });

        }, (error)=>{
            this.logger.debug(LOG_TAG ,"Error saving applications: ", error);

            this.notificationCenter.post({
                name:"UpdateApplicationError",
                title: "Update Application",
                message: "Error updating applications:",
                type: NotificationType.Error,
                error: error
            });

        });
        */
    }

    /**
     * Button Event
     */
    onDiscardClicked():void {
        if (this.editService.hasChanges()){
            this.confirmationDialog.open("Pending Changes",
                "Attention, in the configuration there are unsaved changes. Proceeding all these changes will be lost. Do you want to continue?",
                { "action" : "discardChanges" });
        } else {
            this.refreshData();
        }
    }

        /**
     * Show the new App panel
     */
    onAddAssetsBundleClicked():void{
        /*
        this.newMobileApp = {
            downloadUrl:null,
            forbiddenVersion:null,
            latestVersion:null,
            name:null
        }
        this.slideDownAddMobileAppPanel(true);
        */
    }


}
