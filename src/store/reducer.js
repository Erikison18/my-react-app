import { combineReducers } from 'redux';
import number from './reducer/number';
import list from './reducer/list';
import list1 from './reducer/list1';

export default combineReducers({
    number,
    list,
    list1,
})
