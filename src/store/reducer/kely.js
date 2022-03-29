const dataInit = {
    timer: 0,
    daily: 0,
    week: 0,
    month: 0,
}
const kely = (state = dataInit, action) => {
    switch (action.type) {
        case 'getKely':
            return action.payload
        default:
            return state
    }
}
export default kely;