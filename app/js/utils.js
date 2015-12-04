//calculate time passing in two strings
function getMilliSecondsBetweenTime( start, end )
{
    var startHours, startMins, startSecs;
    var endHours, endMins, endSecs;
    var startDate, endDate;
    var duration;

    startHours = parseInt(start.substring(0,2));
    startMins = parseInt(start.substring(3,5));
    startSecs = parseInt(start.substring(6,8));

    endHours = parseInt(end.substring(0,2));
    endMins = parseInt(end.substring(3,5));
    endSecs = parseInt(end.substring(6,8));

    startDate = new Date(1970, 1, 1, startHours, startMins, startSecs, 0);
    endDate = new Date(1970, 1, 1, endHours, endMins, endSecs, 0);

    duration = (endDate - startDate );

    return duration;
}

/*
* Returns a random color
*/

function generateColor(){
    var newColor = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
    return newColor;
}

function convertMilliSecondsToMinutesString(numMilliSecs){

    var numSecs = numMilliSecs / 1000;

    var remainingSeconds = Math.round(numSecs % 60);
    var numMins = Math.floor(numSecs / 60);

    return (numMins.toString() + ' mins ' + remainingSeconds + ' secs');
}
