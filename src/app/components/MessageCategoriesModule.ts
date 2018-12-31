import { NgModule } from '@angular/core';
import { CategoryPaneComponent, MessageCategoriesComponent, MessagesPaneComponent } from './MessageCategories/index';
import { LoggerModule } from 'web-console-core';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit';


@NgModule({
    imports: [
        LoggerModule,
        LayoutModule,
        WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule
    ],
    entryComponents: [
    ],
    declarations: [
        MessageCategoriesComponent, CategoryPaneComponent, MessagesPaneComponent
    ],
    exports: [ 
        MessageCategoriesComponent ],
    providers: [
    ]
  })
  export class MessageCategoriesModule { }



