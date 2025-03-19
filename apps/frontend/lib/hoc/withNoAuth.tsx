'use client'
import { useEffect } from "react";
// import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
// import app from "next/app";
// import { app } from "../lib/firebase";

const auth = getAuth(app);

const withNoAuth = (WrappedComponent: React.FC) => {
    return function ProtectedRoute(props: any) {
        const user = useSelector((state: RootState) => state.sliceUser)
        const router = useRouter();
        useEffect(() => {
            if (user.accessToken) {
                router.push("/"); 
            }
        }, [user.accessToken,router]);

        return <WrappedComponent {...props} />;
    };
};

export default withNoAuth;
