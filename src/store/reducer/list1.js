const listInit1 = []
const list1 = (state = listInit1, action) => {
    switch (action.type) {
        case 'getList1':
            return action.payload
        default:
            return state
    }
}
export default list1;