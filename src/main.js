// import { Link } from './js/components'
// import './js/prototype'
import observe from './js/observe'
// import './styles/common.css'


let data = {
  obj: {
    a: 1,
    b: 2
  },
  arr: [
    0, 1
  ]
}
observe(data)
data.obj.a = 2
data.arr.push(2)
console.log(data)


// document.body.appendChild(Link())

// const fn1 = arr => {

//   const startTime = new Date().getTime()

//   let b = []
//   for (let i = 0; i < a.length; i++) {
//     b.unshift(a[i])
//   }

//   console.log(b)

//   const endTime = new Date().getTime()

//   console.log(`fn1处理数据时间：${endTime - startTime}`)

// }

// const fn2 = arr => {

//   const startTime = new Date().getTime()

//   let tmp = 0
//   let b = []
//   for (let i = 0; i < arr.length / 2; i++) {
//     tmp = arr[i]
//     b[i] = arr[arr.length - i - 1]
//     b[arr.length - i - 1] = tmp
//   }

//   console.log(b)

//   const endTime = new Date().getTime()

//   console.log(`fn2处理数据时间：${endTime - startTime}`)
// }

// let a = []
// for (let i = 0; i < 10000; i++) {
//   a.push(i)
// }
// // console.log(a)

// fn2(a)
// fn1(a)

