'use client'
import { FormState } from "@/lib/entities/FormState";
import { InputHandler } from "@/lib/entities/InputtHandler";
import { cekEmpty } from "@/lib/functions";
import withNoAuth from "@/lib/hoc/withNoAuth";
import { useRegisterUser } from "@/lib/hook/useRegisterUser";
import { Alert, Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

function PageRegister() {
    const [registerUser, { data,loading, error }] = useRegisterUser();
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
        displayName: {
            value: '',
            isError: false,
            message: ''
        }
    })

    useEffect(() => {
        console.log("Error : ", error)
    }, [error])

    // const handleRegister = () => {
    //     const params = {
    //         email: form.email.value,
    //         password: form.password.value,
    //         displayName: form.displayName.value
    //     }

    //     console.log("params : ", params)
    // }
    const handleRegister = async () => {
        const hasErrors = cekEmpty(form);
        validateForm()
        if (hasErrors) {
            // ❌ Form has errors, run validate form for change state isError
            validateForm()
        } else {
            // ✅ no error
            try {

                const params = {
                    email: form.email.value,
                    password: form.password.value,
                    displayName: form.displayName.value
                }
                await registerUser(params)
            } catch (error) {

                updateFormField('password')
                updateFormField('confirm_password')
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
                <TextField disabled={false} onChange={handleInput("email")} value={form.email.value} id="email" label="email" variant="outlined" />
                <TextField disabled={false} onChange={handleInput("password")} value={form.password.value} id="password" type="password" label="password" variant="outlined" />
                <TextField disabled={false} onChange={handleInput("displayName")} value={form.displayName.value} id="displayName" label="displayName" variant="outlined" />
                {/* <TextField disabled={loading || isFetching} onChange={handleInput("password")} value={form.password.value} id="password" label="password" variant="outlined" /> */}
                {
                    data
                    &&<Alert severity="success">Register success.</Alert>

                }
                {
                    error
                    &&
                    <Alert severity="error">{error}</Alert>
                }
                <Button
                    loading={loading}
                    disabled={loading}
                    loadingPosition="start" onClick={handleRegister} variant="contained">Register</Button>
            </Box>
        </Box>
    )
}

export default withNoAuth(PageRegister)