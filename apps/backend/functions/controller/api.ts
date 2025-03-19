import { Response } from 'express';
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { getUserById,  updateUserData } from "../repository/userCollection";
/**
 * Fetch User Data Controller
 */
export const fetchUserDataController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const uid = req.user?.uid;
        console.log("uid : ",uid)
        if (!uid) {
            res.status(401).json({ message: 'Unauthorized: No user found.' });
            return;
        }

        const userData = await getUserById(uid);
        if (!userData) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
* Update User Data Controller
*/
export const updateUserDataController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const uid = req.user?.uid;
        const userData = req.body; // Assuming you are passing the updated data via body

        if (!uid) {
            res.status(401).json({ message: 'Unauthorized: No user found.' });
            return;
        }

        await updateUserData(uid, userData);

        res.status(200).json({ message: 'User data updated successfully.' });
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};