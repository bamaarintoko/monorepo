'use client'
import { checkStatus, fetchUserData } from "@/apis/userApi";
import InitialLoading from "@/components/InitialLoading";
import Offline from "@/components/Offline";
import { cekEmpty } from "@/lib/functions";
import withNoAuth from "@/lib/hoc/withNoAuth";
import { useLoginWithUsernameOrEmail } from "@/lib/hook/useLoginWithUsernameOrEmail";
import { updateData, updateToken, updateUser } from "@/lib/store/slice/sliceUser";
import { Alert, Box, Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

type InputHandler = (field: string) => (e: ChangeEvent<HTMLInputElement>) => void;

type FormState = {
    [key: string]: {
        value: string;
        isError: boolean;
        message: string;
    };
};

function PageLogin() {
    const [login, { data, loading, error }] = useLoginWithUsernameOrEmail()
    const [isFetching, setIsFetching] = useState(false)
    const [isServerRunning, setServerRunning] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [loadingCheckServer, setLoadingCheckServer] = useState(true)

    const [form, setForm] = useState<FormState>({
        email: {
            value: '',
            isError: false,
            message: ''
        },
        password: {
            value: '',
            isError: false,
            message: ''
        },
    })
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        if (data) { // condition after success firebase login
            dispatch(updateToken(data.accessToken))
            fetchUserInfo()
        }
    }, [data])

    useEffect(() => { // check srver 1st
        check()
    }, [])

    const check = async () => { // function for check server
        try {
            await checkStatus()
            setServerRunning(true)
            return true;
        } catch (error: any) {
            setServerRunning(false)
            return false;
        } finally {
            setLoadingCheckServer(false)
            setInitialLoading(false)
        }
    }

    const fetchUserInfo = async () => {
        if (data) {
            setIsFetching(true)
            try {
                const user = await fetchUserData(data?.user?.uid ?? "");
                const serializedUser = {
                    uid: data.user.uid,
                    phone: "-",
                    address: "-",
                    displayName: data.user.displayName ?? "",
                    email: data.user.email ?? ""
                }
                dispatch(updateData({
                    accessToken: data.accessToken,
                    user: serializedUser,
                    uid: data?.user.uid,
                }))
                dispatch(updateUser({ displayName: user.displayName, email: user.email }));
            } catch (err: any) {
                console.log("err : ", err)
            } finally {
                console.log("err")
                setIsFetching(false);
            }
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


    const handleLogin = async () => {
        const hasError = cekEmpty(form)
        const isServerUp = await check();

        if (hasError) {
            // ❌ Form has errors, run validate form for change state isError
            validateForm()
        } else {
            // ✅ no error
            try {
                if (isServerUp) {
                    await login(form.email.value, form.password.value);
                } else {
                    setServerRunning(false)
                }
            } catch (err) {
                updateFormField("email")
                updateFormField("password")
                console.log(err);
            }
        }
    }

    const updateFormField = ( //function for dynamic update state
        field: string,
    ) => {
        setForm((prevForm) => ({
            ...prevForm,
            [field]: {
                ...prevForm[field],
                isError: true,
                message: "",
            },
        }));
    };

    const validateForm = () => {
        let hasErrors = false;

        setForm(prevForm => {
            const updatedForm = { ...prevForm };

            Object.keys(updatedForm).forEach(key => {
                const { value } = updatedForm[key];

                if (value.trim() === '') {
                    updatedForm[key] = {
                        ...updatedForm[key],
                        isError: true,
                        message: 'This field is required',
                    };
                    hasErrors = true;
                } else if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    updatedForm[key] = {
                        ...updatedForm[key],
                        isError: true,
                        message: 'Invalid email format',
                    };
                    hasErrors = true;
                } else {
                    updatedForm[key] = {
                        ...updatedForm[key],
                        isError: false,
                        message: '',
                    };
                }
            });

            return updatedForm;
        });

        return hasErrors;
    };

    if (initialLoading) // check server 1st
        return (<InitialLoading />)

    if (!isServerRunning)
        return (<Offline />)

    return (
        <Box
            sx={{
                height: '100vh', // Full screen height
                width: '100vw',  // Full screen width (optional)
                display: 'flex', // Flexbox
                justifyContent: 'center', // Center horizontally
                alignItems: 'center', // Center vertically
                backgroundColor: 'grey.100', // Optional background color
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column', // Column layout for TextFields
                    width: '300px', // Fixed width
                    gap: 2, // Space between TextFields
                    padding: 2, // Optional padding
                    backgroundColor: 'white', // Optional for contrast
                    borderRadius: 2, // Rounded corners (optional)
                    boxShadow: 3, // Optional shadow for elevation
                }}
            >
                <TextField disabled={loading || isFetching} onChange={handleInput("email")} value={form.email.value} id="email" label="email" variant="outlined" />
                <TextField disabled={loading || isFetching} onChange={handleInput("password")} value={form.password.value} id="password" label="password" variant="outlined" />
                {
                    error &&

                    <Alert severity="warning">{error}</Alert>
                }
                <Button loading={loading || isFetching}
                    loadingPosition="start" onClick={handleLogin} variant="contained">Login</Button>
                <Button loading={loading || isFetching}
                    loadingPosition="start" onClick={()=>router.push('register')} variant="contained">Register</Button>
            </Box>
            {/* {isServerRunning ? renderOnlineServer() : renderOfflineServer()} */}
        </Box>
    )
}

export default withNoAuth(PageLogin)