import { Alert, Box } from "@mui/material";
import { boxStyle, containerStyle } from "./Style";

export default function Offline() {
    return (
        <Box sx={containerStyle}>
            <Box sx={boxStyle}>
                <Alert variant="filled" severity="error">
                    Server offline
                </Alert>
            </Box>
        </Box>
    )
}