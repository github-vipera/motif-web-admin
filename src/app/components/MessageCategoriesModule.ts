import { NgModule } from '@angular/core';
import { CategoryPaneComponent, MessageCategoriesComponent, MessagesPaneComponent } from './MessageCategories/index';
import { LoggerModule } from 'web-console-core';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule } from 'web-console-ui-kit';
import { CommonsUIModule } from './CommonsUIModule';
import { LocaleNamePipe } from './MessageCategories/data/model';

@NgModule({
    imports: [
        LoggerModule,
        LayoutModule,
        WebConsoleUIKitCoreModule, WebConsoleUIKitDataModule, WebConsoleUIKitKendoProviderModule, CommonsUIModule
    ],
    entryComponents: [
    ],
    declarations: [
        MessageCategoriesComponent, CategoryPaneComponent, MessagesPaneComponent, LocaleNamePipe
    ],
    exports: [
        MessageCategoriesComponent ],
    providers: [

    ]
  })
  export class MessageCategoriesModule { }



