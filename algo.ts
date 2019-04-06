class Point {
    private x: number;
    private y: number;

    public getX() {
        return this.x;
    }

    public getY() {
        return this.y;
    }

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public static distance(a: Point, b: Point): number {
        return Math.sqrt(Math.pow(a.getY() - b.getY(), 2) +
            Math.pow(a.getX() - b.getX(), 2));
    }

    public static equalityOfPoints(a: Point, b: Point): boolean {
        return a.getX() == b.getX() && a.getY() == b.getY();
    }

    public static equationOfLine(x: Point, y: Point, x0: number) {
        if (y.getX() - x.getX() == 0) {
            return x0;
        }

        return (x0 - x.getX()) * (y.getY() - x.getY()) / (y.getX() - x.getX()) + x.getY();
    }
}

class Line {
    private x: Point;
    private y: Point;

    constructor(x: Point, y: Point) {
        this.x = new Point(x.getX(), x.getY());
        this.y = new Point(y.getX(), y.getY());
    }

    public getPointX() {
        return this.x;
    }

    public getPointY() {
        return this.y;
    }

    public getLengthOfLine(): number {
        return Math.sqrt(Math.pow(this.y.getX() - this.x.getX(), 2) +
            Math.pow(this.y.getY() - this.x.getY(), 2));
    }

    public static getLineWithTheHighestLength(lines: Line[]) {
        let line = lines[0];

        for (let i = 0; i < lines.length; i++) {
            if (line.getLengthOfLine() < lines[i].getLengthOfLine()) {
                line = lines[i];
            }
        }

        return line;
    }
}

class Color {
    private r;
    private g;
    private b;
    private a = 255;

    public constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    public getR(): number {
        return this.r;
    }

    public getG(): number {
        return this.g;
    }

    public getB(): number {
        return this.b;
    }

    public getA(): number {
        return this.a;
    }
}

class AlgorithmOfDiscreteFeatures {
    private alpha;
    private L0;
    private numbOfParts;

    public constructor(alpha: number, L0: number, numbOfParts: number) {
        this.alpha = alpha;
        this.L0 = L0;
        this.numbOfParts = numbOfParts;
    }

    public getAlpha() {
        return this.alpha;
    }

    public getL0() {
        return this.L0;
    }

    public getNumbOfParts() {
        return this.numbOfParts;
    }

    public getBasePoints(): Point[] {
        let basePoints = [];
        let numbOnLeftPart = Math.floor(this.numbOfParts / 2);
        let numbOnRightPart = this.numbOfParts - numbOnLeftPart;
        let stepForLeftPart = 75 / numbOnLeftPart;
        let stepForRightPart = 75 / numbOnRightPart;
        let leftPartOfLine = null;
        let rightPartOfLine = null;
        for (let i = 0; i < numbOnLeftPart; i++) {
            leftPartOfLine = Point.equationOfLine(new Point(300, 500), new Point(375, 250),
                300 + stepForLeftPart * i);
            basePoints.push(new Point(300 + stepForLeftPart * i, leftPartOfLine));
        }
        for (let i = 0; i <= numbOnRightPart; i++) {
            rightPartOfLine = Point.equationOfLine(new Point(375, 250), new Point(450, 500),
                375 + stepForRightPart * i);
            basePoints.push(new Point(375 + stepForRightPart * i, rightPartOfLine));
        }

        return basePoints;
    }

    public getCollocationPoints(): Point[] {
        let middlePoints = [];
        let basePoints = this.getBasePoints();
        for (let i = 0; i < basePoints.length - 1; i++) {
            let x = (basePoints[i + 1].getX() + basePoints[i].getX()) / 2.0;
            let y = (basePoints[i + 1].getY() + basePoints[i].getY()) / 2.0;
            let middlePoint = new Point(x, y);
            middlePoints.push(middlePoint);
        }

        return middlePoints;
    }

    public static getN(points1: Point, points2: Point): Point {
        let x = (points2.getX() - points1.getX()) / Point.distance(points1, points2);
        let y = (points2.getY() - points1.getY()) / Point.distance(points1, points2);

        return new Point(-y, x);
    }

    public getMinSigma(): number {
        let distances = [];
        let minDistance;
        let basePoints = this.getBasePoints();

        for (let i = 0; i < basePoints.length - 1; i++) {
            distances.push(Point.distance(basePoints[i + 1], basePoints[i]));
        }
        minDistance = distances[0];
        for (let i = 0; i < distances.length; i++) {
            if (minDistance > distances[i]) {
                minDistance = distances[i];
            }
        }

        return 0.5 * minDistance;
    }

    public static getR(point: Point, basePoint: Point, sigma: number): number {
        return Math.max(Point.distance(point, basePoint), sigma);
    }

    public static getVj(colocatioPoint: Point, basePoint: Point, valueR: number): Point {
        let firstCom = AlgorithmOfDiscreteFeatures.u(colocatioPoint.getX(),
            colocatioPoint.getY(), basePoint, valueR);
        let secondCom = AlgorithmOfDiscreteFeatures.v(colocatioPoint.getX(),
            colocatioPoint.getY(), basePoint, valueR);

        return new Point(firstCom, secondCom);
    }

    public static u(x: number, y: number, basePoint: Point, valueR: number): number {
        let firstCom = (basePoint.getY() - y) / (2 * Math.PI * Math.pow(valueR, 2));

        return firstCom;
    }

    public static v(x: number, y: number, basePoint: Point, valueR: number): number {
        let secondCom = (x - basePoint.getX()) / (2 * Math.PI * Math.pow(valueR, 2));

        return secondCom;
    }

