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