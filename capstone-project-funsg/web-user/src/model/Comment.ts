import {User} from "./User.ts";

export interface CommentDetail {
    content:string;
    postAt:string;
    user:User;
}
