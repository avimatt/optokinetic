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
                // console.log("Reached threshold for " + direction);
                this.threshCallback(direction);
            }
            else {
                // console.log("Did NOT reach threshold for " + direction);
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
            inEdgeRegion = true;
            this.incrementCount("up");
            this.decrementCount("down");
            this.decrementCount("left");
            this.decrementCount("right");
        }
        else if (this.downThresh < y) {
            // Eye is in the lower edge
            inEdgeRegion = true;
            this.incrementCount("down");
            this.decrementCount("up");
            this.decrementCount("left");
            this.decrementCount("right");
        }
        else if (this.rightThresh < x) {
            // Eye is in the right edge
            inEdgeRegion = true;
            this.incrementCount("right");
            this.decrementCount("down");
            this.decrementCount("left");
            this.decrementCount("up");
        }
        else if (this.leftThresh > y) {
            // Eye is in the left edge
            inEdgeRegion = true;
            this.incrementCount("left");
            this.decrementCount("down");
            this.decrementCount("right");
            this.decrementCount("up");
        }
        else {
            // Eye is not on an edge
            inEdgeRegion = false;
            this.decrementCount("left");
            this.decrementCount("down");
            this.decrementCount("right");
            this.decrementCount("up");
        }
        // console.log(this);
    }
}

var inEdgeRegion = false;
var scrollFunction = function(direction) {
    var scrollAmount = 2;
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
            // console.log("Invalid direction given: " + direction);
        }
    }
}


function showSecond() {
    $(".starts-shown").hide();
    $(".starts-hidden").show();
}

function showFirst() {
    $(".starts-hidden").hide();
    $(".starts-shown").show();
}

class ArticleCounter {
    constructor(article_list, enlargeThresh, counterThresh, threshCallback, hideCallback) {
        this.article_dict = {};
        for(var i = 0; i < article_list.length; ++i) {
            this.article_dict[article_list[i]] = 0;
        }
        this.modalFlag = false;
        this.modalCounter = 0;
        this.modalName = "";
        this.enlargeThresh = enlargeThresh;
        this.counterThresh = counterThresh;
        this.threshCallback = threshCallback;
        this.hideCallback = hideCallback;
    }
    incrementCount(article_name) {
        if (inEdgeRegion) {
            // Stop peaking articles when scrolling
            return;
        }
        if(Object.keys(this.article_dict).includes(article_name)) {
            // valid article name

            this.article_dict[article_name]++;

            // Now check if we hit threshold
            if(this.article_dict[article_name] >= this.enlargeThresh && article_name == "article_2") {
                showSecond();
            }

            if (this.article_dict[article_name] >= this.counterThresh) {
                // Threshold hit, calling callback function
                // console.log("Reached threshold for " + article_name);
                if(article_name == "article_2") {
                    showFirst();
                }
                this.article_dict[article_name] = 0;
                this.modalFlag = true;
                this.modalName = article_name;
                this.threshCallback(article_name);
            }
            else {
                // console.log("Did NOT reach threshold for " + article_name);
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
            if(this.modalFlag){
                if(!el.classList.contains("our_modal")) {
                    this.modalCounter++;
                    //console.log(this.modalCounter);
                    if(this.modalCounter > this.counterThresh/2) {
                        this.modalCounter = 0;
                        this.modalFlag = false;
                        this.hideCallback(this.modalName);
                    }
                }
            } else {
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
        }

        //console.log(this.article_dict);
    }
}

var modalFunction = function(article_name) {
    var id = "#" + article_name;
    $(id).modal("show");
}

var hideModal = function(article_name) {
    var id = "#" + article_name;
    $(id).modal("hide");
}

var weightedAverage = function(newPred, oldPred) {
    var oldPredWeightX = Math.sqrt(Math.abs(oldPred.x - newPred.x) / window.innerWidth);
    var newPredWeightX = 1 - oldPredWeightX;
    var oldPredWeightY = Math.sqrt(Math.abs(oldPred.y - newPred.y) / window.innerHeight);
    var newPredWeightY = 1 - oldPredWeightY;
    newPred.x = Math.round((newPredWeightX * newPred.x) + (oldPredWeightX * oldPred.x));
    newPred.y = Math.round((newPredWeightY * newPred.y) + (oldPredWeightY * oldPred.y));
}

var articles = [];
NUM_ARTICLES = 9;
for(var i = 0; i < NUM_ARTICLES; ++i){
    articles.push("article_" + i);
}

var counterThresh = 110;
var enlargeThresh = 60;
var articleCounter = new ArticleCounter(articles, enlargeThresh, counterThresh, modalFunction, hideModal);
var lastData = null;
var edgeDistanceThresh = 60;
var edgeCounterThresh = 15;
var edgeCounter = new EdgeCounter(edgeDistanceThresh,
    window.innerHeight - edgeDistanceThresh, edgeDistanceThresh,
    window.innerWidth - edgeDistanceThresh, edgeCounterThresh, scrollFunction);


window.onload = function() {
webgazer.setRegression('weightedRidge') /* currently must set regression and tracker */
    .setTracker('clmtrackr')
    .setGazeListener(function(data, clock) {
        if (data != null) {
            if (lastData != null) {
                webgazer.util.bound(data);
                weightedAverage(data, lastData);
            }
            else {
                webgazer.util.bound(data);
            }
            edgeCounter.modifyCounts(data);
            articleCounter.modifyCounts(data);
            lastData = data;
        }
        console.log(clock);
        console.log(data);
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
    //var cl = webgazer.getTracker().clm;
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
    setTimeout(checkIfReady, 100);
};
window.onbeforeunload = function() {
    // webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
    window.localStorage.clear(); //Comment out if you want to save data across different sessions
}