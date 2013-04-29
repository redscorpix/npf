# npfTransition

## Создание объекта CSS Animation

`npfAnimation.css(element: Element, time: number, opt_acc: Array.<number>|string=): !npfTransition.CssAnimation`

Создает и возвращает объект анимации с помощью CSS Animations.

* `element` — элемент, который будет анимироваться.
* `time` — длительность анимации в мс.
* `opt_acc` — функция акселлерации. Если не задана, то линейная анимация.
	Если массив, то направляющие точки кривой Безье (4 числа).


## Создание объекта JS анимации

`npfAnimation.js(element: Element, time: number, opt_acc: Array.<number>|string|function(number):number|null=): !NpfJsAnimation`

Создает и возвращает объект анимации с помощью JS.

* `element` — элемент, который будет анимироваться.
* `time` — длительность анимации в мс.
* `opt_acc` — функция акселлерации. Если не задана, то линейная анимация.
	Если массив, то направляющие точки кривой Безье (4 числа).


Функции акселлерации:

* `linear` (только CSS)
* `ease` (только CSS)
* `easeIn` (только CSS)
* `easeOut` (только CSS)
* `easeInOut` (только CSS)
* `easeInQuad`
* `easeInCubic`
* `easeInQuart`
* `easeInQuint`
* `easeInSine`
* `easeInExpo`
* `easeInCirc`
* `easeInBack`
* `easeOutQuad`
* `easeOutCubic`
* `easeOutQuart`
* `easeOutQuint`
* `easeOutSine`
* `easeOutExpo`
* `easeOutCirc`
* `easeOutBack`
* `easeInOutQuad`
* `easeInOutCubic`
* `easeInOutQuart`
* `easeInOutQuint`
* `easeInOutSine`
* `easeInOutExpo`
* `easeInOutCirc`
* `easeInOutBack`
* `easeInElastic` (только JS)
* `easeOutElastic` (только JS)
* `easeInOutElastic` (только JS)
* `easeInBounce` (только JS)
* `easeOutBounce` (только JS)
* `easeInOutBounce` (только JS)


## Проверка поддержки CSS анимации браузером

`npfAnimation.isCssAnimationSupported(): boolean`

Возвращает true, если браузер поддерживает CSS Animations.


## Проверка поддержки CSS Transform

`npfAnimation.isCssTransformSupported(): boolean`

Возвращает true, если браузер поддерживает CSS Transform.


## Проверка поддержки CSS Transform 3D

`npfAnimation.isCssTransform3dSupported(): boolean`

Возвращает true, если браузер поддерживает CSS Transform 3D.


## `NpfAnimationQueue` — класс для последовательности анимаций

### Запуск анимации

`NpfAnimationQueue.prototype.play(opt_restart: boolean=): !NpfAnimationQueue`

Запускает анимацию.

* `opt_restart` — начать анимацию с начала.


### Пауза анимации

`NpfAnimationQueue.prototype.pause(): !NpfAnimationQueue`

Ставит анимацию на паузу.


### Остановка анимации

`NpfAnimationQueue.prototype.stop(opt_gotoEnd: boolean=): !NpfAnimationQueue`

Останавливает анимацию.

* `opt_gotoEnd` — перейти на последний шаг анимации.


### Деструктор

`NpfAnimationQueue.prototype.dispose()`


### Добавление анимации в очередь

`NpfAnimationQueue.prototype.add(animation: Animation): !NpfAnimationQueue`

Добавляет анимацию в очередь.


### Удаление анимации из очереди

`NpfAnimationQueue.prototype.remove(animation: Animation)`

Удаляет анимацию из очереди.


### Функция, выполняемая при окончании анимации

NpfAnimationQueue.prototype.onFinish: ?function()


## `NpfAnimationParallelQueue` — класс для параллельных анимаций

### Запуск анимации

`NpfAnimationParallelQueue.prototype.play(opt_restart: boolean=): !NpfAnimationParallelQueue`

Запускает анимацию.

* `opt_restart` — начать анимацию с начала.


### Пауза анимации

`NpfAnimationParallelQueue.prototype.pause(): !NpfAnimationParallelQueue`

Ставит анимацию на паузу.


### Остановка анимации

`NpfAnimationParallelQueue.prototype.stop(opt_gotoEnd: boolean=): !NpfAnimationParallelQueue`

Останавливает анимацию.

* `opt_gotoEnd` — перейти на последний шаг анимации.


### Деструктор

