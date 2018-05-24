import * as R from 'ramda';

import sum,{sub, multi, div as dividir, pi}  from './utils.js';
import react from 'react';
import reactDom from 'react-dom';




const arr1 = [1,1,1,2,2,3,4,5,6,6];
const arr2 = [5,6,6,6,7,7,8,9,10,1];

const arr3 = R.union(arr1,arr2);

const arr4 = R.uniq(arr1);

console.log(arr3)
console.log(arr4)
console.log(sum(3,5))
console.log(sub(3,2))
console.log(multi(3,5))
console.log(dividir(2,2))
console.log(pi)