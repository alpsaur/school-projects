import {User} from "./User.ts";

export interface GroupDetail {
    id: number;
    name: string;
    description: string;
    categoryId: number;
    categoryName: string;
    status: string;
    profileImagePath: string | null;
    host: User;
    members: User[];
}

export interface GroupDetailWithEvents{
    id: number;
    name: string;
    description: string;
    categoryId: number;
    categoryName: string;
    status: string;
    profileImagePath: string | null;
    host: User;
    members: User[];
    numberOfEvents:number;
}