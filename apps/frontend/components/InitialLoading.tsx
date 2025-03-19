import { Box } from "@mui/material";
import { boxStyle, containerStyle } from "./Style";

export default function InitialLoading() {
    return (
        <Box sx={containerStyle}>
            <Box sx={boxStyle}>
                <p>loading</p>
            </Box>
        </Box>
    )
}