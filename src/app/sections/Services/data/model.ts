import { TreeNode } from 'primeng/api';
import { icon } from '@fortawesome/fontawesome-svg-core';

export class ServiceCatalogTableModel {

    private _model: TreeNode[] = [];

    constructor() {}

    public loadData(serviceCatalog: any) {
        this.rebuildModel(serviceCatalog);
    }

    private buildNode(name: string,
        description: string,
        nodeType?: string,
        channel?: string,
        leaf?: boolean): TreeNode {
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
                nodeIcon: iconName
            },
            children: []
        };
    }

    private rebuildModel(serviceCatalog: any): void {

        const tempModel = [];

        serviceCatalog.forEach(domain => {

            const domainNode = this.buildNode(domain.name, domain.description, 'Domain');

            if (domain.applications) {
                for (let i = 0 ; i < domain.applications.length; i++) {
                    const application = domain.applications[i];
                    const applicationNode = this.buildNode(application.name, application.description, 'Application');

                    if (application.services) {
                        for (let y = 0; y < application.services.length; y++) {
                            const service = application.services[y];
                            const serviceNode = this.buildNode(service.name, service.description, 'Service', service.channel);

                            if (service.serviceOperationList) {
                                for (let z = 0; z < service.serviceOperationList.length; z++) {
                                    const operation = service.serviceOperationList[z];
                                    const operationNode = this.buildNode(operation.name, 
                                        operation.description,
                                        'Operation',
                                        service.channel, true);

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

}