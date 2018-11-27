import { Component, OnInit, ViewChild, Input, ElementRef, Renderer } from '@angular/core';
import { PluginView } from 'web-console-core'
import { NGXLogger} from 'web-console-core'
import { SecurityService } from '@wa-motif-open-api/security-service'
import { SessionRow } from '../data/model'
import { EditService, EditServiceConfiguration } from '../../../components/Grid/edit.service';
import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { map } from 'rxjs/operators/map';
import { WCToasterService } from 'web-console-ui-kit'
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin'

const LOG_TAG = "[SessionsSection]";

@Component({
    selector: 'wa-sessions-section',
    styleUrls: [ './sessions-section.component.scss' ],
    templateUrl: './sessions-section.component.html'
  })
  @PluginView("Sessions",{
    iconName: "ico-configuration" 
  })
export class SessionsSectionComponent implements OnInit {

    public gridData: GridDataResult;
    public gridState: State = {
    };

    constructor(private logger: NGXLogger, 
        private securityService:SecurityService,
        public editService: EditService,
        private toaster: WCToasterService,
        private renderer:Renderer){
        this.logger.debug(LOG_TAG ,"Opening...");
    } 
    
    /**
     * Angular ngOnInit
     */
    ngOnInit() {
        this.logger.debug(LOG_TAG ,"Initializing...");
        this.reloadSessionsList();

        let data = [
            
        ];
        this.gridData = process(data, this.gridState);
    }

    private reloadSessionsList():void {
        this.logger.debug(LOG_TAG ,"reloadSessionsList called...");
        this.securityService.getSessions().subscribe((data)=>{
            this.logger.debug(LOG_TAG ,"sessions: ", data);
            this.gridData = process(data, this.gridState);
        }, (error)=>{
            this.logger.error(LOG_TAG ,"sessions error: ", error);
        });
    }
}
