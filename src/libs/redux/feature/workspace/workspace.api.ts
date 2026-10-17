import { apiSlice } from '../../store/api.slice';
import { addItem, deleteItem, setItems } from './workspace.slice';
import type { IApiResponse } from '../../../interface/auth.interface';
import type { ICreateWorkspaceRequest, IWorkspaceListResponse, IWorkspaceResponse, IWorkspaceSummaryResponse } from '../../../interface/workspace.interface';
import type { RootState } from '../../store/store.redux';

export const workspaceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // get filtered data
        getWorkspace: builder.query<IWorkspaceResponse[], void>({
            async queryFn(_args, _api, _extraOptions, baseQuery) {
                const items: IWorkspaceResponse[] = [];
                let page = 1;
                while (true) {
                    const result = await baseQuery({
                        url: 'workspace',
                        params: {
                            page,
                            limit: 100
                        }
                    });

                    if (result.error)
                        return { error: result.error };

                    const response = result.data as IWorkspaceListResponse;
                    items.push(...response.data);

                    if (!response.meta.has_next_page)
                        break;
                    page += 1;
                }
                return { data: items };
            },
            async onQueryStarted(_args, { queryFulfilled, dispatch, getState }) {
                const token = (getState() as RootState).auth.accessToken;
                try {
                    const { data } = await queryFulfilled;
                    if (token === (getState() as RootState).auth.accessToken) {
                        dispatch(setItems(data));
                    }
                } catch {
                    // The layout displays loading errors and offers retry.
                }
            },
            providesTags: ['Workspace'],
        }),

        // get single
        getWorkspaceSingle: builder.query<IApiResponse<IWorkspaceResponse>, string>({
            query: (workspace_id) => ({
                url: 'workspace/single',
                params: { workspace_id }
            }),
            providesTags: ['Workspace'],
        }),

        summarizeWorkspace: builder.mutation<IApiResponse<IWorkspaceSummaryResponse>, string>({
            query: (workspace_id) => ({
                url: 'workspace/summarize',
                method: 'POST',
                params: { workspace_id },
            }),
        }),
        // update
        updateWorkspace: builder.mutation<IApiResponse<IWorkspaceResponse>, { workspace_id: string; name?: string; content?: string }>({
            query: ({ workspace_id, ...body }) => ({
                url: 'workspace/update',
                method: 'PATCH',
                params: { workspace_id },
                body,
            }),
            async onQueryStarted(_args, { queryFulfilled, dispatch, getState }) {
                const token = (getState() as RootState).auth.accessToken;
                try {
                    const { data: response } = await queryFulfilled;
                    if (token === (getState() as RootState).auth.accessToken)
                        dispatch(addItem(response.data));
                } catch {
                    // The form or editor displays the API error.
                }
            },
            invalidatesTags: (_result, error) => error ? [] : ['Workspace'],
        }),
        deleteWorkspace: builder.mutation<IApiResponse<{ deleted_item_id: string }>, string>({
            query: (workspace_id) => ({
                url: 'workspace/delete',
                method: 'DELETE',
                params: { workspace_id },
            }),
            async onQueryStarted(id, { queryFulfilled, dispatch, getState }) {
                const token = (getState() as RootState).auth.accessToken;
                try {
                    await queryFulfilled;
                    if (token === (getState() as RootState).auth.accessToken) dispatch(deleteItem(id));
                } catch {
                    // The delete handler displays the API error.
                }
            },
            invalidatesTags: (_result, error) => error ? [] : ['Workspace'],
        }),

        // create data
        createWorkspace: builder.mutation<IApiResponse<IWorkspaceResponse>, ICreateWorkspaceRequest>({
            query: (body) => ({
                url: 'workspace/create',
                method: 'POST',
                body
            }),
            async onQueryStarted(_args, { queryFulfilled, dispatch, getState }) {
                const token = (getState() as RootState).auth.accessToken;
                try {
                    const { data: response } = await queryFulfilled;
                    if (token === (getState() as RootState).auth.accessToken) {
                        dispatch(addItem(response.data));
                    }
                } catch {
                    // The create modal displays the API error.
                }
            },
            invalidatesTags: ['Workspace'],
        }),
    }),
});

export const {
    useGetWorkspaceQuery,
    useGetWorkspaceSingleQuery,
    useCreateWorkspaceMutation,
    useUpdateWorkspaceMutation,
    useSummarizeWorkspaceMutation,
    useDeleteWorkspaceMutation
} = workspaceApi;
