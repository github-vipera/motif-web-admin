import { EventEmitter } from '@angular/core';
import { Application, Domain } from '@wa-motif-open-api/platform-service';
import { TreeNode } from 'primeng/api';
import { icon } from '@fortawesome/fontawesome-svg-core';
import * as uuidv1 from 'uuid/v1';

export class ServiceCatalogTableModel {
  private _model: TreeNode[] = [];

  constructor() {}

  public loadData(serviceCatalog: any) {
    this.rebuildModel(serviceCatalog);
  }

  private buildNode(
    name: string,
    description: string,
    nodeType?: string,
    channel?: string,
    leaf?: boolean,
    domainName?: string,
    applicationName?: string,
    serviceName?: string,
    operationName?: string
  ): TreeNode {
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
          domain: domainName ? domainName : null,
          application: applicationName ? applicationName : null,
          service: serviceName ? serviceName : null,
          operation: operationName ? operationName : null,
          channel: channel
        }
      },
      children: []
    };
  }

  private rebuildModel(serviceCatalog: any): void {
    const tempModel = [];

    serviceCatalog.forEach(domain => {
      const domainNode = this.buildNode(
        domain.name,
        domain.description,
        'Domain',
        null,
        false,
        domain.name,
        null
      );

      if (domain.applications) {
        for (let i = 0; i < domain.applications.length; i++) {
          const application = domain.applications[i];
          const applicationNode = this.buildNode(
            application.name,
            application.description,
            'Application',
            null,
            false,
            domain.name,
            application.name
          );

          if (application.services) {
            for (let y = 0; y < application.services.length; y++) {
              const service = application.services[y];
              const serviceNode = this.buildNode(
                service.name,
                service.description,
                'Service',
                service.channel,
                false,
                domain.name,
                application.name,
                service.name
              );

              if (service.serviceOperationList) {
                for (let z = 0; z < service.serviceOperationList.length; z++) {
                  const operation = service.serviceOperationList[z];
                  const operationNode = this.buildNode(
                    operation.name,
                    operation.description,
                    'Operation',
                    service.channel,
                    true,
                    domain.name,
                    application.name,
                    service.name,
                    operation.name
                  );

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
    const domainNodes = this.getDomainNodes();
    return this.getChildNodeByName(domainNodes, domainName);
  }

  public getApplicationNode(
    domainName: string,
    applicationName: string
  ): TreeNode {
    const applicationNodes = this.getDomainNode(domainName).children;
    return this.getChildNodeByName(applicationNodes, applicationName);
  }

  public getServiceNode(
    domainName: string,
    applicationName: string,
    serviceName: string
  ): TreeNode {
    const servicesNodes = this.getApplicationNode(domainName, applicationName)
      .children;
    return this.getChildNodeByName(servicesNodes, serviceName);
  }

  public getOperationNode(
    domainName: string,
    applicationName: string,
    serviceName: string,
    operationName: string
  ): TreeNode {
    const operationsNodes = this.getServiceNode(
      domainName,
      applicationName,
      serviceName
    ).children;
    return this.getChildNodeByName(operationsNodes, operationName);
  }

  private getChildNodeByName(
    nodes: TreeNode[],
    childNodeName: string
  ): TreeNode {
    for (let i = 0; i < nodes.length; i++) {
      const treeNode: TreeNode = nodes[i];
      if (treeNode.data.name === childNodeName) {
        return treeNode;
      }
    }
    return null;
  }

  public getDomainNodes(): TreeNode[] {
    const ret = [];
    for (let i = 0; i < this._model.length; i++) {
      const treeNode: TreeNode = this._model[i];
      ret.push(treeNode);
    }
    return ret;
  }

  public getApplicationNodes(): TreeNode[] {
    const ret = [];
    const domainNodes = this.getDomainNodes();
    for (let i = 0; i < domainNodes.length; i++) {
      const domainNode = domainNodes[i];
      ret.push(domainNode.children);
    }
    return ret;
  }

  public addDomainNode(domain: Domain): TreeNode {
    const domainNode: TreeNode = this.buildNode(
      domain.name,
      domain.description,
      'Domain',
      null,
      false,
      domain.name,
      null
    );
    // From PrimeNG docs (https://www.primefaces.org/primeng/#/table):
    /**
     * Table may need to be aware of changes in its value in some cases such as reapplying sort.
     * For the sake of performance, this is only done when the reference of the value changes meaning
     * a setter is used instead of ngDoCheck/IterableDiffers which can reduce performance.
     * So when you manipulate the value such as removing or adding an item,
     * instead of using array methods such as push, splice create a new array reference using a spread operator or similar.
     */
    this._model = [...this.model, domainNode];
    return domainNode;
  }

  public addApplicationNode(domainName: string, application: Application): TreeNode {
      console.log('>>>>> addApplicationNode for:', domainName, application);
    const applicationNode: TreeNode = this.buildNode(
        application.name,
        application.description,
        'Application',
        null,
        false,
        domainName,
        application.name
      );
      const domainNode: TreeNode = this.getDomainNode(domainName);
      if (domainNode) {
        domainNode.children = [...domainNode.children, applicationNode];
      }
      return applicationNode;
  }

}
