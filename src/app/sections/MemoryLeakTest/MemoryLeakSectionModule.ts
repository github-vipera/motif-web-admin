import { NgModule } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { LogServiceModule } from '@wa-motif-open-api/log-service';
import { LoggerModule } from 'web-console-core';
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit';
import { ClipboardModule } from 'ngx-clipboard';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PluginRegistryServiceModule } from '@wa-motif-open-api/plugin-registry-service';
import { CommonsUIModule } from '../../components/CommonsUIModule';
import { FooASectionComponent } from './components/a/foo-a-section-component';
import { FooBSectionComponent } from './components/b/foo-b-section-component';
import { FooCSectionComponent } from './components/c/foo-c-section-component';

@NgModule({
    imports: [
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
        CommonsUIModule
    ],
    entryComponents:[
        FooASectionComponent, FooBSectionComponent, FooCSectionComponent
    ],
    declarations: [
        FooASectionComponent, FooBSectionComponent, FooCSectionComponent
    ],
    exports: [ FooASectionComponent, FooBSectionComponent, FooCSectionComponent ],
    providers: [
    ]

})
export class MemoryLeakSectionModule { }



