//陣列 Array
let classA = ['a', 'b', 'c'] //A班有abc三人
console.log('A班有', classA, '三人')
classA.push('d', 'e', 'f')//def三人轉入後A班共有abcdef五人
console.log('def三人轉入後A班共有', classA, '六人')
console.log(classA.length)

let igPhoto = [
    'https://picsum.photos/600/400?random=3',
    'https://picsum.photos/600/400?random=4',
    'https://picsum.photos/600/400?random=5'
]

console.log('第1筆', igPhoto[0])
console.log('第2筆', igPhoto[1])
console.log('第3筆', igPhoto[2])

//物件 Object
const card = {
    name: 'YUCHIN NI',
    age: '21',
    addres: 'Taiwan'
}

console.log('名字', card.name) // . 的  card的name

const post = {
    image: 'https://picsum.photos/600/400?random=1',
    desc: '這是一張圖片',
    date: '2024/04/20',
    comment: ['讚', '棒', '完美']
}

const post2 = {
    image: 'https://picsum.photos/600/400?random=2',
    desc: '這是一張圖片',
    date: '2024/04/21',
    comment: ['讚', '棒', '完美']
}

const wall = [
    post,
    post2
]

console.log('wall', wall)