`NpfAnimationParallelQueue.prototype.dispose()`


### Добавление анимации в очередь

`NpfAnimationParallelQueue.prototype.add(animation: Animation): !NpfAnimationParallelQueue`

Добавляет анимацию в очередь.


### Удаление анимации из очереди

`NpfAnimationParallelQueue.prototype.remove(animation: Animation): !NpfAnimationParallelQueue`

Удаляет анимацию из очереди.


### Функция, выполняемая при окончании анимации

`NpfAnimationParallelQueue.prototype.onFinish: ?function()`


## `NpfJsAnimation` — класс анимации с помощью JS


### Конструктор

`NpfJsAnimation(element: Element, time: number, opt_acc: Array.<number>|string|function(number):number|null=)`

* `element` — элемент, который будет анимироваться.
* `time` — длительность анимации в мс.
* `opt_acc` — функция акселлерации. Если не задана, то линейная анимация.
	Если массив, то направляющие точки кривой Безье (4 числа).


`NpfJsAnimation.prototype.play(opt_restart: boolean=): !NpfJsAnimation`

Запускает анимацию.

* `opt_restart` — начать анимацию с начала.


`NpfJsAnimation.prototype.pause(): !NpfJsAnimation`

Ставит анимацию на паузу.


`NpfJsAnimation.prototype.stop(opt_gotoEnd: boolean=): !NpfJsAnimation`

Останавливает анимацию.

* `opt_gotoEnd` — перейти на последний шаг анимации.


`NpfJsAnimation.prototype.dispose()`

Деструктор.


		NpfJsAnimation.prototype.addBgColorTransform(
			start: Array.<number>,
			end: Array.<number>,
			opt_time: number=,
			opt_acc: Array.<number>|string|function(number):number|null=
		): !NpfJsAnimation

* `start` — 3D Array for RGB of start color.
* `end` — 3D Array for RGB of end color.
* `opt_time` — Length of animation in milliseconds.
* `opt_acc` — функция акселлерации.


		NpfJsAnimation.prototype.addColorTransform(
			start: Array.<number>,
			end: Array.<number>,
			opt_time: number=,
			opt_acc: Array.<number>|string|function(number):number|null=
		): !NpfJsAnimation

* `start` — 3D Array representing R,G,B.
* `end` — 3D Array representing R,G,B.
* `opt_time` — Length of animation in milliseconds.
* `opt_acc` — функция аселлерации.


		NpfJsAnimation.prototype.addFade(
			start: Array.<number>|number,
			end: Array.<number>|number,
			opt_time: number=,
			opt_acc: Array.<number>|string|function(number):number|null=
		): !NpfJsAnimation

* `start` — 1D Array or Number with start opacity.
* `end` — 1D Array or Number for end opacity.
* `opt_time` — Length of animation in milliseconds.
* `opt_acc` — функция аселлерации.


		NpfJsAnimation.prototype.addFadeIn(
			opt_time: number=,
			opt_acc: Array.<number>|string|function(number):number|null=
		): !NpfJsAnimation

* `opt_time` — Length of animation in milliseconds.
* `opt_acc` — функция аселлерации.


		NpfJsAnimation.prototype.addFadeInAndShow(
			opt_time: number=,
			opt_acc: Array.<number>|string|function(number):number|null=
		): !NpfJsAnimation

* `opt_time` — Length of animation in milliseconds.
* `opt_acc` — функция аселлерации.


		NpfJsAnimation.prototype.addFadeOut(
			opt_time: number=,
			opt_acc: Array.<number>|string|function(number):number|null=
		): !NpfJsAnimation

* `opt_time` — Length of animation in milliseconds.
* `opt_acc` — функция аселлерации.


		!NpfJsAnimation NpfJsAnimation.prototype.addFadeOutAndHide(
			opt_time: number=,
			opt_acc: Array.<number>|string|function(number):number|null=
		)

* `opt_time` — Length of animation in milliseconds.
* `opt_acc` — функция аселлерации.


		NpfJsAnimation.prototype.addResize(
			start: Array.<number>,
			end: Array.<number>,
			opt_time: number=,
			opt_acc: Array.<number>|string|function(number):number|null=
		): !NpfJsAnimation

* `start` — 2D array for start width and height.
* `end` — 2D array for end width and height.
* `opt_time` — Length of animation in milliseconds.
* `opt_acc` — функция аселлерации.


!NpfJsAnimation NpfJsAnimation.prototype.addResizeWidth(
	number start,
	number end,
	number= opt_time,
	Array.<number>|string|function(number):number|null= opt_acc
)

