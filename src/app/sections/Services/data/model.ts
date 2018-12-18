import { Application, Domain } from '@wa-motif-open-api/platform-service';
import { TreeNode } from 'primeng/api';
import { icon } from '@fortawesome/fontawesome-svg-core';
import * as uuidv1 from 'uuid/v1'

export class ServiceCatalogTableModel {

    private _model: TreeNode[] = [];

    constructor() {
    }

    public loadData(serviceCatalog: any) {
        this.rebuildModel(serviceCatalog);
    }

    private buildNode(name: string,
        description: string,
        nodeType?: string,
        channel?: string,
        leaf?: boolean,
        domain?: Domain,
        application?: Application,
        service?: any,
        operation?: any): TreeNode {

    // Set the icon name
    let iconName = 'pi-globe';
    if (nodeType === 'Application') {
        iconName = 'pi-mobile';
    } else if (nodeType === 'Service') {
        iconName = 'pi-sitemap';
    } else if (nodeType === 'Operation') {
        iconName = 'pi-chevron-circle-right';
    }

    return {
            data: {
                name: name,
                description: description,
                nodeType: nodeType,
                channel: channel,
                leaf: leaf,
                icon: 'pi-bell',
                selectable: true,
                nodeIcon: iconName,
                nodeIconStyle: 'color:blue;',
                id: uuidv1(),
                catalogEntry: {
                    domain: ( domain ? domain.name : null),
                    application: ( application ? application.name : null),
                    service: ( service ? service.name : null),
                    operation: ( operation ? operation.name : null)
                }
            },
            children: []
        };
    }

    private rebuildModel(serviceCatalog: any): void {

        const tempModel = [];

        serviceCatalog.forEach(domain => {

            const domainNode = this.buildNode(domain.name, domain.description, 'Domain', null, false, domain, null);

            if (domain.applications) {
                for (let i = 0 ; i < domain.applications.length; i++) {
                    const application = domain.applications[i];
                    const applicationNode = this.buildNode(application.name,
                         application.description, 'Application', null, false, domain, application);

                    if (application.services) {
                        for (let y = 0; y < application.services.length; y++) {
                            const service = application.services[y];
                            const serviceNode = this.buildNode(service.name, service.description, 
                                'Service', service.channel, false, domain, application, service);

                            if (service.serviceOperationList) {
                                for (let z = 0; z < service.serviceOperationList.length; z++) {
                                    const operation = service.serviceOperationList[z];
                                    const operationNode = this.buildNode(operation.name,
                                        operation.description,
                                        'Operation',
                                        service.channel, true, domain, application, service, operation);

                                    serviceNode.children.push(operationNode);
                                }
                            }

                            applicationNode.children.push(serviceNode);
                        }
                    }

                    domainNode.children.push(applicationNode);
                }
            }
            tempModel.push(domainNode);
        });

        this._model = tempModel;
    }

    public get model(): TreeNode[] {
        return this._model;
    }

    public getDomainNode(domainName: string): TreeNode {
        for (let i = 0; i < this._model.length; i++) {
            const treeNode: TreeNode = this._model[i];
            if (treeNode.data.name === domainName) {
                return treeNode;
            }
        }
        return null;
    }
}
