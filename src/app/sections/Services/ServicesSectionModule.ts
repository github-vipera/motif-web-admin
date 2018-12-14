import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { LogServiceModule } from '@wa-motif-open-api/log-service'
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LoggerModule } from 'web-console-core'
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit'
import { ClipboardModule } from 'ngx-clipboard';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { PluginRegistryServiceModule } from '@wa-motif-open-api/plugin-registry-service'
import { CommonsUIModule } from '../../components/CommonsUIModule'
import { ServicesSectionComponent } from './components/services-section-component'
import { WebAdminCommonServicesModule } from '../../services/WebAdminCommonServicesModule'
import { TreeTableModule } from 'primeng/treetable';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ServiceCataglogEditorComponent } from './components/editors/service-catalog-editor-component';
import { DomainEditorComponent } from './components/editors/domain/domain-editor-component';
import { ApplicationEditorComponent } from './components/editors/application/application-editor-component';
import { ServiceEditorComponent } from './components/editors/service/service-editor-component';

@NgModule({
    imports: [
        DialogModule,
        LogServiceModule,
        GridModule,
        LoggerModule,
        WebConsoleUIKitCoreModule,
        WebConsoleUIKitDataModule,
        WebConsoleUIKitKendoProviderModule,
        ClipboardModule,
        DateInputsModule,
        FontAwesomeModule,
        PluginRegistryServiceModule,
        CommonsUIModule,
        WebAdminCommonServicesModule,
        TreeTableModule,
        LayoutModule
    ],
    entryComponents: [
        ServicesSectionComponent
    ],
    declarations: [
        ServicesSectionComponent,
        ServiceCataglogEditorComponent,
        DomainEditorComponent,
        ApplicationEditorComponent,
        ServiceEditorComponent
    ],
    exports: [ ServicesSectionComponent ],
    providers: [  ]
  })
  export class ServicesSectionModule { }



