const content = document.getElementById('content')
const date = document.getElementById('date')
const time = document.getElementById('time')
const addedBtn = document.getElementById('addedBtn')
const deletedBtn = document.getElementById('deletedBtn')
const list = document.getElementById('list')

const  listContent = []

/*class RenderFeature {
    append () {}
    render(){
        // 渲染頁面的list
        let htmlStr = ''

        listContent.forEach(function (item) {
            htmiStr = htmlStr + `
            <div class="item">
                <div>
                    <p>內容：</p>
                    <p>時間：</p>
                </div>
            </div>
            `
        })
        list.innerHTML = htmlStr
    }
}*/

//function 
function render(){
    // 渲染頁面的list
    let htmlStr = ''

    listContent.forEach(function (item) {
        htmiStr = htmlStr + `
        <div class="item">
            <div>
                <p>內容：</p>
                <p>時間：</p>
            </div>
        </div>
        `
    })
    list.innerHTML = htmlStr
}
//const r1 = new RenderFeature()

addedBtn.addEventListener('click', function() {
    

    listContent.unshift({   //push從後面新增 unshift從前面新增
        content: content.value,
        date: date.value,
        time: time.value
    })
    //r1.render()
    render()
})
    

deletedBtn.addEventListener('click', function () {
    listContent.shift() //pop從後面刪除 shift從前面刪除

   // r1.render()
   render()
})