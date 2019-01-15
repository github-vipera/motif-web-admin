import { CounterInfoEntityList } from '@wa-motif-open-api/counters-thresholds-service';
import * as _ from 'lodash';

export class CounterInfosModel {

    private _data: CounterInfoEntityList;

    constructor(){

    }   

    public close(){
        this._data = null;
    }

    public loadData(data: CounterInfoEntityList) {
        this._data = _.forEach(data, function(element) {
            if (element.created) {
                element.created = new Date(element.created);
            }
        });

    }

    public get data(): CounterInfoEntityList {
        return this._data;
    }

}