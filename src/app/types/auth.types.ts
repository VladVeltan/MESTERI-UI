export interface AuthData {
    email: string;
    password: string;
}
export interface RegisterData{
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    role:string;
    phone:string;
    rating:string;
    creationDate:string;
    // age:string;
    // experience:string;
}
export interface UserData {
    role: string;
    id: string;
}
export interface AccessToken {
    token: string;
}