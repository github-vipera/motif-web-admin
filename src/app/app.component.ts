import { TopMenuComponent } from './components/TopMenu/top-menu-component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WCTopBarService, WCTopBarItem, AuthService } from 'web-console-core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';

  constructor(private topBarService: WCTopBarService, private authService: AuthService){
  }

  ngOnInit() {  
    this.topBarService.registerItem(new WCTopBarItem('mainMenu', TopMenuComponent));
    console.log(">>>>> authService:", this.authService);
  }

  ngOnDestroy() {
  }

}
