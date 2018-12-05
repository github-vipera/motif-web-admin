import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NGXLogger} from 'web-console-core'
import * as _ from 'lodash';
import { DomainsService, Domain } from '@wa-motif-open-api/platform-service'
import { EnginesService , Engine, EngineCreate, EngineList, EngineUpdate } from '@wa-motif-open-api/app-content-service'
import { DataResult } from '@progress/kendo-data-query';
import { DomainSelectorComboBoxComponent } from '../../../../../components/UI/domain-selector-combobox-component'
import {ToasterUtilsService } from '../../../../../components/UI/toaster-utils-service'
import { EditService, EditServiceConfiguration } from '../../../../../components/Grid/edit.service';
import { Observable } from 'rxjs/Observable';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { MobileApplicaton } from '../../../data/model'
import { map } from 'rxjs/operators/map';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../../../../components/ConfirmationDialog/confirmation-dialog-component'
import { faCoffee, faMobile, faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import { ErrorMessageBuilderService } from '../../../../../components/Commons/error-message-builder-service'

const LOG_TAG = "[ApplicationsAppContentSection]";

@Component({
    selector: 'wa-appcontent-applications-tab',
    styleUrls: [ './applications-appcontent-tab-component.scss' ],
    templateUrl: './applications-appcontent-tab-component.html'
  })
export class ApplicationsTabComponent implements OnInit {
    
    faCoffee = faCoffee;
    faMobile = faMobile;
    faMobileAlt = faMobileAlt;

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

    //Buttons
    public canSave:boolean = false;
    public canRefresh:boolean = false;
    public canExport:boolean = true;
    public canAddProperty:boolean = false;
    
    public newMobileApp:EngineCreate = {
        downloadUrl:null,
        forbiddenVersion:null,
        latestVersion:null,
        name:null
    }


    @ViewChild ('domainSelector') domainSelector: DomainSelectorComboBoxComponent;
    @ViewChild(ConfirmationDialogComponent) confirmationDialog : ConfirmationDialogComponent;
    @ViewChild('exportSlideDown') exportSlideDown:ElementRef;

    private _editServiceConfig:EditServiceConfiguration = { idField:"name" , dirtyField:"dirty", isNewField:"isNew"};

    constructor(private logger: NGXLogger, 
        private domainsService:DomainsService,
        private engineService:EnginesService,
        private toasterService:ToasterUtilsService,
        private formBuilder: FormBuilder,
        private editService: EditService,
        private renderer2:Renderer2,
        private errorMessageBuilderService:ErrorMessageBuilderService
        ){
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
        this.engineService.getEngines(domain.name).subscribe((data)=>{
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
            this.toasterService.showError("Get Applications", "Error getting applications: "+ error.error);
            this.loading = false;
        });
        this.setOptions(true, true, true, true);
    }

    public onDeleteOKPressed(mobileApplication:EngineCreate){
        this.engineService.deleteEngine(this.domainSelector.selectedDomain.name,mobileApplication.name).subscribe((data)=>{
            this.logger.debug(LOG_TAG ,"new Mobile Application deleted:", data);
            this.toasterService.showInfo("Delete Application", "THe application '"+mobileApplication.name +"' has been deleted successfully.");
            this.refreshData()
        },(error)=>{
            this.logger.error(LOG_TAG ,"New Mobile Application creation error:", error);
            this.toasterService.showError("Delete Application", "An error occurred while deleting new '"+ this.newMobileApp.name +"' application: " + error.error.Details);
        })
    }

    public refreshData(){
        if (this.domainSelector.selectedDomain){
            this.loadData(this.domainSelector.selectedDomain);
        }
    }

        /**
     * Enable or disable buttons
     * @param canSave 
     * @param canRefresh 
     * @param canExport 
     * @param canAddProperty 
     */
    private setOptions(canSave:boolean, canRefresh:boolean, canExport:boolean, canAddProperty:boolean) : void {
        this.canSave = canSave;
        this.canRefresh = canRefresh;
        this.canExport = canExport;
        this.canAddProperty = canAddProperty;
    }

    /**
     * User selection on click
     * triggered by the grid
     * @param param0 
     */
    public cellClickHandler({ sender, rowIndex, columnIndex, dataItem, isEdited }): void {
        if (!isEdited) {
            sender.editCell(rowIndex, columnIndex, this.createFormGroupForEdit(dataItem));
        }
    }

    /**
     * triggered by the grid
     */
    public cellCloseHandler(args: any) {
        const { formGroup, dataItem } = args;
        if (!formGroup.valid) {
             // prevent closing the edited cell if there are invalid values.
            args.preventDefault();
        } else if (formGroup.dirty) {
            this.editService.assignValues(dataItem, formGroup.value);
            this.editService.update(dataItem);
        }
    }

        /**
     * Prepare edit form for inline editing
     */
    public createFormGroupForEdit(mobileApp: MobileApplicaton): FormGroup {
        this.logger.debug(LOG_TAG,"createFormGroupForEdit:", mobileApp.name);
        return this.formBuilder.group({
            'name': mobileApp.name,
            'downloadUrl': mobileApp.downloadUrl,
            'latestVersion': mobileApp.latestVersion,
            'forbiddenVersions': mobileApp.forbiddenVersions
        });
    }

    /**
     * Button event
     */
    onSaveClicked():void {
        this.logger.debug(LOG_TAG ,"Save clicked");
        alert("TODO!!");
        /*
        this.saveAllChanges().subscribe((responses)=>{
            this.reloadConfigurationParams();
            this.logger.debug(LOG_TAG,"Settings saved successfully: ", responses);
            this.toasterService.showInfo("Settings saved successfully.", "Settings Update");
        }, (error)=>{
            this.logger.debug(LOG_TAG ,"Error saving settings: ", error);
            this.toasterService.showError("Error saving settings: " +  error, "Settings Update Error");
        });
        */
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
     * Event emitted by the editor form
     */
    onEditCancel():void {
        this.logger.debug(LOG_TAG ,"On Edit Cancelled");
        this.editDataItem = undefined;
    }

    /**
     * Triggered by the new Property Editor Dialog
     * @param event 
     */
    onEditCommit(newMobileApp:MobileApplicaton):void {
        this.logger.debug(LOG_TAG ,"onEditCommit new row:", newMobileApp);
        this.editService.create(newMobileApp);
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

    onConfirmationCancel(event):void {
        //nop
    }

    onMobileAppClicked():void{
        this.newMobileApp = {
            downloadUrl:null,
            forbiddenVersion:null,
            latestVersion:null,
            name:null
        }
        this.slideDownAddMobileAppPanel(true);
    }

    private slideDownAddMobileAppPanel(show:boolean):void {
        if (show){
            this.renderer2.removeClass(this.exportSlideDown.nativeElement, 'closed');
        } else {
            this.renderer2.addClass(this.exportSlideDown.nativeElement, 'closed');
        } 
    }

    onMobileApplicationAddCancel():void{
        this.slideDownAddMobileAppPanel(false);
    }

    onMobileApplicationAddConfirm():void {
        this.slideDownAddMobileAppPanel(false);
        //Sanitize mandatory params
        if (!this.newMobileApp.downloadUrl) { this.newMobileApp.downloadUrl = "" }
        if (!this.newMobileApp.forbiddenVersion) { this.newMobileApp.forbiddenVersion = "" }
        this.engineService.createEngine(this.domainSelector.selectedDomain.name, this.newMobileApp).subscribe((data)=>{
            this.logger.debug(LOG_TAG ,"new Mobile Application created:", data);
            this.toasterService.showInfo("New Application", "New application '"+ this.newMobileApp.name +"' created successfully.");
            this.refreshData()
        },(error)=>{
            this.logger.error(LOG_TAG ,"New Mobile Application creation error:", error);
            this.toasterService.showError("New Application", "An error occurred while creating the new '"+ this.newMobileApp.name +"' application: " + this.errorMessageBuilderService.buildErrorMessage(error));
        });
    }

}
