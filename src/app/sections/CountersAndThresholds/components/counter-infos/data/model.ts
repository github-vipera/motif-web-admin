import { CounterInfoEntityList, CounterInfoEntity } from '@wa-motif-open-api/counters-thresholds-service';
import * as _ from 'lodash';
import { String, StringBuilder } from 'typescript-string-operations';

export class CounterInfosModel {

    private _data: CounterInfoEntityList;

    constructor(){

    }   

    public close(){
        this._data = null;
    }

    public loadData(data: CounterInfoEntityList) {
        this._data = _.forEach(data, (element: CounterInfoEntity) => {
            if (element.created) {
                element.created = new Date(element.created);
            }
            element["pattern"] = this.buildPatternForItem(element);
        });

    }

    private buildPatternForItem(item: CounterInfoEntity): string {
        let ret = String.Format('/{0}', item.channel);

        if (item.domain) {
            ret = String.Format('{0}/{1}', ret, item.domain);
        }
        if (item.domain && item.application) {
            ret = String.Format('{0}/{1}', ret, item.application);
        }
        if (item.domain && item.application && item.service) {
            ret = String.Format('{0}/{1}', ret, item.service);
        }
        if (item.domain && item.application && item.service && item.operation) {
            ret = String.Format('{0}/{1}', ret, item.operation);
        }

        return ret;
    }

    public get data(): CounterInfoEntityList {
        return this._data;
    }

}