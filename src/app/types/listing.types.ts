import { Category } from "./category.types";
import { County } from "./county.types";
import { User } from "./user.types";

export interface Listing{
    id:string;
    title:string;
    description:string;
    category:Category;
    county:County;
    city:string;
    status:boolean;
    creationDate:string;
    user:User;
}