
class EdgeCounter {
    constructor(up, down, left, right, counterThresh, threshCallback) {
        this.upCounter = 0;
        this.downCounter = 0;
        this.leftCounter = 0;
        this.rightCounter = 0;
        this.upThresh = up;
        this.downThresh = down;
        this.leftThresh = left;
        this.rightThresh = right;
        this.counterThresh = counterThresh;
        this.threshCallback = threshCallback;
    }
    incrementCount(direction) {
        var directions = ["up", "down", "left", "right"];
        var index = directions.indexOf(direction);
        if (index >= 0) {
            // Valid direction
            var counterName = direction + "Counter";
            this[counterName]++;
            // Now check if we hit threshold
            if (this[counterName] >= this.counterThresh) {
                // Threshold hit, calling callback function
                console.log("Reached threshold for " + direction);
                this.threshCallback(direction);
            }
            else {
                console.log("Did NOT reach threshold for " + direction);
            }
        }
    }
    decrementCount(direction) {
        var directions = ["up", "down", "left", "right"];
        var index = directions.indexOf(direction);
        if (index >= 0) {
            // Valid direction
            var counterName = direction + "Counter";
            if (this[counterName] > 0) {
                // Only decrement positive counts
                this[counterName]--;
            }
        }
    }
    modifyCounts(data) {
        if (data == null) {
            return;
        }
        var x = data.x;
        var y = data.y;
        if (this.upThresh > y) {
            // Eye is in the upper edge
            this.incrementCount("up");
            this.decrementCount("down");
            this.decrementCount("left");
            this.decrementCount("right");
        }
        else if (this.downThresh < y) {
            // Eye is in the lower edge
            this.incrementCount("down");
            this.decrementCount("up");
            this.decrementCount("left");
            this.decrementCount("right");
        }
        else if (this.rightThresh < x) {
            // Eye is in the right edge
            this.incrementCount("right");
            this.decrementCount("down");
            this.decrementCount("left");
            this.decrementCount("up");
        }
        else if (this.leftThresh > y) {
            // Eye is in the left edge
            this.incrementCount("left");
            this.decrementCount("down");
            this.decrementCount("right");
            this.decrementCount("up");
        }
        else {
            // Eye is not on an edge
            this.decrementCount("left");
            this.decrementCount("down");
            this.decrementCount("right");
            this.decrementCount("up");
        }
        console.log(this);
    }
}

var scrollFunction = function(direction) {
    var scrollAmount = 10;
    var directions = ["up", "down", "left", "right"];
    var index = directions.indexOf(direction);
    if (index >= 0) {
        // Valid direction
        if (direction == "up") {
            window.scrollBy(0, -scrollAmount);
        }
        else if (direction == "down") {
            window.scrollBy(0, scrollAmount);
        }
        else if (direction == "left") {
            window.scrollBy(-scrollAmount, 0);
        }
        else if (direction == "right") {
            window.scrollBy(scrollAmount, 0);
        }
        else {
            console.log("Invalid direction given: " + direction);
        }
    }
}


class ArticleCounter {
    constructor(article_list, counterThresh, threshCallback) {
        this.article_dict = {};
        for(var i = 0; i < article_list.length; ++i) {
            this.article_dict[article_list[i]] = 0;
        }
        this.counterThresh = counterThresh;
        this.threshCallback = threshCallback;
    }
    incrementCount(article_name) {
        if(Object.keys(this.article_dict).includes(article_name)) {
            // valid article name

            this.article_dict[article_name]++;

            // Now check if we hit threshold
            if (this.article_dict[article_name] >= this.counterThresh) {
                // Threshold hit, calling callback function
                console.log("Reached threshold for " + article_name);
                this.article_dict[article_name] = 0;
                this.threshCallback(article_name);
            }
            else {
                console.log("Did NOT reach threshold for " + article_name);
            }
        }
    }
    decrementCount(article_name) {
        if(Object.keys(this.article_dict).includes(article_name)) {
            // valid article name

            if (this.article_dict[article_name] > 0) {
                // Only decrement positive counts
                this.article_dict[article_name]--;
            }
        }
    }
    modifyCounts(data) {
        if (data == null) {
            return;
        }
        var x = data.x;
        var y = data.y;

        var el = document.elementFromPoint(data.x, data.y);
        if(el != null) {
            var classes = el.classList;
            for (var i = 0; i < classes.length; i++) {
                if(classes[i].startsWith("article")) {
                    for (var key in this.article_dict) {
                        if (key == classes[i]) {
                            this.incrementCount(key);
                        } else {
                            this.decrementCount(key);
                        }
                    }
                    break;
                }
            }
        }

        console.log(this.article_dict);
    }
}

var modalFunction = function(article_name) {
    var id = "#"+article_name;
    $(id).modal("show");
}

var counterThresh = 110;
var articleCounter = new ArticleCounter(['article_1', 'article_2'], counterThresh, modalFunction)



var edgeThresh = 50;
var edgeCounter = new EdgeCounter(edgeThresh, window.innerHeight - edgeThresh, edgeThresh, window.innerWidth - edgeThresh, 50, scrollFunction);




window.onload = function() {
webgazer.setRegression('weightedRidge') /* currently must set regression and tracker */
    .setTracker('clmtrackr')
    .setGazeListener(function(data, clock) {
        edgeCounter.modifyCounts(data);
        articleCounter.modifyCounts(data);
        //var reg = webgazer.getRegression();
        //console.log(reg);
        //console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
        console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
        var pred = webgazer.getCurrentPrediction();
        console.log(pred);
    })
    .begin()
    .showPredictionPoints(true); /* shows a square every 100 milliseconds where current prediction is */

var width = 320;
var height = 240;
var topDist = '0px';
var leftDist = '0px';

var setup = function() {
    /*
    var video = document.getElementById('webgazerVideoFeed');
    video.style.display = 'block';
    video.style.position = 'absolute';
    video.style.top = topDist;
    video.style.left = leftDist;
    video.width = width;
    video.height = height;
    video.style.margin = '0px';
    */
    webgazer.params.imgWidth = width;
    webgazer.params.imgHeight = height;
    /*
    var overlay = document.createElement('canvas');
    overlay.id = 'overlay';
    overlay.style.position = 'absolute';
    overlay.width = width;
    overlay.height = height;
    overlay.style.top = topDist;
    overlay.style.left = leftDist;
    overlay.style.margin = '0px';

    document.body.appendChild(overlay);
    */
    var cl = webgazer.getTracker().clm;
    /*
    function drawLoop() {
        requestAnimFrame(drawLoop);
        overlay.getContext('2d').clearRect(0,0,width,height);
        if (cl.getCurrentPosition()) {
            cl.draw(overlay);
        }
    }
    drawLoop();
    */
};

    function checkIfReady() {
        if (webgazer.isReady()) {
            setup();
        } else {
            setTimeout(checkIfReady, 100);
        }
    }
    setTimeout(checkIfReady,100);
};
window.onbeforeunload = function() {
    // webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
    window.localStorage.clear(); //Comment out if you want to save data across different sessions
}