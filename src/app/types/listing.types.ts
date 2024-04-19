import { Category } from "./category.types";
import { User } from "./user.types";

export interface Listing{
    id:string;
    title:string;
    description:string;
    category:Category;
    county:string;
    city:string;
    status:boolean;
    creationDate:string;
    user:User;
}