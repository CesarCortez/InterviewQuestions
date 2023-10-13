## Task 1 - Magic Latin Your task is move the first letter of each word to the end of it, then add "ay" to the end of the word. Leave punctuation marks untouched. magicLatin('Magic latin is cool'); // agicMay atinlay siay oolcay magicLatin('Hello world !'); // elloHay orldWay !

~~~js
const magicLatin = str => {
    let arr = str.split(" ")
    let result = [];
    for(char of arr) {
        if(/[a-zA-Z]/.test(char)) {
           char = char.substr(1, char.length) + char[0] + "ay"
        }
        result.push(char)
    }
    return result.join(" ")
}

console.log(magicLatin('Hello world !')); 
~~~

## Task 2 - Valid Parentheses Your task is to write a function that takes a string of parentheses, and determines if the order of the parentheses is valid. The function should return true if the string is valid, and false if it's invalid. "()" ")(()))" ")(())(" "(())((()())())" => true => true => false => false

~~~js
const validParentheses = str => {
    let arr = [];
    for(let i = 0; i < str.length; i++) {
        if(str[i] === "(") {
            arr.push(")")
        } else {
          if(str[i] !== arr.pop()) return false
        }
    }
    return arr.length === 0
}

console.log(validParentheses(")(())("));
console.log(validParentheses("(())((()())())"));
console.log(validParentheses("(())((()())())"));
console.log(validParentheses(")(()))"));
console.log(validParentheses("()"));

~~~

## Task 4 - Next bigger number You have to create a function that takes a positive integer number and returns the next bigger number formed by the same digits: nextBigger(12) == 21 nextBigger(513) == 531 nextBigger(2017) == 2071 nextBigger(111) == -1 nextBigger(531) == -1

~~~js
const nextBigger = n => {
   let firstNum = Math.floor(n % 100 / 10);
   let lastNum = n % 10;
   let restNum = n - n % 100
   if(firstNum > lastNum) {
        return -1
   } 
   else if(firstNum < lastNum) {
        return restNum + lastNum * 10 + firstNum
   }
   else {
       return -1
   }
}

console.log(nextBigger(12)); // 21
console.log(nextBigger(513)); // 531
console.log(nextBigger(2017)); // 2071
console.log(nextBigger(111)); // -1
console.log(nextBigger(531)); // -1
~~~

