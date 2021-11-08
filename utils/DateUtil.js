

function obtainCurrentDate() {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth()+1;
    if(month<10)
    {
        month = '0'+month;
    }
    var year = today.getFullYear();
    var today = day+'/'+month+'/'+year;
    return today;
}

function getDifferenceInDays(currentInventory,currentFruit) {
    
    var differentDays = getDaysDifferenceFromDate(currentInventory.entryTime);
    var currentShelf = currentInventory.remainingShelfDays;
    if(currentShelf!=currentFruit.shelfLifeDays-differentDays)
    currentShelf = currentFruit.shelfLifeDays-differentDays;

    return currentShelf;
}

function getDaysDifferenceFromDate(entryTime) 
{
    var entryDate = convertStringToDate(entryTime,"dd/MM/yyyy","/");
    var todayDate = new Date();
    const utc1 = Date.UTC(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());
    const utc2 = Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function convertStringToDate(_date,_format,_delimiter)
{
            var formatLowerCase=_format.toLowerCase();
            var formatItems=formatLowerCase.split(_delimiter);
            var dateItems=_date.split(_delimiter);
            var monthIndex=formatItems.indexOf("mm");
            var dayIndex=formatItems.indexOf("dd");
            var yearIndex=formatItems.indexOf("yyyy");
            var month=parseInt(dateItems[monthIndex]);
            month-=1;
            var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
            return formatedDate;
}

module.exports = {
    obtainCurrentDate,
    getDifferenceInDays
}