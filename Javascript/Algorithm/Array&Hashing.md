# Contains Duplicate

## Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.

~~~js
Example 1:

Input: nums = [1,2,3,1]
Output: true

Example 2:

Input: nums = [1,2,3,4]
Output: false

Example 3:

Input: nums = [1,1,1,3,3,4,3,2,4,2]
Output: true
~~~
## Solution
~~~js

var containsDuplicate = function(nums) {
    let mapObj = {};

    for(let i=0;i<nums.length;i++){
        if(mapObj[nums[i]]){
            return true
        }else{
            mapObj[nums[i]] = true;
        }
    }
    return false;

};
~~~

# Valid Anagram

## Given two strings s and t, return true if t is an anagram of s, and false otherwise.

## An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

~~~js
Example 1:

Input: s = "anagram", t = "nagaram"
Output: true
Example 2:

Input: s = "rat", t = "car"
Output: false
~~~
## Solution
~~~js
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {
    
    let firtsString = {};
    let secondString = {};

    if(s.length != t.length){
        return false;
    }

    for(let char of s){
        firtsString[char]? firtsString[char]++: firtsString[char] = 1;
    }

    for(let char of t){
        secondString[char]? secondString[char]++: secondString[char] = 1;
    }

    console.log(firtsString);
    console.log(secondString);

    for(let char in secondString ){
        if(!(secondString[char] == firtsString[char])){
            return false
        }
    }
    return true



};
~~~

# Two Sum

## Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

## You may assume that each input would have exactly one solution, and you may not use the same element twice.

## You can return the answer in any order.

~~~js
Example 1:

Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
Example 2:

Input: nums = [3,2,4], target = 6
Output: [1,2]
Example 3:

Input: nums = [3,3], target = 6
Output: [0,1]
~~~
## Solution
~~~js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
// var twoSum = function(nums, target) {
//     for(let [i,num] of nums.entries()){
//         for(let j = i+1; j< nums.length && j != i; j++){
//             let sum = num + nums[j];
//             if(sum == target){
//                 return [i,j]
//             }
//         }
//     }
// };

var twoSum = function (nums, target) {
   const mp = {}

   for (let i = 0; i < nums.length; i++) {
   	const diff = target - nums[i]// find the difference between the target and the current number
   
   	if (diff in mp) return [i, mp[diff]]// if the difference is in the map, return the current index and the index of the difference

   	mp[nums[i]] = i; // if the difference is not in the map, add the current number to the map with the index as the value
   }
}
~~~

# Two Sum II

## Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number. Let these two numbers be numbers[index1] and numbers[index2] where 1 <= index1 < index2 <= numbers.length.

## Return the indices of the two numbers, index1 and index2, added by one as an integer array [index1, index2] of length 2.

## The tests are generated such that there is exactly one solution. You may not use the same element twice.

## Your solution must use only constant extra space.

~~~js
Example 1:

Input: numbers = [2,7,11,15], target = 9
Output: [1,2]
Explanation: The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].
Example 2:

Input: numbers = [2,3,4], target = 6
Output: [1,3]
Explanation: The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3. We return [1, 3].
Example 3:

Input: numbers = [-1,0], target = -1
Output: [1,2]
Explanation: The sum of -1 and 0 is -1. Therefore index1 = 1, index2 = 2. We return [1, 2].
~~~
## Solution
~~~js
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(numbers, target) {
    
    let mapObj = {};

    for(let i=0;i<numbers.length;i++){
        mapObj[numbers[i]] = i;// create a map with the numbers as keys and the indices as values
    }

    for(let i=0;i<numbers.length;i++){
        let secondNumber = target - numbers[i];// find the difference between the target and the current number
        if(secondNumber in mapObj ){// if the difference is in the map, return the current index and the index of the difference
            return [i+1,mapObj[secondNumber]+1]// add 1 to the indices because the indices are 1-indexed instead of 0-indexed
        }
    }
    return [];

};
~~~


# Check if all characters have equal number of occurrences

Given a string s, return true if s is a good string, or false otherwise.

A string s is good if all the characters that appear in s have the same number of occurrences (i.e., the same frequency).

- Example 1:

  - Input: s = "abacbc"
  - Output: true
  - Explanation: The characters that appear in s are 'a', 'b', and 'c'. All characters occur 2 times in s.
- Example 2:

  - Input: s = "aaabb"
  - Output: false
  - Explanation: The characters that appear in s are 'a' and 'b'.
  - 'a' occurs 3 times while 'b' occurs 2 times, which is not the same number of times.

~~~js
/**
 * @param {string} s
 * @return {boolean}
 */
var areOccurrencesEqual = function(s) {

    let frecuencies = {};

    for(let char of s){
        frecuencies[char] ? frecuencies[char]++:frecuencies[char]=1;
    }

    let commonFrecuency = null;
    for(let char in frecuencies){
        if(commonFrecuency == null){
            commonFrecuency = frecuencies[char];
        }else if(!(commonFrecuency == frecuencies[char])){
            return false;
        }
    }
    return true;
    
};
~~~

# Roman to Integer

## Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.

| Symbol | Value |
| ------ | ----- |
| I      | 1     |
| V      | 5     |
| X      | 10    |
| L      | 50    |
| C      | 100   |
| D      | 500   |
| M      | 1000  |

For example, 2 is written as II in Roman numeral, just two one's added together. 12 is written as XII, which is simply X + II. The number 27 is written as XXVII, which is XX + V + II.

Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not IIII. Instead, the number four is written as IV. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as IX. There are six instances where subtraction is used:

- I can be placed before V (5) and X (10) to make 4 and 9.
- X can be placed before L (50) and C (100) to make 40 and 90.
- C can be placed before D (500) and M (1000) to make 400 and 900.

Given a roman numeral, convert it to an integer.

- Example 1:

  - Input: s = "III"
  - Output: 3
  - Explanation: III = 3.
- Example 2:

  - Input: s = "LVIII"
  - Output: 58
  - Explanation: L = 50, V= 5, III = 3.
- Example 3:

  - Input: s = "MCMXCIV"
  - Output: 1994
  - Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.

~~~js
/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function(s) {

    symbols = {
        "I":1,
        "V":5,
        "X":10,
        "L":50,
        "C":100,
        "D":500,
        "M":1000,
        "IV":4,
        "IX":9,
        "XL":40,
        "XC":90,
        "CD":400,
        "CM":900
    }
    let number = 0;
    for(let i =0;i<s.length;i++){
        if(s[i] + s[i+1] in symbols){
            let specialNumber = s[i] + s[i+1];
            number = number + symbols[specialNumber];
            i++;
        }
        else if(s[i] in symbols){
            number = number + symbols[s[i]];
        }
    }
    return number;
    
};
~~~