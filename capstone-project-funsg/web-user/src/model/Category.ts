import {GroupDetail} from "./GroupDetail.ts";

export interface Category {
    id: number;
    name: string;
    description: string;
    groups: GroupDetail[];
}