start — Start width.
end — End width.
opt_time — Length of animation in milliseconds.
opt_acc — функция аселлерации.


!NpfJsAnimation NpfJsAnimation.prototype.addResizeHeight(
	number start,
	number end,
	number= opt_time,
	Array.<number>|string|function(number):number|null= opt_acc
)

start — Start height.
end — End height.
opt_time — Length of animation in milliseconds.
opt_acc — функция аселлерации.


!NpfJsAnimation NpfJsAnimation.prototype.addScroll(
	Array.<number> start,
	Array.<number> end,
	number= opt_time,
	Array.<number>|string|function(number):number|null= opt_acc
)

start — 2D array for start scroll left and top.
end — 2D array for end scroll left and top.
opt_time — Length of animation in milliseconds.
opt_acc — функция аселлерации.


!NpfJsAnimation NpfJsAnimation.prototype.addSlide(
	Array.<number> start,
	Array.<number> end,
	number= opt_time,
	Array.<number>|string|function(number):number|null= opt_acc
)

start — 2D array for start coordinates (X, Y).
end — 2D array for end coordinates (X, Y).
opt_time — Length of animation in milliseconds.
opt_acc — функция аселлерации.


!NpfJsAnimation NpfJsAnimation.prototype.addSlideLeft(
	number start,
	number end,
	number= opt_time,
	Array.<number>|string|function(number):number|null= opt_acc
)

start — Start X coordinate.
end — End X coordinate.
opt_time — Length of animation in milliseconds.
opt_acc — функция аселлерации.


!NpfJsAnimation NpfJsAnimation.prototype.addSlideRight(
	number start,
	number end,
	number= opt_time,
	Array.<number>|string|function(number):number|null= opt_acc
)

start — Start X coordinate.
end — End X coordinate.
opt_time — Length of animation in milliseconds.
opt_acc — функция аселлерации.


!NpfJsAnimation NpfJsAnimation.prototype.addSlideTop(
	number start,
	number end,
	number= opt_time,
	Array.<number>|string|function(number):number|null= opt_acc
)

start — Start Y coordinate.
end — End Y coordinate.
opt_time — Length of animation in milliseconds.
opt_acc — функция аселлерации.


!NpfJsAnimation NpfJsAnimation.prototype.addSlideFrom(
	Array.<number> end,
	number= opt_time,
	Array.<number>|string|function(number):number|null= opt_acc
)

end — 2D array for end coordinates (X, Y).
opt_time — Length of animation in milliseconds.
opt_acc — функция аселлерации.


!NpfJsAnimation NpfJsAnimation.prototype.addSlideLeftFrom(
	number end,
	number= opt_time,
	Array.<number>|string|function(number):number|null= opt_acc
)

end — End X coordinate.
opt_time — Length of animation in milliseconds.
opt_acc — функция аселлерации.


!NpfJsAnimation NpfJsAnimation.prototype.addSlideTopFrom(
	number end
	number= opt_time,
	Array.<number>|string|function(number):number|null= opt_acc
)

end — End Y coordinate.
opt_time — Length of animation in milliseconds.
opt_acc — функция аселлерации.


!NpfJsAnimation NpfJsAnimation.prototype.addSwipe(
	Array.<number> start,
	Array.<number> end,
	number= opt_time,
	Array.<number>|string|function(number):number|null= opt_acc
)

start — 2D array for start size (W, H).
end — 2D array for end size (W, H).
opt_time — Length of animation in milliseconds.
opt_acc — функция аселлерации.


!NpfJsAnimation NpfJsAnimation.prototype.addTransform(
	Object start,
	Object end,
	number= opt_time,
	Array.<number>|string|function(number):number|null= opt_acc
)

start — Start transformation.
end — End transformation.
opt_time — Length of animation in milliseconds.
opt_acc — функция аселлерации.

Transform keys and values:

* `matrix: Array.<number>` — 6D Array
* `matrix3d: Array.<number>` — 16D Array
* `translate: number|Array.<number>` — 1D or 2D Array or Number
* `translate3d: Array.<number>` — 3D Array
* `translateX: number`
* `translateY: number`
* `translateZ: number`
* `scale: number|Array.<number>` — 1D or 2D Array or Number
* `scale3d: Array.<number>` — 3D Array
* `scaleX: number`
* `scaleY: number`
* `scaleZ: number`
* `rotate: number`
* `rotate3d: Array.<number>` — 4D Array
* `rotateX: number`
* `rotateY: number`
* `rotateZ: number`
* `skew: number|Array.<number>` — 1D or 2D Array or Number
* `skewX: number`
* `skewY: number`


