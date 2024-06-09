export interface ReviewDto {
    id?: string;
    userEmail: string;
    handymanEmail: string;
    mark: number;
    message: string;
    project_id?: string | null;
    listing_id?: string | null;
    createdAt:string;
    userFirstName:string;
    userLastName:string;
    postTitle:string;
  }
  