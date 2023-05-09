import { ErrorType } from "../interfaces/interface";
import dayjs from 'dayjs';

export function logger (type: ErrorType, message: string, error?: any) {
    const date = dayjs().format();
    return console.log(`time: ${date}`, `type: ${type}`, `message: ${message}`, error || ``);
}