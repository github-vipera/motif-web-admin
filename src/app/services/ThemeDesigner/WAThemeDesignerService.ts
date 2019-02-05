import { Injectable } from '@angular/core';
import { NGXLogger } from 'web-console-core';
import { GUI } from "dat-gui";

import * as dat from 'dat.gui'

const LOG_TAG = '[WAThemeDesignerService]';

@Injectable()
export class WAThemeDesignerService {

    constructor(private logger: NGXLogger){

    }

    public show(){
        this.logger.debug(LOG_TAG, 'show called' );

        const gui: GUI = new dat.default.GUI({name: "Theme Designer", width: 400, closed: true});

        let obj = {
            message: 'Hello World',
            displayOutline: false,
            maxSize: 6.0,
            speed: 5,
            color: "#ffae23",
            customColors: {
                "color1": "#ffae23",
                "color2" : "#ffae23"
            }
          };

          let f1 = gui.addFolder("customColors");
          f1.addColor(obj.customColors, 'color1');
          f1.addColor(obj.customColors, 'color2');

          //gui.remember(obj);
          gui.add(obj, 'message');
          gui.add(obj, 'displayOutline');
          gui.add(obj, 'maxSize', 0, 8);
          gui.addColor(obj, 'color');
        this.logger.debug(LOG_TAG, 'show done' );

    }
}

var FizzyText = function() {
    this.message = 'dat.gui';
    this.speed = 0.8;
    this.displayOutline = true;
};