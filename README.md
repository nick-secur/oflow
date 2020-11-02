oflow.js - optical flow detection in JavaScript: An Implementation of the Lucas Kanade Algorithm
===============================================

At the heart of this demo is a javascript implementation of the Lucas -- Kanade algorithm for estimating optical flow.

----
## Setup

1. Clone the repo.

2. Run `npm install` .

3. Build the distributable script (`/dist/oflow.js`):
```javascript
npm run build
```

4. Build and run the demo game :
```javascript
npm run demo
```

----
## Usage

To detect flow from `<video>` element:
```javascript
var flow = new oflow.VideoFlow(videoDomElement);
```
Where `videoDomElement` is a handle to a dom *video* element.

Then: 
```javascript
flow.onCalculated(function (direction) {
    // Implement the callback...
});
```
Where `direction` is a javascript object of the form:
```javascript

    {
      u: [float] // general flow vector horizontal component
      v: [float] // general flow vector vertical component
      zones: [
          { x, y, u, v },
          { x, y, u, v },
          ...
      ]
    }

```
and
```
// starts the video capture
flow.startCapture();

// stops capture
flow.stopCapture();
```

____
## Resources

1. [Lucas-Kanade method for optical flow estimation](http://en.wikipedia.org/wiki/Lucas%E2%80%93Kanade_method) . 
