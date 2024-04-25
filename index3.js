//流程控制
// if else
if (100 > 50) {  //(條件)
    //當我們的條件成立要做的事情
    console.log('確實大於50')
} else {
    //當我們的條件沒有成立要做的事情
    console.log('錯誤')
}

if (100 < 50) {
    console.log('確實大於50')
} else {
    console.log('錯誤')
}

//+ - * / 算數運算子
//&& || ! 邏輯運算子
//&& 兩邊都是true結果才是true (and)
//|| 只要有一邊是true結果就是true (or)
//以左邊開始看
//! 把結果反向
let condition1 = true && false
console.log('condition1', condition1);
let condition2 = true && true
console.log('condition2', condition2);
let condition3 = true || false
console.log('condition3', condition3);
let condition4 = !true
console.log('condition4', condition4);
let condition5 = !false
console.log('condition5', condition5);
let condition6 = !(true && false)
console.log('condition6', condition6);
let condition7 = !(true || false)
console.log('condition7', condition7);


//true or false 布林值
let condition = 100 < 50
console.log('condition', condition);
if (condition) {
    console.log('確實大於50')
} else {
    console.log('錯誤')
}

// > < >= <= === !==(不相等)
//=== 判斷左右兩邊是否相等
let scoreA = 60
let scoreB = 88
if (scoreA > scoreB) {
    console.log('A考的分數比較高')
} else {
    console.log('B考的分數比較高')
}

//一個成立後, 後面的就不會再執行了
let score = 50
if (score === 100) {
    console.log('非常好')
} else if (score === 80){
    console.log('厲害')
}else if (score === 60) {
    console.log('再接再厲')
} else {
    console.log('你需要重修')
}

//switch case
let key = 50
switch (key) {
    case 100:
        console.log('非常好')
        break;
    case 80:
        console.log('厲害')
        break;
    case 60:
        console.log('再接再厲')
        break;
    default:
        console.log('你需要重修')
        break;
}