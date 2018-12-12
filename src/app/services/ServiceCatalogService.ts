import { Injectable } from '@angular/core';
import { DomainsService, 
         DomainsList, 
         Domain, 
         ApplicationsService,
         ApplicationsList, 
         Application,
          } from '@wa-motif-open-api/platform-service'

import { ServicesService, OperationsService, ServiceList } from '@wa-motif-open-api/catalog-service'
import { ApplicationsService as AppService } from '@wa-motif-open-api/catalog-service'

import { Observable, from, forkJoin } from 'rxjs';
import { flatMap, mergeMap, map, switchMap, toArray, tap } from 'rxjs/operators';
import { NGXLogger } from 'web-console-core'

const LOG_TAG = "[ServiceCatalogService]";

@Injectable()
export class ServiceCatalogService {

    private domainsList:DomainsList;

    constructor(private domainService:DomainsService, 
        private applicationService:ApplicationsService,
        private appService:AppService,
        private logger: NGXLogger) {
    }

    public getServiceCatalog(): Observable<any> {
        return new Observable((observer) => {
 
            this.logger.debug(LOG_TAG, 'getServiceCatalog called' );
 
            const serviceCatalog = [];

            this.domainService.getDomains().subscribe(( domains: DomainsList ) => {
                for (const domain of domains) {

                    const domainInfo:any = domain;
                    domainInfo.applications = [];
                    serviceCatalog.push(domainInfo);

                    this.applicationService.getApplications(domain.name).subscribe(( applications: ApplicationsList ) => {

                        for (const application of applications ) {

                            const applicationInfo:any = application;
                            domainInfo.applications.push(applicationInfo);
                            this.appService.getServiceList(domain.name, application.name).subscribe( ( services: ServiceList ) => {
                                applicationInfo.services = services;
                            }, ( error ) => {
                                this.logger.error(LOG_TAG, 'getServiceCatalog error:' , error);
                            });
                        }

                    }, ( error ) => {
                        this.logger.error(LOG_TAG, 'getServiceCatalog error:' , error);
                    });

                }
            }, (error) => {
                this.logger.error(LOG_TAG, 'getServiceCatalog error:' , error);
            }, () => {
                observer.next( serviceCatalog );
                observer.complete();
            });
        });
    }


    /**
     this.domainService.getDomains()
            .pipe(
                switchMap( (domains:DomainsList) => from(domains)),
                flatMap((domain:Domain) => forkJoin(
                    this.applicationService.getApplications(domain.name)
                        .pipe(
                            switchMap( (applications:ApplicationsList) => from(applications)),
                            flatMap( (application:Application) => forkJoin (
                                    this.appService.getServiceList(domain.name, application.name)
                                ).pipe(
                                    map( data => ({ application: application, services: data })),
                                    tap( data => data.application["services"] = data.services[0]),
                                    tap( data => delete data.services),
                                ),
                            ),
                            toArray()
                        ).pipe(map(data => ({ domain: domain, applications: data})))
                    )
                )
             ).subscribe((results)=>{
                this.logger.debug(LOG_TAG, "getServiceCatalog results:" , results);
                serviceCatalog.push(results);
            },(error)=>{
                this.logger.error(LOG_TAG, "getServiceCatalog error:" , error);
            }, ()=>{
                this.logger.debug(LOG_TAG, "getServiceCatalog Completed! ", JSON.stringify(serviceCatalog));
            })
    }
     */





}
