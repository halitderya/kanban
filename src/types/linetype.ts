export interface KanbanBoard {
    lanes: Lane[];
    board_settings: BoardSettings;
}

export interface Lane {
    id: number;
    name: string;
    active: boolean;
    user_created: boolean;
    tasks: any[];  // Replace 'any' with a more specific type if tasks have a defined structure
    description: string;
}

export interface BoardSettings {
    allow_multiple_assignees: boolean;
    enable_time_tracking: boolean;
    archive_completed_tasks: boolean;
}

