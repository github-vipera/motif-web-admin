import { Injectable } from '@angular/core';

@Injectable()
export class ErrorMessageBuilderService {

    constructor() {
    }

    public buildErrorMessage(error:any){
        return error.error.Details + " [" + error.error.Code + "]";
    }

}
