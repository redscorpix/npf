# npfSvg

## Объект `npfSvg.Ns`

* `SVG` — http://www.w3.org/2000/svg
* `XLINK` — http://www.w3.org/1999/xlink
* `EV` — http://www.w3.org/2001/xml-events
* `XML` — http://www.w3.org/XML/1998/namespace


## Создание SVG-элемента

`npfSvg.createElement(tagName: string, opt_attrs: string|Object.<string,string>=): !Element`

Создает и возвращает элемент с namespace SVG.

* `tagName` — тэг.
* `opt_attrs` — аттрибуты элемента. Если строка, то имя класса.


## Парсинг строки и создание SVG-элемента

`npfSvg.parseFromString(data: string): Element`

Парсит строку и возвращает svg-элемент.

* `data` — строка, которая описывает svg-элемент.


## Атрибут элемента

`npfSvg.getAttr(element: Element, name: string): string?`

Возвращает атрибут элемента.


## Задание атрибута

`npfSvg.setAttr(element: Element, name: string|Object.<string,string|number>, opt_value: number|string=)`

Задает атрибут(ы) элементу.

* `element` — элемент, которому задаются атрибуты
* `name` — если объект, то пары название-значение, если строка, то название атрибута.
* `opt_value` — если name — строка, то значение атрибута.


## Удаление атрибута

`npfSvg.removeAttr(element: Element, name: string)`

Удаляет атрибут у элемента.
