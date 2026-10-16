import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { LocalStorageKeyEnum } from "../enum/common.enum";
import { logout, setCredential } from "../redux/feature/auth/auth.slice";
import { getLocalStorage, isTokenValid } from "../helper/local_storage.helper";
import { useGetProfileQuery } from "../redux/feature/auth/auth.api";
import type { ICredentials } from "../interface/auth.interface";
import type { AppDispatch, RootState } from "../redux/store/store.redux";

export const useAuthCheck = () => {

    const dispatch = useDispatch<AppDispatch>();

    const [authChecked, setAuthChecked] = useState(false);
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);

    const profile = useGetProfileQuery(accessToken ?? '', {
        skip: !authChecked || !accessToken,
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        const auth = getLocalStorage<ICredentials>(LocalStorageKeyEnum.Auth);

        if (auth && typeof auth.accessToken === "string" && isTokenValid(auth.accessToken)) {
            dispatch(setCredential(auth));
        } else {
            dispatch(logout());
        }
        setAuthChecked(true);
    }, [dispatch]);

    return {
        authChecked: authChecked && (!accessToken || !profile.isLoading),
        profileError: profile.error,
        retryProfile: profile.refetch,
    };
};
