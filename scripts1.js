const body=document.getElementById('body')
const btn1=document.getElementsByClassName('btn1')
const h1= document.getElementsByClassName('h1-content')
const h2= document.getElementsByClassName('h2-content')



let flag=true
function handler(){
    if(flag)
    {
        body.style.backgroundColor='black'
        btn1[0].innerHTML="Light Mode"
        btn1[0].style.color='white'
        h1[0].style.color='white'
        h2[0].style.color='white'
        
        
    }
    else{
        body.style.backgroundColor='white'
        btn1[0].innerHTML='Dark Mode'
        btn1[0].style.color='black'
        h1[0].style.color="black"
        h2[0].style.color="black"
        nav.style.color="white"
        
    }
    flag=!flag
    
    
}

