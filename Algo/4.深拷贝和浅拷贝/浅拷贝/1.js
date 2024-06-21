let target = {};
let obj = {
  a: {
    b: 3,
  },
};
Object.assign(target, obj);
console.log(target); // { a: { b: 3 } }

obj.a.b = 1;

console.log(obj); // { a: { b: 1 } }
console.log(target); // { a: { b: 1 } }
