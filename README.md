# FlowObstacle

## Project purpose
This program visualizes the process of a river flowing around a particular obstacle (in this case the inverted letter V), which is located in the center of visualization area. In order to show the behavior of the river flow, I used the Canvas library and JS & TypeScript. Using Typescript language, I have implemented the algorithm of Discrete Features which can solve this task. Below you can see  how this program works when the angle of  incident flow is 0, the number of colors on the palette is 25.
+ Potential field

![Psi](https://github.com/DmitriyLitvin/FlowObstacle/blob/flow/images/fi.PNG)

+ Flow lines

![Fi](https://github.com/DmitriyLitvin/FlowObstacle/blob/flow/images/psi.PNG)

## Start
If you want to start the program, you need to call the fi () or psi () or generateV() function in the stationary.js file.

+ fi (numbOfColors) visualizes a flow lines,
+ psi (numbOfColors) visualizes a potential field,
+ generateV() visualizes a vector field.

You can also change the angle of  incident flow (it is specified in radians) and the number of discrete features . All changes are made in the constructor which creates a new object of the AlgorithmOfDiscreteFeatures class, where the first parameter is the number of colors of the palette, the second is the flow circulation, the third is the number of discrete features.
