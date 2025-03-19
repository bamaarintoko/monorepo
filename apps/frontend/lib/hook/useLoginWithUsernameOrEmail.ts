import { collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword, User } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getFirebaseAuthErrorMessage } from "../functions";


interface AuthState {
	data: { user: User; accessToken: string } | null;
	loading: boolean;
	isSuccess: boolean;
	isFailed: boolean;
	error: string | null;
}

export function useLoginWithUsernameOrEmail() {
	const [state, setState] = useState<AuthState>({
		data:  null,
		loading: false,
		isSuccess: false,
		isFailed: false,
		error: null,
	});

	const login = async (usernameOrEmail: string, password: string) => {
		setState({ data: null, loading: true, isSuccess: false, isFailed: false, error: null });

		try {
			let email = usernameOrEmail;
			let userId = null;
			// Jika bukan email, cari email berdasarkan username
			// if (!usernameOrEmail.includes("@")) {
			// 	const usersRef = collection(db, "USERS");
			// 	const q = query(usersRef, where("username", "==", usernameOrEmail));
			// 	const querySnapshot = await getDocs(q);

			// 	if (querySnapshot.empty) {
			// 		throw new Error("Username/email or password incorrect");
			// 	}

			// 	const userData = querySnapshot.docs[0].data();
			// 	email = userData.email;
			// 	userId = querySnapshot.docs[0].id;
			// }

			// Login dengan email yang ditemukan
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;
			userId = userId ?? user.uid; // Use user.uid if userId is not set
			
			// ✅ Update updatedAt field in Firestore
			const userDocRef = doc(db, "USERS", userId);
			const accessToken = await user.getIdToken();
			await updateDoc(userDocRef, {
				updatedAt: serverTimestamp(),
			});
			console.log("user : ",user)
			setState({ data: {user,accessToken}, loading: false, isSuccess: true, isFailed: false, error: null });
		} catch (error: unknown) {
			let errorMessage = "Terjadi kesalahan yang tidak diketahui.";

			if (error instanceof FirebaseError) {
				errorMessage = getFirebaseAuthErrorMessage(error.code);
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}

			setState({ data: null, loading: false, isSuccess: false, isFailed: true, error: errorMessage });
		}
	};

	return [login, state] as const; // Function first, then state
}