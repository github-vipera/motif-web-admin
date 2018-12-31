import { Injectable } from '@angular/core';
import * as _ from 'lodash'

@Injectable()
export class LocalesMappingService {

    private _mapping: any = [
        { code: 'it', name: 'Italiano' },
        { code: 'ar', name: 'العربية' },
        { code: 'en', name: 'English' },
        { code: 'de', name: 'Deutsch' },
        { code: 'es', name: 'Español' },
        { code: 'fr', name: 'Français' }
    ];

    constructor() {
    }

    public findByCode(locale: string): string {
        return _.find(this._mapping, function(o) { return o.code === locale; }).name;
    }

    public findByName(localeName: string): string {
        return _.find(this._mapping, function(o) { return o.name === localeName; }).code;
    }

}