    public getRightPart(): number[] {
        let rightPart = [];
        let basePoints = this.getBasePoints();
        for (let i = 0; i < basePoints.length - 1; i++) {
            let vectN = AlgorithmOfDiscreteFeatures.getN(basePoints[i], basePoints[i + 1]);
            rightPart.push(-(vectN.getX() * Math.cos(this.alpha) + vectN.getY() * Math.sin(this.alpha)))
        }
        rightPart.push(this.L0);

        return rightPart;
    }

    public getLeftPart(): number[][] {
        let leftPart = [];
        let sigma = this.getMinSigma();
        let basePoints = this.getBasePoints();
        let colocatioPoints = this.getCollocationPoints();
        for (let i = 0; i < basePoints.length; i++) {
            let subLeftPart = [];
            if (i < basePoints.length - 1) {
                let vectN = AlgorithmOfDiscreteFeatures.getN(basePoints[i], basePoints[i + 1]);
                for (let j = 0; j < basePoints.length; j++) {
                    let valueR = AlgorithmOfDiscreteFeatures.getR(colocatioPoints[i], basePoints[j], sigma);
                    let vectV = AlgorithmOfDiscreteFeatures.getVj(colocatioPoints[i], basePoints[j], valueR);
                    subLeftPart.push(vectV.getX() * vectN.getX() + vectV.getY() * vectN.getY());
                }
            }
            else {
                for (let j = 0; j < basePoints.length; j++) {
                    subLeftPart.push(1);
                }
            }
            leftPart.push(subLeftPart);
        }

        return leftPart;
    }

    public getAnotherFi(x: number, y: number, gammas: number[]): number {
        let sum = 0;
        let basePoints = this.getBasePoints();
        let sigma = this.getMinSigma();
        let L0 = this.L0;
        for (let i = 0; i < gammas.length - 1; i++) {
            let sum1 = 0;
            for (let k = 0; k <= i; k++) {
                sum1 += gammas[k];
            }
            let Rj = AlgorithmOfDiscreteFeatures.getR(new Point(x, y), basePoints[i], sigma);
            sum += (sum1 / (2 * Math.PI)) * ((basePoints[i + 1].getY() - basePoints[i].getY()) *
                (x - basePoints[i].getX()) - (basePoints[i + 1].getX() - basePoints[i].getX()) *
                (y - basePoints[i].getY())) / Math.pow(Rj, 2)
        }

        return x * Math.cos(this.alpha) + y * Math.sin(this.alpha) + sum + L0 *
            Math.atan2(y - basePoints[gammas.length - 1].getY(),
                x - basePoints[gammas.length - 1].getX()) / (2 * Math.PI);
    }


    public getPsi(x: number, y: number, gammas: number[]): number {
        let sum = 0;
        let basePoints = this.getBasePoints();
        let sigma = this.getMinSigma();
        for (let i = 0; i < gammas.length; i++) {
            sum += gammas[i] * Math.log(AlgorithmOfDiscreteFeatures.getR(new Point(x, y),
                basePoints[i], sigma)) / (2 * Math.PI);
        }

        return y * Math.cos(this.alpha) - x * Math.sin(this.alpha) - sum;
    }

    public getGammas(): number[] {
        let rightPart = this.getRightPart();
        let leftPart = this.getLeftPart();
        let Gammas = Gaus.solve(leftPart, rightPart);

        return Gammas;
    }

    public getV(x: number, y: number, gammas: number[]): Point {
        let sumOfCompsX = 0;
        let sumOfCompsY = 0;
        let basePoints = this.getBasePoints();
        let sigma = this.getMinSigma();
        for (let i = 0; i < gammas.length; i++) {
            let valueR = AlgorithmOfDiscreteFeatures.getR(new Point(x, y), basePoints[i], sigma);
            let sumComp = AlgorithmOfDiscreteFeatures.getVj(new Point(x, y), basePoints[i], valueR);
            sumOfCompsX = sumOfCompsX + gammas[i] * sumComp.getX();
            sumOfCompsY = sumOfCompsY + gammas[i] * sumComp.getY();
        }
        sumOfCompsX += Math.cos(this.alpha);
        sumOfCompsY += Math.sin(this.alpha);
        return new Point(sumOfCompsX, sumOfCompsY);
    }
}

class Gaus {

    private static clone(objectToCopy) {
        return JSON.parse(JSON.stringify(objectToCopy));
    }

    public static solve(a: number[][], b: number[]): number[] {
        let sizeOfMatrix = b.length;

        a = Gaus.clone(a);
        b = Gaus.clone(b);

        for (let k = 0; k < sizeOfMatrix; k++) {
            let d = a[k][k];
            if (d == 0) {
                let l = k + 1;
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
            for (let j = k + 1; j < sizeOfMatrix; j++) {
                a[k][j] = a[k][j] / d;
            }
            b[k] = b[k] / d;
            for (let i = 0; i < sizeOfMatrix; i++) {
                if (i != k) {
                    let s = a[i][k];
                    a[i][k] = 0;
                    for (let j = k + 1; j < sizeOfMatrix; j++) {
                        a[i][j] = a[i][j] - s * a[k][j];
                    }
                    b[i] = b[i] - s * b[k];
                }
            }
        }

        return b;
    }

    private static exchangeLinesOfMatrix(a: number[][], l: number, k: number): number[][] {
        for (let i = 0; i < a.length; i++) {
            let temp = a[l][i];
            a[l][i] = a[k][i];
            a[k][i] = temp;
        }

        return a;
    }

    private static exchangeValuesOfVector(a: number[], l: number, k: number): number[] {
        let temp = a[l];
        a[l] = a[k];
        a[k] = temp;

        return a;
    }
}