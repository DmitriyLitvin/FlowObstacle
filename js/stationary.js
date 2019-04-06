var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var canvasData = context.getImageData(0, 0, 750, 750);
var task = new AlgorithmOfDiscreteFeatures(0, 0, 250);
var gammas = task.getGammas();
var lengthOfCanvas = canvasData.height;

function drawLine(a, b, colour, width) {
    context.beginPath();
    context.moveTo(a.getX(), a.getY());
    context.lineTo(b.getX(), b.getY());
    context.fillStyle = colour;
    context.fill();
    context.lineWidth = width;
    context.strokeStyle = colour;
    context.stroke();
}

function drawCircle(point) {
    context.beginPath();
    context.arc(point.getX(), point.getY(), 2, 0, 2 * Math.PI, true);
    context.fillStyle = 'black';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = 'black';
    context.stroke();
}

function generateLines() {
    var lines = [];
    for (var i = 10; i < lengthOfCanvas; i += 30) {
        for (var j = 10; j < lengthOfCanvas; j += 30) {
            var currentPoint = new Point(i, j);
            var tempPoint = task.getV(i, j, gammas);
            var nextPoint = new Point(currentPoint.getX() + tempPoint.getX(),
                currentPoint.getY() + tempPoint.getY());
            lines.push(new Line(currentPoint, nextPoint));
        }
    }
    return lines;
}

function generateV() {
    var lines = generateLines();
    var lineWithTheHighestLength = Line.getLineWithTheHighestLength(lines);
    var newMaxLength = 40;
    var koef = lineWithTheHighestLength.getLengthOfLine() / newMaxLength;
    for (var i = 0; i < lines.length; i++) {
        var endOfLineX = (lines[i].getPointY().getX() - lines[i].getPointX().getX()) /
            koef + lines[i].getPointX().getX();
        var endOfLineY = (lines[i].getPointY().getY() - lines[i].getPointX().getY()) /
            koef + lines[i].getPointX().getY();
        drawLine(lines[i].getPointX(), new Point(endOfLineX, endOfLineY), 'black', 0.5);
    }
}

function discreteColorsGradient(colorsNum) {
    var colorStep = 510 / (colorsNum - 1);
    var colors = [];
    var r = 0;
    var g = 0;
    var b = 255;
    var color = new Color(r, g, b);
    colors.push(color);
    var toWhite = true;
    for (var i = 0; i < colorsNum - 1; i++) {
        if (toWhite) {
            r += colorStep;
            g += colorStep;
            if (r > 255) {
                var diff = r - 255;
                r = 255;
                g = 255;
                g -= diff;
                b -= diff;
                toWhite = false;
            }
        }
        else {
            g = Math.max(0, g - colorStep);
            b = Math.max(0, b - colorStep);
        }
        color = new Color(Math.round(r), Math.round(g), Math.round(b));
        colors.push(color);
    }
    return colors;
}

function getMaxPsi() {
    var maxPsi = task.getPsi(0, 0, gammas);
    for (var i = 0; i < lengthOfCanvas; i++) {
        for (var j = 0; j < lengthOfCanvas; j++) {
            if (maxPsi < task.getPsi(i, j, gammas)) {
                maxPsi = task.getPsi(i, j, gammas);
            }
        }
    }
    return maxPsi;
}

function getMinPsi() {
    var minPsi = task.getPsi(0, 0, gammas);
    for (var i = 0; i < lengthOfCanvas; i++) {
        for (var j = 0; j < lengthOfCanvas; j++) {
            if (minPsi > task.getPsi(i, j, gammas)) {
                minPsi = task.getPsi(i, j, gammas);
            }
        }
    }
    return minPsi;
}

function getMaxAnotherFi() {
    var maxAnotherFi = task.getAnotherFi(0, 0, gammas);
    for (var i = 0; i < lengthOfCanvas; i++) {
        for (var j = 0; j < lengthOfCanvas; j++) {
            if (maxAnotherFi < task.getAnotherFi(i, j, gammas)) {
                maxAnotherFi = task.getAnotherFi(i, j, gammas);
            }
        }
    }
    return maxAnotherFi;
}

function getMinAnotherFi() {
    var minAnotherFi = task.getAnotherFi(0, 0, gammas);
    for (var i = 0; i < lengthOfCanvas; i++) {
        for (var j = 0; j < lengthOfCanvas; j++) {
            if (minAnotherFi > task.getAnotherFi(i, j, gammas)) {
                minAnotherFi = task.getAnotherFi(i, j, gammas);
            }
        }
    }
    return minAnotherFi;
}

function drawPixel(i, j, r, g, b, a) {
    var index = (i + j * lengthOfCanvas) * 4;
    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = a;
}

function updateCanvas() {
    context.putImageData(canvasData, 0, 0);
}

function getIndexOfColor(currentVal, minVal, diapason, colorsLength) {
    return Math.floor(Math.round(((currentVal - minVal) / diapason) * (colorsLength - 1)));
}

function Psi(numbOfColors) {
    var minPsi = getMinPsi();
    var maxPsi = getMaxPsi();
    var diapason = maxPsi - minPsi;
    var colors = discreteColorsGradient(numbOfColors);
    for (var i = 0; i < lengthOfCanvas; i++) {
        for (var j = 0; j < lengthOfCanvas; j++) {
            var indOfColor = getIndexOfColor(task.getPsi(i, j, gammas), minPsi, diapason, colors.length);
            var color = colors[indOfColor];
            drawPixel(i, j, color.getR(), color.getG(), color.getB(), color.getA())
        }
    }
}

function AnotherFi(numbOfColors) {
    var minAnotherFi = getMinAnotherFi();
    var maxAnotherFi = getMaxAnotherFi();
    var diapason = maxAnotherFi - minAnotherFi;
    var colors = discreteColorsGradient(numbOfColors);
    for (var i = 0; i < lengthOfCanvas; i++) {
        for (var j = 0; j < lengthOfCanvas; j++) {
            var indOfColor = getIndexOfColor(task.getAnotherFi(i, j, gammas), minAnotherFi, diapason, colors.length);
            var color = colors[indOfColor];
            drawPixel(i, j, color.getR(), color.getG(), color.getB(), color.getA())
        }
    }
}

Psi(25);
updateCanvas();
