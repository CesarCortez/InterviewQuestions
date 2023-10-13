# Binary Search

## Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.

## You must write an algorithm with O(log n) runtime complexity.

```js
Example 1:

Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4
Example 2:

Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 does not exist in nums so return -1
```

## Solution

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
  let rPointer = nums.length - 1;
  let lPointer = 0;
  let res = Math.floor((nums.length - 1) / 2);
  while (lPointer <= rPointer) {
    if (nums[res] == target) return res;

    if (nums[res] > target) {
      rPointer = res - 1;
    } else if (nums[res] < target) {
      lPointer = res + 1;
    } else {
      return res;
    }
    res = Math.floor((rPointer + lPointer) / 2);
  }
  return -1;
};
```

# Search 2D Matrix

## You are given an m x n integer matrix matrix with the following two properties:

## Each row is sorted in non-decreasing order.

## The first integer of each row is greater than the last integer of the previous row.

## Given an integer target, return true if target is in matrix or false otherwise.

## You must write a solution in O(log(m \* n)) time complexity.

~~~js
[
  [1, 3, 5, 7],
  [10, 11, 16, 20],
  [23, 30, 34, 60],
];
Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
Output: true

[
  [1, 3, 5, 7],
  [10, 11, 16, 20],
  [23, 30, 34, 60],
];
Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
Output: false
~~~
## Solution
~~~js
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function(matrix, target) {
    let m = matrix[0].length; // column length
    let n = matrix.length; // row length
    
    let i = 0; // first row
    let j = m-1; // last column
    
    // till i < n (row o to n) AND j >= 0 (col m to 0)
    while(i<n && j>=0){ 
        if(matrix[i][j] == target){
            return true;
        }
        if(matrix[i][j] > target){
            // we'll be moving towards left if the value of target is smaller 
            j--;
        }else{
            // otherwise we'll be moving downwards if the target is greater than
            i++;
        }
    }
    return false;
}
~~~

# Koko Eating Bananas

## Koko loves to eat bananas. There are n piles of bananas, the ith pile has piles[i] bananas. The guards have gone and will come back in h hours.

## Koko can decide her bananas-per-hour eating speed of k. Each hour, she chooses some pile of bananas and eats k bananas from that pile. If the pile has less than k bananas, she eats all of them instead and will not eat any more bananas during this hour.

## Koko likes to eat slowly but still wants to finish eating all the bananas before the guards return.

## Return the minimum integer k such that she can eat all the bananas within h hours.

~~~js
Example 1:

Input: piles = [3,6,7,11], h = 8
Output: 4
Example 2:

Input: piles = [30,11,23,4,20], h = 5
Output: 30
Example 3:

Input: piles = [30,11,23,4,20], h = 6
Output: 23
~~~

## Solution

~~~js
/**
 * @param {number[]} piles
 * @param {number} h
 * @return {number}
 */
function minEatingSpeed(piles, h) {
    let left = 1; // minimum 1 banana should be eaten per hour, otherwise no progress
    let right = Math.max(...piles); // at max, max(piles) bananas are required to be eaten per hour
    let mid = Math.floor((left + right) / 2); // mid will be the speed of eating
    let k = Infinity;

    // Binary Search
    while(left <= right) {
        let sum = 0; // sum is the total time required to finish all bananas at speed of mid

        for(let i = 0; i < piles.length; i++) {
            sum = sum + Math.ceil(piles[i] / mid);

        }

        if(sum <= h) {
            k = Math.min(k, mid);
            right = mid - 1;
            mid = Math.floor((left + right) / 2);
        } else {
            left = mid + 1;
            mid = Math.floor((left + right) / 2);
        }
    }

    return k;
};
~~~