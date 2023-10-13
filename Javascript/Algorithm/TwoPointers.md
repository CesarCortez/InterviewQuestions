# Valid Palindrome

## A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

## Given a string s, return true if it is a palindrome, or false otherwise.

~~~js
xample 1:

Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.
Example 2:

Input: s = "race a car"
Output: false
Explanation: "raceacar" is not a palindrome.
Example 3:

Input: s = " "
Output: true
Explanation: s is an empty string "" after removing non-alphanumeric characters.
Since an empty string reads the same forward and backward, it is a palindrome.
~~~

## Solution

~~~js
/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    
    s=  s.toLowerCase().replace(/[^a-z0-9]/gi,'');
    console.log(s);
    let p2=s.length-1;
    for(let i=0;i<s.length;i++,p2--){
        if(!(s[i] == s[p2])){
            return false;
        }
    }
    return true;
};
~~~

# Best time to buy and sell stock

## You are given an array prices where prices[i] is the price of a given stock on the ith day.

## You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

## Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.

~~~js
Example 1:

Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation:
Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.

Example 2:

Input: prices = [7,6,4,3,1]
Output: 0
Explanation: In this case, no transactions are done and the max profit = 0.
~~~

~~~js

/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {

    let lPointer = 0;
    let rPointer = 1;
    let profit = 0;

    while(rPointer <= prices.length){
        if(prices[lPointer] < prices[rPointer] ){
            profit =  Math.max(profit,prices[rPointer] - prices[lPointer]);
        }else{
            lPointer= rPointer;
        }
        rPointer++;
    }
    return profit;
    
};

~~~

# Longest Substring without repeating characters

## Given a string s, find the length of the longest substring without repeating characters.

~~~js
Example 1:

Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.

Example 2:

Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.

Example 3:

Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.

~~~

## Solution

~~~js

/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(str) {
  let longest = 0;
  let seen = {};
  let start = 0;
 
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if (seen[char]) {
      start = Math.max(start, seen[char]);
    }
    // index - beginning of substring + 1 (to include current in count)
    longest = Math.max(longest, i - start + 1);
    // store the index of the next char so as to not double count
    seen[char] = i + 1;
  }
  return longest;
};
~~~