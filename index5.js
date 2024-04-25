//function 函數

//宣告
/*function hello () {
    console.log('你好')
}

function hello1 () {
    console.log('你好1')
}

function hello2 () {
    console.log('你好2')
}

//執行
hello ()
hello1 ()
hello2 ()*/

/*function addMoney () {
    console.log(100 + 200 - 100)
}

//結帳頁面
addMoney ()

//購物車頁面
addMoney ()*/

//有參數的function
//接受傳入2個參數
/*function addMoney (price1, price2, discount) {
    console.log('price1', price1);
    console.log('price2', price2);
    console.log('discount', discount);
    console.log('price1 + price2', price1 + price2 - discount)
}

//結帳頁面
addMoney (2000, 100, 50)

//購物車頁面
addMoney (3000, 200, 100)*/

//有回傳值的 function (return)
/*function addMoney (price1, price2, discount) {
    let result = price1 + price2 - discount
    let massage = '普通會員'

    if (result >= 50000) {
        massage = '尊榮會員'
        return massage
    }

    if (result >= 20000) {
        maeeage = '白金會員'
        return massage
    }

    return massage
}

let msg = addMoney (80000, 10000, 30000)
console.log('msg', msg);*/


/*const card = {
    name: 'YUCHIN NI',
    age: '21',
    addres: 'Taiwan'
}

const card2 = {
    name: 'YUCHIN',
    age: '21',
    addres: 'Taiwan'
}

const card3 = {
    name: 'NI',
    age: '21',
    addres: 'Taiwan'
}*/

//構造函數
function createCard (initName) {
    this.name = initName
}

//new 建立構造
const a1 = new createCard ('YUCHIN NI')
const a2 = new createCard ('YUCHIN')
const a3 = new createCard ('NI')
console.log(a1);
console.log(a2);
console.log(a3);

/*function hello (initName) {}

let hello = function () {}

let hello = () => {}*/