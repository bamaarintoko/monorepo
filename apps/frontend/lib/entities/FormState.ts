export interface FormState {
    [key: string]: {
        value: string;
        isError: boolean;
        message: string;
    };
};