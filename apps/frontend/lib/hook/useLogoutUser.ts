import { signOut } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebaseConfig";
import { FirebaseError } from "firebase/app";
import { getFirebaseAuthErrorMessage } from "../functions";

export function useLogoutUser() {
    const [state, setState] = useState<{
        data: null;
        loading: boolean;
        isSuccess: boolean;
        isFailed: boolean;
        error: string | null;
    }>({
        data: null,
        loading: false,
        isSuccess: false,
        isFailed: false,
        error: null,
    });

    const logOut = async () => {
        setState({ data: null, loading: true, isSuccess: false, isFailed: false, error: null });
        try {
            await signOut(auth)
            setState({
                data: null,
                loading: false,
                isSuccess: true,
                isFailed: false,
                error: null,
            });
        } catch (error: unknown) {
            let errorMessage = "Terjadi kesalahan yang tidak diketahui.";

            if (error instanceof FirebaseError) {
                errorMessage = getFirebaseAuthErrorMessage(error.code);
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setState({ data: null, loading: false, isSuccess: false, isFailed: true, error: errorMessage });
        }
    }

    return [logOut, state] as const
}