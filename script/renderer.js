document.getElementById('add').addEventListener('click', function () {
    window.location.replace('nuovolibro.html')
})

document.getElementById('search').addEventListener('click', function () {
    window.location.replace('cercalibro.html')

})

document.getElementById('close').addEventListener("click", function (){
    window.close()
})
window.setMenu(null);