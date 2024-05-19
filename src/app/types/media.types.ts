import { Listing } from "./listing.types";
import { Project } from "./project.types";
import { User } from "./user.types";

export interface Media{
    id:string,
    mediaUrl:string,
    mediaType:string,
    userId:User,
    listingId:Listing,
    projectId:Project

}
export interface MediaItem {
    id: string; // ID-ul unic al elementului media
    imageUrl: string; // URL-ul imaginii
  }
  