export enum EditingType {
    None,
    Domain,
    Application,
    Service,
    Operation
}

export interface EditorContext {
    domainName: string;
    applicationName?: string;
    serviceName?: string;
    operationName?: string;
    userdata?: any;
    editingType: EditingType;
}