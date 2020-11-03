/*global window */

var RsImageFilters = require('./rsImagefilters');
var FlowCalculator = require('./flowCalculator');
module.exports = FilteredFlow;

/**
 * A high level interface to capture optical flow from the <video> tag.
 * The API is symmetrical to webcamFlow.js
 *
 * Usage example:
 *  var flow = new FilteredFlow();
 *
 *  // Every time when optical flow is calculated
 *  // the 'onCalculated' callback should execute:
 *
 *  flow.onCalculated(function (direction) {
 *      // direction is an object which describes current flow:
 *      // direction.u, direction.v {floats} general flow vector
 *      // direction.zones {Array} is a collection of flowZones.
 *      //  Each flow zone describes optical flow direction inside of it.
 *  });
 *
 *  // Starts capturing the flow from webcamera:
 *  flow.startCapture();
 *  // once you are done capturing call
 *  flow.stopCapture();
 */
function FilteredFlow(defaultVideoTag, zoneSize) {
    var calculatedCallbacks = [],
        canvas,
        video = defaultVideoTag,
        ctx,
        width,
        height,
        oldImage,
        loopId,
        calculator = new FlowCalculator(zoneSize || 8),

        requestAnimFrame = window.requestAnimationFrame       ||
                           window.webkitRequestAnimationFrame ||
                           window.mozRequestAnimationFrame    ||
                           window.oRequestAnimationFrame      ||
                           window.msRequestAnimationFrame     ||
                           function( callback ) { window.setTimeout(callback, 1000 / 60); },
        cancelAnimFrame =  window.cancelAnimationFrame ||
                           window.mozCancelAnimationFrame,
        isCapturing = false,
        destData,

        getCurrentPixels = function () {
            width = video.videoWidth;
            height = video.videoHeight;
            canvas.width  = width;
            canvas.height = height;

            if (width && height) {

                ctx.drawImage(video, 0, 0);
                //var imgd = ctx.getImageData(0, 0, width, height);

                let srcData = ctx.getImageData(0, 0, width, height);
                destData = ctx.getImageData(0, 0, width, height);
                // RsImageFilters.denoise( srcData, destData, width, height, 4 );

                return destData.data;

            }
        },

        calculate = function () {
            var newImage = getCurrentPixels();
            if (oldImage && newImage) {
                var zones = calculator.calculate(oldImage, newImage, width, height);
                calculatedCallbacks.forEach(function (callback) {
                    callback(zones, destData);
                });
            }
            oldImage = newImage;
        },

        initView = function () {
            width = video.videoWidth;
            height = video.videoHeight;

            if (!canvas) { canvas = window.document.createElement('canvas'); }
            ctx = canvas.getContext('2d');
        },
        animloop = function () {
            if (isCapturing) {
                loopId = requestAnimFrame(animloop);
                calculate();
            }
        };

    if (!defaultVideoTag) {
        var err = new Error();
        err.message = "Video tag is required";
        throw err;
    }

    this.startCapture = function () {
        // todo: error?
        isCapturing = true;
        initView();
        animloop();
    };
    this.stopCapture = function () {
        cancelAnimFrame(loopId);
        isCapturing = false;
    };

    this.onCalculated = function (callback) {
        calculatedCallbacks.push(callback);
    };

    this.getWidth = function () { return width; };
    this.getHeight = function () { return height; };
}
