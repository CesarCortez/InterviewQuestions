# Frontend Questions


### Table of Contents - HTML and CSS

| No. | Questions |
| --- | --------- |
|   | **CSS AND HTML** |
| 1 | [Center an element](#1)|
| 2 | [Difference between relative, absolute and fixed position](#2)|
| 3 | [Difference between display: none and visibility: hidden](#3)|
| 4 | [Differentiate between div and span](#4)|

## 1. Center an element

### given the following code, how to center the div?<a id="1"></a>

~~~html
<div class="container">
     <div class="item">I need to be centered.</div>
</div>
~~~

~~~css
.item {
  margin: auto;
  text-align: center;
}   
~~~

## Position an element

## 2. Difference between relative, absolute and fixed position<a id="2"></a>

- <b>relative</b> is relative to its normal position.
- <b>absolute</b> is relative to its first positioned ancestor.
- <b>fixed</b> is relative to the viewport.

### given the following code, how would the output would look like ?

~~~html
  <div class="container">
      <div id="item1">Item one</div>
      <div id="item2">Item two</div>
      <div id="item3">Item three</div>
  </div>
~~~

~~~css
.container {
   display: flex;
}
#item2 {
   position: relative; 
   top: 10px;
}
~~~

![Texto alternativo](./images/relativePosition.png)

## 3. Difference between display: none and visibility: hidden<a id="3"></a>

- <b>display: none</b> removes the element from the normal document flow and the element will not take up any space.
- <b>visibility: hidden</b> hides the element but it will still take up the same space as before.

## 4. Difference between div and span<a id="4"></a>

| DIV | SPAN |
| -------------------------------------------------- | -------------------------------------------------- |
| Block level element | Incline level element |
| Used to wrap sections of a document | Use to wrap portions of text, images |
| Used while creating CSS based layouts in html | Used to stylize text |
