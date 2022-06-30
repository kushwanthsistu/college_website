const menubutton = document.getElementById('navigationbutton') ;
let menutoggle = false ;
const menubar = document.getElementById('navigationbar') ;

menubutton.addEventListener('click' ,() => {
    if(!menutoggle) {
    menubar.style.display = "block" ;
    menutoggle = true ;
    }
    else {
    menubar.style.display = "none" ;
    menutoggle = false ;
    }
})

let pallettout = false ;
sidepallettelements = document.getElementById('sidepallettelements') ;

let officialsbutton = document.getElementById('hostelofficials') ;
officialsbutton.addEventListener('click', () => {
    if(!pallettout) {
        sidepallettelements.className = "bg-primary d-flex flex-column" ;
        pallettout = true ;
    }
    else {
        sidepallettelements.className = "d-none" ;
        pallettout = false ;
    }
})