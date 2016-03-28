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

function createCSSClass(selector, style) {
    if (!document.styleSheets) {
        return;
    }

    if (document.getElementsByTagName("head").length == 0) {
        return;
    }
}

function convertMilliSecondsToMinutesString(numMilliSecs){

    var numSecs = numMilliSecs / 1000;

    var remainingSeconds = Math.round(numSecs % 60);
    var numMins = Math.floor(numSecs / 60);

    return (numMins.toString() + ' mins ' + remainingSeconds + ' secs');
}


/*
* Checks if an array contains a value
* http://stackoverflow.com/questions/1181575/determine-whether-an-array-contains-a-value
*
*   EXAMPLE:
*
    var myArray = [0,1,2],
    needle = 1,
    index = contains.call(myArray, needle); // true
* */
var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};