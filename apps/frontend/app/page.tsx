'use client';

import { checkStatus, fetchUserData, updateUserData } from "@/apis/userApi";
import { useAuth } from "@/lib/hook/useAuth";
import { useLogoutUser } from "@/lib/hook/useLogoutUser";
import { clearUser, updateUser } from "@/lib/store/slice/sliceUser";
import { RootState } from "@/lib/store/store";
import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type FormState = {
	[key: string]: {
		value: string | null;
		isError: boolean;
		message: string;
	};
};

type InputHandler = (field: string) => (e: ChangeEvent<HTMLInputElement>) => void;

function Home() {
	const { user: userListener } = useAuth(); // Get the logged-in user
	const user = useSelector((state: RootState) => state.sliceUser)
	const [logout, { loading: isLoading }] = useLogoutUser()
	const [loadingUpdate, setLoadingUpdate] = useState(false)
	const [errorMessageFetch, setErrorMessageFetch] = useState("")

	const [isServerRunning, setServerRunning] = useState(false)
	const [loadingCheckServer, setLoadingCheckServer] = useState(true)

	const [updateSuccess, setUpdateSuccess] = useState(false)

	const [form, setForm] = useState<FormState>({
		displayName: {
			value: '',
			isError: false,
			message: ''
		},
	})

	const dispatch = useDispatch()
	const router = useRouter()

	useEffect(() => {
		check()
		fetchUserInfo()
	}, [])

	useEffect(() => {
		updateFormField("displayName", user.user.displayName); // update form by redux state
	}, [user.user.displayName])

	const updateFormField = ( //function for dynamic update state
		field: string,
		value: string | null
	) => {
		setForm((prevForm) => ({
			...prevForm,
			[field]: {
				...prevForm[field],
				value,
				isError: false,
				message: "",
			},
		}));
	};

	const fetchUserInfo = async () => {
		if (!user?.uid) return; // Prevent fetching if user is not available
		setLoadingUpdate(true);
		try {
			const data = await fetchUserData(user.uid);
			dispatch(updateUser({ displayName: data.displayName, email: data.email }));

			setErrorMessageFetch("")
		} catch (err: any) {
			setErrorMessageFetch(err.message);
			if (err.message === "Unauthorized: Invalid token.") {
				handleLogout()
			}
		} finally {
			setLoadingUpdate(false);
		}
	};

	const check = async () => {
		try {
			await checkStatus()
			setServerRunning(true)
			return true;
		} catch (error: any) {
			setServerRunning(false)
			return false;
		} finally {
			setLoadingCheckServer(false)
		}
	}

	const handleUpdate = async () => {
		if (!user?.uid) return;
		const isServerUp = await check();
		setLoadingUpdate(true);
		try {
			if (isServerUp) {
				await updateUserData(user.uid, { displayName: form.displayName.value });
				fetchUserInfo()
				dispatch(updateUser({ displayName: form.displayName.value })); // Update state instead of refetching
			}
		} catch (err: any) {
			setErrorMessageFetch(err.message);
		} finally {
			setUpdateSuccess(true)
			setLoadingUpdate(false);
		}
	};



	const handleInput: InputHandler = (field) => (e) => {
		setForm((prevForm) => ({
			...prevForm,
			[field]: {
				...prevForm[field],
				value: e.target.value,
				isError: false,
				message: '',
			},
		}));
	}

	const handleLogout = () => {
		dispatch(clearUser({}))
		logout()
	}

	const renderAuthenticatedUI = () => (
		<Box
			sx={boxStyle}
		>
			{errorMessageFetch && <Alert severity="error">{errorMessageFetch}</Alert>}

			<Typography>Display Name: {user.user.displayName}</Typography>

			<TextField
				disabled={loadingUpdate}
				onChange={handleInput("displayName")}
				value={form.displayName.value}
				id="displayName"
				label="Display Name"
				variant="outlined"
			/>
			{updateSuccess && <Alert severity="success">Update success</Alert>}

			<Button
				loadingPosition="start"
				loading={isLoading || loadingUpdate}
				disabled={isLoading || loadingUpdate || !form.displayName.value}
				onClick={handleUpdate}
				variant="contained"
				color="primary"
			>
				Update
			</Button>
			{
				errorMessageFetch === "Failed to fetch user data"
				&&
				<Button
					loadingPosition="start"
					loading={isLoading || loadingUpdate}
					disabled={isLoading || loadingUpdate}
					onClick={fetchUserInfo}
					variant="contained"
					color="primary"
				>
					REFETCH
				</Button>
			}
			<Button
				loadingPosition="start"
				loading={isLoading || loadingUpdate}
				disabled={isLoading || loadingUpdate}
				onClick={handleLogout}
				variant="contained"
				color="primary"
			>
				Logout
			</Button>
		</Box>
	);

	const renderUnauthenticatedUI = () => (
		<Link href="/auth/login">
			<Button variant="contained" color="primary">Login</Button>
		</Link>
	);

	if (!isServerRunning)
		return (
			<Box sx={containerStyle}>
				<Box sx={boxStyle}>
					<Alert variant="filled" severity="error">
						Server offline
					</Alert>
				</Box>
			</Box>)

	return (
		<Container>

			<Box
				sx={containerStyle}
			>
				<Typography variant="h3" gutterBottom>
					Welcome to Next.js 15 + MUI + TypeScript
				</Typography>
				{user.uid ? renderAuthenticatedUI() : renderUnauthenticatedUI()}
			</Box>

		</Container>
	);
}

const containerStyle = {
	height: '100vh',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	bgcolor: 'grey.100',
	flexDirection: 'column',
};

const boxStyle = {
	display: 'flex',
	flexDirection: 'column',
	width: 300,
	gap: 2,
	p: 2,
	bgcolor: 'white',
	borderRadius: 2,
	boxShadow: 3,
};
export default Home
