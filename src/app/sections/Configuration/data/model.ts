export class ConfigurationRow {
    public Name: string;
    public Type: string = 'java.lang.String';
    public Dynamic:boolean = false;
    public Crypted:boolean = false;
    public Value: any;
}

export interface MotifService {
    name:string;
}

export interface MotifServicesList extends Array<MotifService> {
}

