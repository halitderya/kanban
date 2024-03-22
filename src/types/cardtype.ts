
export interface Card {
    id?: string;
    name: string;
    created:string;
    archived: boolean;
    description?: string;
    lane:number;
    owner:string;
    comments?:CommentType[];
    
}
export interface CommentType{


    comment:string;
    date?:string;
}

