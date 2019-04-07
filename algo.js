var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.getX = function () {
        return this.x;
    };
    Point.prototype.getY = function () {
        return this.y;
    };
    Point.distance = function (a, b) {
        return Math.sqrt(Math.pow(a.getY() - b.getY(), 2) +
            Math.pow(a.getX() - b.getX(), 2));
    };
    Point.equalityOfPoints = function (a, b) {
        return a.getX() == b.getX() && a.getY() == b.getY();
    };
    Point.equationOfLine = function (x, y, x0) {
        if (y.getX() - x.getX() == 0) {
            return x0;
        }
        return (x0 - x.getX()) * (y.getY() - x.getY()) / (y.getX() - x.getX()) + x.getY();
    };
    return Point;
}());
var Line = (function () {
    function Line(x, y) {
        this.x = new Point(x.getX(), x.getY());
        this.y = new Point(y.getX(), y.getY());
    }
    Line.prototype.getPointX = function () {
        return this.x;
    };
    Line.prototype.getPointY = function () {
        return this.y;
    };
    Line.prototype.getLengthOfLine = function () {
        return Math.sqrt(Math.pow(this.y.getX() - this.x.getX(), 2) +
            Math.pow(this.y.getY() - this.x.getY(), 2));
    };
    Line.getLineWithTheHighestLength = function (lines) {
        var line = lines[0];
        for (var i = 0; i < lines.length; i++) {
            if (line.getLengthOfLine() < lines[i].getLengthOfLine()) {
                line = lines[i];
            }
        }
        return line;
    };
    return Line;
}());
var Color = (function () {
    function Color(r, g, b) {
        this.a = 255;
        this.r = r;
        this.g = g;
        this.b = b;
    }
    Color.prototype.getR = function () {
        return this.r;
    };
    Color.prototype.getG = function () {
        return this.g;
    };
    Color.prototype.getB = function () {
        return this.b;
    };
    Color.prototype.getA = function () {
        return this.a;
    };
    return Color;
}());
var AlgorithmOfDiscreteFeatures = (function () {
    function AlgorithmOfDiscreteFeatures(alpha, circulation, numbOfParts) {
        this.alpha = alpha;
        this.circulation = circulation;
        this.numbOfParts = numbOfParts;
    }
    AlgorithmOfDiscreteFeatures.prototype.getAlpha = function () {
        return this.alpha;
    };
    AlgorithmOfDiscreteFeatures.prototype.getCirculation = function () {
        return this.circulation;
    };
    AlgorithmOfDiscreteFeatures.prototype.getNumbOfParts = function () {
        return this.numbOfParts;
    };
    AlgorithmOfDiscreteFeatures.prototype.getBasePoints = function () {
        var basePoints = [];
        var numbOnLeftPart = Math.floor(this.numbOfParts / 2);
        var numbOnRightPart = this.numbOfParts - numbOnLeftPart;
        var stepForLeftPart = 75 / numbOnLeftPart;
        var stepForRightPart = 75 / numbOnRightPart;
        var leftPartOfLine = null;
        var rightPartOfLine = null;
        for (var i = 0; i < numbOnLeftPart; i++) {
            leftPartOfLine = Point.equationOfLine(new Point(300, 500), new Point(375, 250), 300 + stepForLeftPart * i);
            basePoints.push(new Point(300 + stepForLeftPart * i, leftPartOfLine));
        }
        for (var i = 0; i <= numbOnRightPart; i++) {
            rightPartOfLine = Point.equationOfLine(new Point(375, 250), new Point(450, 500), 375 + stepForRightPart * i);
            basePoints.push(new Point(375 + stepForRightPart * i, rightPartOfLine));
        }
        return basePoints;
    };
    AlgorithmOfDiscreteFeatures.prototype.getCollocationPoints = function () {
        var middlePoints = [];
        var basePoints = this.getBasePoints();
        for (var i = 0; i < basePoints.length - 1; i++) {
            var x = (basePoints[i + 1].getX() + basePoints[i].getX()) / 2.0;
            var y = (basePoints[i + 1].getY() + basePoints[i].getY()) / 2.0;
            var middlePoint = new Point(x, y);
            middlePoints.push(middlePoint);
        }
        return middlePoints;
    };
    AlgorithmOfDiscreteFeatures.getN = function (points1, points2) {
        var x = (points2.getX() - points1.getX()) / Point.distance(points1, points2);
        var y = (points2.getY() - points1.getY()) / Point.distance(points1, points2);
        return new Point(-y, x);
    };
    AlgorithmOfDiscreteFeatures.prototype.getMinSigma = function () {
        var distances = [];
        var minDistance;
        var basePoints = this.getBasePoints();
        for (var i = 0; i < basePoints.length - 1; i++) {
            distances.push(Point.distance(basePoints[i + 1], basePoints[i]));
        }
        minDistance = distances[0];
        for (var i = 0; i < distances.length; i++) {
            if (minDistance > distances[i]) {
                minDistance = distances[i];
            }
        }
        return 0.5 * minDistance;
    };
    AlgorithmOfDiscreteFeatures.getR = function (point, basePoint, sigma) {
        return Math.max(Point.distance(point, basePoint), sigma);
    };
    AlgorithmOfDiscreteFeatures.getVj = function (colocatioPoint, basePoint, valueR) {
        var firstCom = AlgorithmOfDiscreteFeatures.u(colocatioPoint.getX(), colocatioPoint.getY(), basePoint, valueR);
        var secondCom = AlgorithmOfDiscreteFeatures.v(colocatioPoint.getX(), colocatioPoint.getY(), basePoint, valueR);
        return new Point(firstCom, secondCom);
    };
    AlgorithmOfDiscreteFeatures.u = function (x, y, basePoint, valueR) {
        var firstCom = (basePoint.getY() - y) / (2 * Math.PI * Math.pow(valueR, 2));
        return firstCom;
    };
    AlgorithmOfDiscreteFeatures.v = function (x, y, basePoint, valueR) {
        var secondCom = (x - basePoint.getX()) / (2 * Math.PI * Math.pow(valueR, 2));
        return secondCom;
    };
    AlgorithmOfDiscreteFeatures.prototype.getRightPart = function () {
        var rightPart = [];
        var basePoints = this.getBasePoints();
        for (var i = 0; i < basePoints.length - 1; i++) {
            var vectN = AlgorithmOfDiscreteFeatures.getN(basePoints[i], basePoints[i + 1]);
            rightPart.push(-(vectN.getX() * Math.cos(this.alpha) + vectN.getY() * Math.sin(this.alpha)));
        }
        rightPart.push(this.circulation);
        return rightPart;
    };
    AlgorithmOfDiscreteFeatures.prototype.getLeftPart = function () {
        var leftPart = [];
        var sigma = this.getMinSigma();
        var basePoints = this.getBasePoints();
        var colocatioPoints = this.getCollocationPoints();
        for (var i = 0; i < basePoints.length; i++) {
            var subLeftPart = [];
            if (i < basePoints.length - 1) {
                var vectN = AlgorithmOfDiscreteFeatures.getN(basePoints[i], basePoints[i + 1]);
                for (var j = 0; j < basePoints.length; j++) {
                    var valueR = AlgorithmOfDiscreteFeatures.getR(colocatioPoints[i], basePoints[j], sigma);
                    var vectV = AlgorithmOfDiscreteFeatures.getVj(colocatioPoints[i], basePoints[j], valueR);
                    subLeftPart.push(vectV.getX() * vectN.getX() + vectV.getY() * vectN.getY());
                }
            }
            else {
                for (var j = 0; j < basePoints.length; j++) {
                    subLeftPart.push(1);
                }
            }
            leftPart.push(subLeftPart);
        }
        return leftPart;
    };
    AlgorithmOfDiscreteFeatures.prototype.getAnotherFi = function (x, y, gammas) {
        var sum = 0;
        var basePoints = this.getBasePoints();
        var sigma = this.getMinSigma();
        var L0 = this.circulation;
        for (var i = 0; i < gammas.length - 1; i++) {
            var sum1 = 0;
            for (var k = 0; k <= i; k++) {
                sum1 += gammas[k];
            }
            var Rj = AlgorithmOfDiscreteFeatures.getR(new Point(x, y), basePoints[i], sigma);
            sum += (sum1 / (2 * Math.PI)) * ((basePoints[i + 1].getY() - basePoints[i].getY()) *
                (x - basePoints[i].getX()) - (basePoints[i + 1].getX() - basePoints[i].getX()) *
                (y - basePoints[i].getY())) / Math.pow(Rj, 2);
        }
        return x * Math.cos(this.alpha) + y * Math.sin(this.alpha) + sum + L0 *
            Math.atan2(y - basePoints[gammas.length - 1].getY(), x - basePoints[gammas.length - 1].getX()) / (2 * Math.PI);
    };
    AlgorithmOfDiscreteFeatures.prototype.getPsi = function (x, y, gammas) {
        var sum = 0;
        var basePoints = this.getBasePoints();
        var sigma = this.getMinSigma();
        for (var i = 0; i < gammas.length; i++) {
            sum += gammas[i] * Math.log(AlgorithmOfDiscreteFeatures.getR(new Point(x, y), basePoints[i], sigma)) / (2 * Math.PI);
        }
        return y * Math.cos(this.alpha) - x * Math.sin(this.alpha) - sum;
    };
    AlgorithmOfDiscreteFeatures.prototype.getGammas = function () {
        var rightPart = this.getRightPart();
        var leftPart = this.getLeftPart();
        var Gammas = Gaus.solve(leftPart, rightPart);
        return Gammas;
    };
    AlgorithmOfDiscreteFeatures.prototype.getV = function (x, y, gammas) {
        var sumOfCompsX = 0;
        var sumOfCompsY = 0;
        var basePoints = this.getBasePoints();
        var sigma = this.getMinSigma();
        for (var i = 0; i < gammas.length; i++) {
            var valueR = AlgorithmOfDiscreteFeatures.getR(new Point(x, y), basePoints[i], sigma);
            var sumComp = AlgorithmOfDiscreteFeatures.getVj(new Point(x, y), basePoints[i], valueR);
            sumOfCompsX = sumOfCompsX + gammas[i] * sumComp.getX();
            sumOfCompsY = sumOfCompsY + gammas[i] * sumComp.getY();
        }
        sumOfCompsX += Math.cos(this.alpha);
        sumOfCompsY += Math.sin(this.alpha);
        return new Point(sumOfCompsX, sumOfCompsY);
    };
    return AlgorithmOfDiscreteFeatures;
}());
var Gaus = (function () {
    function Gaus() {
    }
    Gaus.clone = function (objectToCopy) {
        return JSON.parse(JSON.stringify(objectToCopy));
    };
    Gaus.solve = function (a, b) {
        var sizeOfMatrix = b.length;
        a = Gaus.clone(a);
        b = Gaus.clone(b);
        for (var k = 0; k < sizeOfMatrix; k++) {
            var d = a[k][k];
            if (d == 0) {
                var l = k + 1;
                while (l != sizeOfMatrix) {
                    a = Gaus.exchangeLinesOfMatrix(a, l, k);
                    b = Gaus.exchangeValuesOfVector(b, l, k);
                    if (a[k][k] != 0) {
                        break;
                    }
                    l++;
                }
                if (l == sizeOfMatrix) {
                    throw new Error("lines of the matrix A are linearly dependent");
                }
                d = a[k][k];
            }
            a[k][k] = 1;
            for (var j = k + 1; j < sizeOfMatrix; j++) {
                a[k][j] = a[k][j] / d;
            }
            b[k] = b[k] / d;
            for (var i = 0; i < sizeOfMatrix; i++) {
                if (i != k) {
                    var s = a[i][k];
                    a[i][k] = 0;
                    for (var j = k + 1; j < sizeOfMatrix; j++) {
                        a[i][j] = a[i][j] - s * a[k][j];
                    }
                    b[i] = b[i] - s * b[k];
                }
            }
        }
        return b;
    };
    Gaus.exchangeLinesOfMatrix = function (a, l, k) {
        for (var i = 0; i < a.length; i++) {
            var temp = a[l][i];
            a[l][i] = a[k][i];
            a[k][i] = temp;
        }
        return a;
    };
    Gaus.exchangeValuesOfVector = function (a, l, k) {
        var temp = a[l];
        a[l] = a[k];
        a[k] = temp;
        return a;
    };
    return Gaus;
}());
