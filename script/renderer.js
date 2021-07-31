document.getElementById('add').addEventListener('click', function () {
    window.open('nuovolibro.html', '_blank', 'frame=false')
})

document.getElementById('search').addEventListener('click', function () {
    window.open('cercalibro.html', '_blanck', 'frame=false')

})

document.getElementById('close').addEventListener("click", function (){
    window.close()
})
window.setMenu(null);