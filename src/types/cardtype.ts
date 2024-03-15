
export interface Card {
    id?: string;
    name: string;
    created:Date;
    archived: boolean;
    description?: string;
    lane:number;
    lane_was:number;
    owner:string;
    comments?:CommentType[];
    
}
export interface CommentType{


    comment:string;
    date:Date;
}

