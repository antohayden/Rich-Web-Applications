/*
 * Returns a color created from an array of generated colors
 * Based on tutorial here : http://krazydad.com/tutorials/makecolors.php
 */

function ColorGenerator() {

    var colors = [];
    var index = 0;
    var default_center = 128;
    var default_width = 127;
    var default_len = 50;

    function RGB2Color(r, g, b) {
        return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
    }

    function byte2Hex(n) {
        var nybHexString = "0123456789ABCDEF";
        return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
    }

    function makeColorGradient(frequency1, frequency2, frequency3,
                               phase1, phase2, phase3,
                               center, width, len) {
        if (center == undefined)   center = default_center;
        if (width == undefined)    width = default_width;
        if (len == undefined)      len = default_len;

        for (var i = 0; i < len; ++i) {
            var red = Math.sin(frequency1 * i + phase1) * width + center;
            var grn = Math.sin(frequency2 * i + phase2) * width + center;
            var blu = Math.sin(frequency3 * i + phase3) * width + center;
            colors.push(RGB2Color(red, grn, blu));
        }
    }

    this.getColor = function(){
        if(colors.length === 0 )
            makeColorGradient(.3,.3,.3,0,2,4);

        var color = colors[index%colors.length];
        index+= 3;

        return color;
    }
}