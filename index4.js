//迴圈控制

//for
//i++ 就是 i = i + 1
//i+=2 就是 i = i + 2 從右邊開始看 i + 2 打幫丟到左邊的容器裡
/*for (let i = 5; i < 10; i+=2) {
    console.log('i:', i)
}*/

//A班3個人
/*let classA = [100, 80, 60]
classA.push(40)
for(let i = 0; i < classA.length; i++) {
    console.log('i:', classA[i])
}*/

/*let classA = [100, 80, 60]
classA.push(40)
console.log('classA', classA)
for(let i = 0; i < classA.length; i++) {
    if (i === 2) {  //第二個位置變成999
        classA[i] = 999
    }
}

console.log('classA', classA)*/

//for讀取物件
/*const a1 = {
        name: 'YUCHIN NI',
        image: 'https://picsum.photos/600/400?random=1',
        desc: '貼文一',
        date: '2024/04/20'
    }
console.log(a1.name)
const posts = [
    {
        name: 'YUCHIN NI',
        image: 'https://picsum.photos/600/400?random=1',
        desc: '貼文一',
        date: '2024/04/20'
    },
    {
        name: 'YUCHIN NI',
        image: 'https://picsum.photos/600/400?random=2',
        desc: '貼文二',
        date: '2024/04/21'
    }
]

for(let i = 0; i < posts.length; i++) {
    if (i === 0) {
        let post = posts[i]
        console.log(post)
    }
}*/



//while迴圈
let condition = true
let target = 10
let i = 0

while (condition) {
    if (i === target) {
        condition = false
    }
    console.log(i)
    i++
}