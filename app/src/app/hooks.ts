import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector<RootState>;