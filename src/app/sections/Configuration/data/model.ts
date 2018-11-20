export class ConfigurationRow {
    public Name: string;
    public Type: string = 'java.lang.String';
    public Dynamic:boolean = false;
    public Crypted:boolean = false;
    public Value: any;
    public dirty: boolean = false;
}

export interface MotifService {
    name:string;
}

export interface MotifServicesList extends Array<MotifService> {
}

