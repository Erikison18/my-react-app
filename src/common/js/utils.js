let getDaysBetween = (dateString1)=> {
    let startDate = Date.parse(dateString1);
    let endDate = new Date();
    if (startDate > endDate){
        return 0;
    }
    if (startDate === endDate){
        return 1;
    }
    let days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
    return days;
}

export {
    getDaysBetween
};
