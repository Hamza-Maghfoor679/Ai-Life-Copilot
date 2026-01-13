import AnswerSlice from '@/src/redux/slices/AnswersSlice';
import { combineReducers } from "redux";
import userReducer from './slices/UserSlice';

export const rootReducer = combineReducers({
    answerReducer: AnswerSlice,
    user: userReducer 
})