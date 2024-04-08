import { User } from "./user.types";

export interface Project{
    id:string;
    title:string;
    description:string;
    category:string;
    county:string;
    city:string;
    media:string;
    user:User;
    status:boolean;
    
}