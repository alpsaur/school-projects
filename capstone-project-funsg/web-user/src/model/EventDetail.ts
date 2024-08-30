import {User} from "./User.ts";

export interface EventDetail {
    name: string;
    profileImagePath: string;
    id:number;
    description: string;
    start: string;
    end: string;
    location: string;
    groupId: number;
    groupName: string;
    maxParticipants: number;
    status: string;
    eventParticipants: User[];
    createdBy:User;

}

export interface EventDetailWithPhoto {
    name: string;
    profileImagePath: string;
    id:number;
    description: string;
    start: string;
    end: string;
    location: string;
    groupId: number;
    groupName: string;
    maxParticipants: number;
    status: string;
    eventParticipants: User[];
    createdBy:User;
    eventArtifactFilePaths:string[];
}