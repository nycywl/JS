//類別class
//構造函數
/*function createCard (initName) {
    this.name = initName
}*/

//class的基本操作
/*class Card {
    constructor(initName){
        this.name = initName
    }
}

const c1 = new Card("nyc")
console.log('c1',c1)
console.log(c1.name)*/

//this
/*class Card {
    constructor(initName){
        this.name = initName
        //this綁訂在Card
        //this.hi = this.hello.bind(this)
    }

    hello = () => {
        console.log("你好", this.name)
    }
}

const c1 = new Card("nyc")
console.log('c1',c1)
c1.hello ()

const a = {name:'Ni'}
a.hi = c1.hello

a.hi ()*/

//繼承
class Car {
    constructor(initName) {
        this.name = initName
    }
    start(){
        console.log('車子啟動')
    }  
}

class Tesla extends Car {
    constructor(nameTesla){
        super(nameTesla)
    }

    start2 () {
        super.start()
        console.log('Tesla燈光秀')
    }
    start(){
        super.start()
        console.log('Tesla啟動')
    }
}

const t1 = new Tesla ("迅業黑金剛")
t1.start()
console.log('name:', t1.name)