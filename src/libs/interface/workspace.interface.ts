import type { ItemType } from './common.interface';
import type { IApiResponse } from './auth.interface';

export interface IWorkspaceResponse {
    _id: string;
    name: string;
    type: ItemType;
    parent: string | null;
    content?: string;
    user: {
        name: string;
        email: string;
    };
    created_at: number;
    updated_at: number;
}

export interface ICreateWorkspaceRequest {
    name: string;
    type: ItemType;
    parent: string | null;
    content?: string;
}

export interface IWorkspaceListResponse extends IApiResponse<IWorkspaceResponse[]> {
    meta: {
        total_items: number;
        total_pages: number;
        current_page: number;
        page_size: number;
        has_next_page: boolean;
        has_previous_page: boolean;
    };
}
