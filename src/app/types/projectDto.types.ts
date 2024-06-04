export interface ProjectDto {
    id:string,
    title: string;
    description: string;
    category: string;
    county: string;
    city: string;
    status: boolean;
    creationDate: string;
    userEmail: string;
    userFirstName:string;
    userLastName:string;
    userPhone:string;
    expectedDueDate: string;
    actionDuration:number;
    acceptBids:boolean;
  }