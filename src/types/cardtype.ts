
export interface Card {
    id?: string;
    name: string;
    created:Date;
    active: boolean;
    description: string;
    lane:number;
    owner:string;
    comments?:Comment[];
    
}
export interface Comment{


    comment:string;
    date:Date;
}

