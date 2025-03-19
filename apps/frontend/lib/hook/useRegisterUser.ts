import { collection, doc, FieldValue, getDocs, query, serverTimestamp, setDoc, Timestamp, where } from "firebase/firestore";
import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuthErrorMessage } from "../functions";

// user type data definition
export interface User {
    uid:string;
    displayName: string;
    email: string;
    createdAt: Timestamp | FieldValue;
}

interface RegisterState {
    data: User | null;
    loading: boolean;
    isSuccess: boolean;
    isFailed: boolean;
    error: string | null;
}
// Custom Hook for user register
export function useRegisterUser() {
    const [state, setState] = useState<RegisterState>({
        data: null,
        loading: false,
        isSuccess: false,
        isFailed: false,
        error: null as string | null,
    });

    const register = async (form: { email: string; displayName: string; password: string }) => {
        setState({ data: null, loading: true, isSuccess: false, isFailed: false, error: null });

        try {

            // 2️⃣ create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
            const user = userCredential.user;

            // 3️⃣ Save additional user data to Firestore
            const userData: User = {
                uid:user.uid,
                displayName: form.displayName,
                email: form.email,
                createdAt: serverTimestamp(),
            };

            // 3️⃣ save more data in firestore
            await setDoc(doc(db, "USERS", user.uid), userData);

            setState({ data: userData, loading: false, isSuccess: true, isFailed: false, error: null });
        } catch (error: unknown) {
            let errorMessage = "Unknown error.";
            if (error instanceof FirebaseError) {
                errorMessage = getFirebaseAuthErrorMessage(error.code);
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setState({ data: null, loading: false, isSuccess: false, isFailed: true, error: errorMessage });
        }
    };

    return [register, state] as const;
}