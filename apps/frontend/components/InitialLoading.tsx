import { Box, CircularProgress } from "@mui/material";
import { boxStyle, containerStyle } from "./Style";

export default function InitialLoading() {
    return (
        <Box sx={containerStyle}>
            <Box sx={[boxStyle,{alignItems:'center',justifyContent:'center'}]}>
                <CircularProgress />

                <p>loading</p>
            </Box>
        </Box>
    )
}