!NpfJsAnimation NpfJsAnimation.prototype.addCustom(
	function(number) update,
	number= opt_time,
	Array.<number>|string|function(number):number|null= opt_acc
)

update — функция, выполняемая на каждый шаг анимации. Аргумент — число от 0 до 1.
opt_time — Length of animation in milliseconds.
opt_acc — функция аселлерации.


?function(number,number,Element) NpfJsAnimation.prototype.onBegin

Функция, вызываемая в начале анимации.

Первый аргумент — число от 0 до 1 — прогресс анимации.
Второй аргумент — длительность анимации.
Третий аргумент — элемент, который анимируется.


?function(number,number,Element) NpfJsAnimation.prototype.onEnd

Функция, вызываемая в конце анимации.

Первый аргумент — число от 0 до 1 — прогресс анимации.
Второй аргумент — длительность анимации.
Третий аргумент — элемент, который анимируется.


?function(number,number,Element) NpfJsAnimation.prototype.onFinish

Функция, вызываемая, когда анимация выполнилась полностью.

Первый аргумент — число от 0 до 1 — прогресс анимации.
Второй аргумент — длительность анимации.
Третий аргумент — элемент, который анимируется.


?function(number,number,Element) NpfJsAnimation.prototype.onPause

Функция, вызываемая при паузе анимации.

Первый аргумент — число от 0 до 1 — прогресс анимации.
Второй аргумент — длительность анимации.
Третий аргумент — элемент, который анимируется.


?function(number,number,Element) NpfJsAnimation.prototype.onPlay

Функция, вызываемая при проигрывании анимации (начали анимацию или возобновили ее).

Первый аргумент — число от 0 до 1 — прогресс анимации.
Второй аргумент — длительность анимации.
Третий аргумент — элемент, который анимируется.


?function(number,number,Element) NpfJsAnimation.prototype.onResume

Функция, вызываемая при возобновлении анимации.

Первый аргумент — число от 0 до 1 — прогресс анимации.
Второй аргумент — длительность анимации.
Третий аргумент — элемент, который анимируется.


?function(number,number,Element) NpfJsAnimation.prototype.onStop

Функция, вызываемая при остановке анимации.

Первый аргумент — число от 0 до 1 — прогресс анимации.
Второй аргумент — длительность анимации.
Третий аргумент — элемент, который анимируется.


?function(number,number,Element) NpfJsAnimation.prototype.onProgress

Функция, вызываемая на каждом шаге анимации.

Первый аргумент — число от 0 до 1 — прогресс анимации.
Второй аргумент — длительность анимации.
Третий аргумент — элемент, который анимируется.


## `NpfCssAnimation` — класс анимации с помощью CSS


### Конструктор

`NpfCssAnimation(element: Element, time: number, opt_acc: Array.<number>|string=)`

element — элемент, который будет анимироваться.
time — длительность анимации в мс.
opt_acc — функция акселлерации. Если не задана, то линейная анимация. Если массив, то направляющие точки кривой Безье (4 числа).


!NpfCssAnimation NpfCssAnimation.prototype.play(boolean= opt_restart)

Запускает анимацию.

opt_restart — начать анимацию с начала.


!NpfCssAnimation NpfCssAnimation.prototype.pause()

Ставит анимацию на паузу.


!NpfCssAnimation NpfCssAnimation.prototype.stop(boolean= opt_gotoEnd)

Останавливает анимацию.

opt_gotoEnd — перейти на последний шаг анимации.


NpfCssAnimation.prototype.dispose()

Деструктор.


number NpfCssAnimation.prototype.getIterationCount()

Возвращает количество итераций анимации.


!NpfCssAnimation NpfCssAnimation.prototype.setIterationCount(number count)

Задает количество итераций анимации.


number NpfCssAnimation.prototype.getDuration()

Возвращает длительность анимации в мс.


number NpfCssAnimation.prototype.getDelay()

Возвращает задержку анимации в мс.


!NpfCssAnimation NpfCssAnimation.prototype.setDelay(number delay)

Задает задержку анимации в мс.


string NpfCssAnimation.prototype.getDirection()

Возвращает направление анимации: normal или alternate.


!NpfCssAnimation NpfCssAnimation.prototype.setDirection(string direction)

