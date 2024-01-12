import { Ref } from "react";

export interface KanbanBoard {
    lanes: Lane[];
    board_settings: BoardSettings;
}

export interface Lane {
    id: number;
    name: string;
    active: boolean;
    user_created: boolean;
    tasks: any[];  
    description: string;
    ref:Ref<any>;
}

export interface BoardSettings {
    allow_multiple_assignees: boolean;
    enable_time_tracking: boolean;
    archive_completed_tasks: boolean;
}

