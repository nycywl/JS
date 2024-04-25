//html dom 操作
//window.alert("")
//document

//callback 回呼 function
window.addEventListener('load', function(params) {
    const p1 = document.getElementById('title')
    p1.innerText = "訂閱我的旅遊頻道"

    const b1 = document.getElementById('btn')
    b1.addEventListener('click', function() {
        console.log('點下去')
    })
    const box1 = document.getElementById('box')
    box1.innerHTML = '<p>Text</p>'

    const in1 = document.getElementById('input1')
    in1.addEventListener('keyup', function (e) {
        console.log('e.target.value', e.target.value)
    })
})