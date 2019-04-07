# FlowObstacle

## Цель проекта
Данная программа визуализирует процесс обтекания течения реки вокруг конкретного препятствия, в данном случае буквы Л, которая находится в центре области визуализации. Для того чтобы показать поведение течения реки, была использована библиотека Canvas и следующие языки программирования: JS и TypeScript, на котором и был реализован метод "Дискретных особенностей".
Ниже приведен пример работы программы, когда угол набегающего потока 0, количество цветов палитры 25.

+ Потенциальное поле

![Psi](https://github.com/DmitriyLitvin/FlowObstacle/blob/flow/images/fi.PNG)

+ Линии течения

![Fi](https://github.com/DmitriyLitvin/FlowObstacle/blob/flow/images/psi.PNG)

## Запуск
Чтобы запустить программу нужно вызвать функцию fi() или psi() в файле stationary.js, которые зависят только от одного параметра - кол-во цветов палитры, также можно менять угол набегающевоп потока (он задан в радианах) и кол-во дискретных особенностей. Все изменения делаем в конструкторе который создает новый обьект класса AlgorithmOfDiscreteFeatures, где первый параметр кол-во цветов палитры, второй - циркуляция течения, третий - кол-во дискретны особенностей.
