# Valid Parentheses 1

## Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

## An input string is valid if:

## Open brackets must be closed by the same type of brackets.
## Open brackets must be closed in the correct order.
## Every close bracket has a corresponding open bracket of the same type.

~~~js
Example 1:

Input: s = "()"
Output: true
Example 2:

Input: s = "()[]{}"
Output: true
Example 3:

Input: s = "(]"
Output: false
~~~
## Solution
~~~js
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    let p = [];
    if(s.length%2 !=0)
    {
        return false;
    }
    for(let i =0; i<s.length;i++){
        if(s[i] == '(' || s[i] == '{' || s[i] == '['){
            p.push(s[i]);
        }else if(s[i] == ')' || s[i] == '}' || s[i] == ']'){

            switch(s[i]){
                case ')':
                    if(p.pop() != '('){
                        return false;
                    }
                break;
                case ']':
                    if(p.pop() != '['){
                        return false;
                    }
                break;
                case '}':
                    if(p.pop() != '{'){
                        return false;
                    }
                break
            }
        }
    }
    return p.length ===0 ? true:false
};
~~~

# Valid Parentheses 2

## Valid Parentheses Your task is to write a function that takes a string of parentheses, and determines if the order of the parentheses is valid. The function should return true if the string is valid, and false if it's invalid. "()" ")(()))" ")(())(" "(())((()())())" => true => true => false => false

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