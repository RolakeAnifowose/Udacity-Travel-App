//Function to get length of trip
function getTripLength(departureDate, returnDate){
    let dateGoing = new Date(departureDate);
    let dateReturning = new Date(returnDate);
    let dateLeaving = dateGoing.getTime();
    let dateComing = dateReturning.getTime();
    let difference = (dateComing - dateLeaving);
    const oneDay = 1000*60*60*24;
    const tripLength = Math.round(difference/oneDay);
    return tripLength;
}

export { getTripLength}