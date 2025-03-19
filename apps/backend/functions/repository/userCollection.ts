import { User } from "@ebuddy/shared";
import { db } from "../config/firebaseConfig";
// import { User } from "../entities/user";

export const getUserById = async (userId: string): Promise<User | null> => {
    try {
        const userDoc = await db.collection('USERS').doc(userId).get();
        console.log('userDoc : ', userDoc)
        if (!userDoc.exists) {
            return null; // User not found
        }

        const userData = userDoc.data() as Omit<User, 'uid'>; // Everything except 'id'
        return {
            uid: userId,
            ...userData
        };
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

export const updateUserData = async (userId: string, updatedData: Partial<Omit<User, 'uid'>>): Promise<void> => {
    try {
        // Update user document in Firestore
        await db.collection('USERS').doc(userId).update(updatedData);
        console.log(`User with uid ${userId} successfully updated.`);
    } catch (error) {
        console.error(`Error updating user with uid ${userId}:`, error);
        throw error;
    }
};