Задает направление аниации: normal или alternate.


Array.<number> NpfCssAnimation.prototype.getAccel()

Возвращает функции акселлерации (в кривых Безье).


!NpfCssAnimation NpfCssAnimation.prototype.fromTo(
	Object.<string,string|number> fromRules,
	Object.<string,string|number> toRules,
	string|Array.<number>= opt_fromAcc,
	string|Array.<number>= opt_toAcc
)

Задает стартовые и конечные стили анимации.

fromRules — объект ключ—значение стартовых CSS стилей.
toRules — объект ключ—значение конечных CSS стилей.
opt_fromAcc
opt_toAcc


!NpfCssAnimation NpfCssAnimation.prototype.from(
	Object.<string,string|number> rules,
	string|Array.<number>= opt_acc
)

Задает стартовые стили анимации.

rules — объект ключ—значение CSS стилей.
opt_acc


!NpfCssAnimation NpfCssAnimation.prototype.to(
	Object.<string,string|number> rules,
	string|Array.<number>= opt_acc
)

Задает конечные стили анимации.

rules — объект ключ—значение CSS стилей.
opt_acc


!NpfCssAnimation NpfCssAnimation.prototype.insertKeyframe(
	Object.<string,string|number> rules,
	number position from,
	string|Array.<number>= opt_acc
)

Задает конечные стили анимации.

rules — объект ключ—значение CSS стилей.
position — from 0 to 100.
opt_acc


!NpfCssAnimation NpfCssAnimation.prototype.fromToTransform(
	string fromTransform,
	string toTransform,
	string|Array.<number>= opt_fromAcc,
	string|Array.<number>= opt_toAcc
)

Задает CSS стиль трансформации объекта в начале и в конце анимации.

fromTransform — стартовое значение стиля трансформации.
toTransform — конечное значение стиля трансформации.
opt_fromAcc
opt_toAcc


!NpfCssAnimation NpfCssAnimation.prototype.fromTransform(string transform, string|Array.<number>= opt_acc)

Задает стартовый CSS стиль трансформации.

transform — значение стиля трансформации.
opt_acc — функция акселлерации.


!NpfCssAnimation NpfCssAnimation.prototype.toTransform(string transform, string|Array.<number>= opt_acc)

Задает конечный CSS стиль трансформации.

transform — значение стиля трансформации.
opt_acc — функция акселлерации.


!NpfCssAnimation NpfCssAnimation.prototype.setTransform(string transform, number position, string|Array.<number>= opt_acc)

Задает CSS стиль трансформации.

transform — значение стиля трансформации.
position — позиция анимации (от 0 до 100).
opt_acc — функция акселлерации.


!NpfCssAnimation NpfCssAnimation.prototype.setTransformOrigin(string|Array.<number|string> origin)

origin — значения стиля transform-origin


?function(number,Element) NpfCssAnimation.prototype.onBegin

Функция, вызываемая в начале анимации.

Первый аргумент — длительность анимации.
Второй аргумент — элемент, который анимируется.


?function(number,Element) NpfCssAnimation.prototype.onEnd

Функция, вызываемая в конце анимации.

Первый аргумент — длительность анимации.
Второй аргумент — элемент, который анимируется.


?function(number,Element) NpfCssAnimation.prototype.onFinish

Функция, вызываемая, когда анимация выполнилась полностью.

Первый аргумент — длительность анимации.
Второй аргумент — элемент, который анимируется.


?function(number,Element) NpfCssAnimation.prototype.onPause

Функция, вызываемая при паузе анимации.

Первый аргумент — длительность анимации.
Второй аргумент — элемент, который анимируется.


?function(number,Element) NpfCssAnimation.prototype.onPlay

Функция, вызываемая при проигрывании анимации (начали анимацию или возобновили ее).

Первый аргумент — длительность анимации.
Второй аргумент — элемент, который анимируется.


?function(number,Element) NpfCssAnimation.prototype.onResume

Функция, вызываемая при возобновлении анимации.

Первый аргумент — длительность анимации.
Второй аргумент — элемент, который анимируется.


?function(number,Element) NpfCssAnimation.prototype.onStop

Функция, вызываемая при остановке анимации.

Первый аргумент — длительность анимации.
Второй аргумент — элемент, который анимируется.


?function(number,Element) NpfCssAnimation.prototype.onIterate

Функция, вызываемая в начале новой итерации.

Первый аргумент — длительность анимации.
Второй аргумент — элемент, который анимируется.
