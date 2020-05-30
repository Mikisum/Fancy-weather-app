const days = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
}

function getDayName(dayNum) {
    return dayNum < 7 ? days[dayNum] : days[dayNum - 7]
}

export default getDayName;