export class SessionRow {
    public clientIP: string;
    public user: string;
    public secure:boolean = false;
    public shared:boolean = false;
    public domain: string;
    public application: string;
    public service: string;
    public channel: string;
    public lastAccess: string;
    public lastRequestID: string;
    public expiry: string;
}
