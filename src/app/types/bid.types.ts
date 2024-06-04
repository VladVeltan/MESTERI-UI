export interface Bid {
    id: string;
    amount: string;
    message: string;
    creationDate: string; // sau poți folosi tipul `Date` din JavaScript
    bidderEmail: string;
    bidderFirstName:string;
    bidderLastName:string;
    projectId: string;
}
