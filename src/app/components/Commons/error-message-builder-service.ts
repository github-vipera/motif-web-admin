import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ErrorMessageBuilderService {

    constructor() {
    }

    public buildErrorMessage(error:any){

        if (error instanceof HttpErrorResponse){
            return this.handleHttpError(error);
        } else {
            //TODO!! 
            return error.error.Details + " [" + error.error.Code + "]";
        }

    }

    handleHttpError(error:HttpErrorResponse): string {
        if (error.status===400){
            return error.error.Details + " [" + error.error.Code + "]";
        } else if (error.status===401) {
            return "Authentication is required."
        }
    }

    isCommonHttpError(error:HttpErrorResponse): boolean {
        if ((error.status > 400) && (error.status <=451)){
            return true;// 4xx Client errors
        }
    }
}
