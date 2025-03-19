type FormObject = Record<string, FormField>;
type FormField = { value: string; error?: string; message?: string };

export const cekEmpty = (formObject: FormObject): boolean => {
	return Object.values(formObject).some(field => field.value.trim() === '');
};

export const getFirebaseAuthErrorMessage = (error: string) => {
	switch (error) {
		case "auth/email-already-in-use":
			return "This email is already in use. Use a different email or try signing in.";
		case "auth/invalid-email":
			return "Invalid email. Please check again.";
		case "auth/weak-password":
			return "Password is too weak. Use at least 6 characters.";
		case "auth/user-not-found":
			return "User not found. Please sign up first.";
		case "auth/wrong-password":
			return "Incorrect password. Try again or reset your password.";
		case "auth/too-many-requests":
			return "Too many login attempts. Please try again later.";
		case "auth/invalid-email":
		case "auth/user-not-found":
		case "auth/wrong-password":
		case "auth/invalid-credential":
			return "Invalid credentials.";
		default:
			return "An error occurred. Please try again.";
	}
};

