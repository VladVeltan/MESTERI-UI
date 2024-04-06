import { User } from "./user.types";

export interface Listing{
    id:string;
    title:string;
    description:string;
    category:string;
    county:string;
    city:string;
    media:string;
    user:User;

}