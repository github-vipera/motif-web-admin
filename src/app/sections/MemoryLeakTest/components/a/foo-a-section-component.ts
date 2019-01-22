import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PluginView } from 'web-console-core';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import {
    GridDataResult
} from '@progress/kendo-angular-grid';
import * as _ from 'lodash';
import { MenuItem, TreeNode } from 'primeng/api';

const LOG_TAG = '[FooASection]';

@Component({
    selector: 'foo-a-section-component',
    styleUrls: [ './foo-a-section-component.scss' ],
    templateUrl: './foo-a-section-component.html'
  })
  @PluginView('FooA', {
    iconName: 'ico-plugins'
})
export class FooASectionComponent implements OnInit, OnDestroy {

    public gridDataLeft: any[] = [
        { name: 'pippo', description: 'è un cane' },
        { name: 'pluto', description: 'è un cane' },
        { name: 'paperino', description: 'è un papero' },
        { name: 'minnie', description: 'è un topo' },
        { name: 'topolino', description: 'è un topo' },
    ];

    //public gridDataRight: any[] = products;

    constructor(){
    }

    ngOnDestroy(): void {
    }
    
    ngOnInit(): void {
    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            //no movement
        } else {
            alert("Dropped!");
            /*
        transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
                        */
        }
    }

}
