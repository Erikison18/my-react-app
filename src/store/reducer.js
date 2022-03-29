import { combineReducers } from 'redux';
import number from './reducer/number';
import list from './reducer/list';
import list1 from './reducer/list1';
import kely from './reducer/kely';

export default combineReducers({
    number,
    list,
    list1,
    kely,
})
