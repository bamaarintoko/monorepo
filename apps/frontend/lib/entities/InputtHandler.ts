import { ChangeEvent } from "react";

export type InputHandler = (field: string) => (e: ChangeEvent<HTMLInputElement>) => void;