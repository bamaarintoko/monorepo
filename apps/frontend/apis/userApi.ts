import { store } from '@/lib/store/store';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5001/ebuddy-4eb13/us-central1/api';
// Function to get the Firebase Auth token

// Fetch user data with Bearer token
export const fetchUserData = async (userId: string | null) => {
    try {
        const token = store.getState().sliceUser.accessToken; // Get token from store
        // console.log("token : ", token)
        if (!token) throw new Error('Unauthorized: No token found');

        const response = await axios.get(`${BASE_URL}/fetch-user-data`, {
            params: { uid: userId },
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user data');
    }
};

export const updateUserData = async (
    userId: string | null,
    updatedData: { displayName?: string | null },
) => {
    const token = store.getState().sliceUser.accessToken;

    try {
        const response = await axios.put(
            `${BASE_URL}/update-user-data`,
            { userId, ...updatedData }, // Send userId & new data
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update user data');
    }
};

export const checkStatus = async () => {
    try {
        const response = await axios.get(
            `${BASE_URL}/test`,// Send userId & new data
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'offline');
    }
}
