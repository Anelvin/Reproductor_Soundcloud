//Atributos
const listado = $('#listado');
const input = $('input');
const caratula = $('#caratula');
const intSoundCloud= ()=>SC.initialize({
    client_id: 'aa06b0630e34d6055f9c6f8beb8e02eb'
});
let player={};
const self= this;
var nombre='';
var numeroCanciones=[];
var resultado='';
let lista_canciones = [];
let cancion = {};

let HelperLista = (url_img, id,titulo,me_gusta)=>{
    listado.append(`<div class="imagen_min col-11"><img id=${id} src=${url_img} draggable="true" ondragstart="drag(event)"><div><h5>${titulo}</h5><p>${me_gusta}👍</p></div></div>`);
};


let HelperCaratula= (url_img)=>{
    caratula.empty();
    caratula.append("<img src='"+url_img+"'>")
};

let Busqueda= async ()=> {
    
    listado.empty();
    let autor = input.val();
    console.log(self.SoundCloud);

   try{
    resultado = await SC.get('/tracks',{q:autor})

    numeroCanciones = resultado.length;
    for(let i= 0; i<numeroCanciones; i++){
        console.log(resultado[i]);
        (resultado[i].artwork_url !==null)? HelperLista(resultado[i].artwork_url, resultado[i].id,resultado[i].title,resultado[i].likes_count): null; 
    }
  
   }catch (error){
       console.error(error);
   }
}

let drag= (ev)=>{
    ev.dataTransfer.setData("text", ev.target.id);
    ev.dataTransfer.setData("image", ev.target.src);  

    for(let x=0;x<numeroCanciones;x++){
        if(resultado[x].id==ev.target.id){
            nombre=resultado[x].title;
        }
    }
}

let allowDrop = (ev)=>{
    ev.preventDefault();
}

let drop=(ev)=>{
    ev.preventDefault();
    let id = ev.dataTransfer.getData("text");
    let src= ev.dataTransfer.getData("image");
    cancion.id = id;
    cancion.src= src;
    console.log("canción ->"+JSON.stringify(cancion));
    document.getElementById('titulo').innerHTML=nombre;
    HelperCaratula(src);
    reproducir(id);
}

let reproducir = async (id)=>{
    
    try{
        player = await SC.stream('/tracks/'+id);
        console.log(player);
        player.play(); 
      
    }catch (error){
        console.error(error);
    }
}
let pause=()=>{
    boton=document.getElementById('play');
    if(boton.innerHTML=="Pause"){
        player.pause();
        boton.innerHTML='Play';
    }
    else{
        player.play();
        boton.innerHTML='Pause';
    }
}

let factory_cancion = (track)=>{
    let cancion = {};
    cancion.id = track.id;
    cancion.title = track.title;
    cancion.url = track.artwork_url;
   return cancion;
}

$('document').ready(function (){
    intSoundCloud();
})
let agregar=(track)=>{

    console.log(cancion);
    lista_canciones.push(cancion);
    let totalItems=localStorage.length;
    localStorage.setItem(lista_canciones.length, JSON.stringify(lista_canciones));
    alert('Canción agregada a favoritos');
    var clave="";
    var lista=document.getElementById('recientes');
    var elemento;
    var texto;
        clave=input.val();
        elemento=document.createElement('li');
        texto=document.createTextNode(clave);
        elemento.appendChild(texto);
        lista.appendChild(elemento);
        if(lista.childNodes.length>=10){
            lista.removeChild(lista.childNodes[0]);
        }
}

let busquedaRecientes=()=>{
    var clave="";
    var lista=document.getElementById('recientes');
    var elemento;
    var texto;
    for(let x=0;x<localStorage.length;x++){
        clave=localStorage.getItem(x);
        elemento=document.createElement('li');
        texto=document.createTextNode(clave);
        elemento.appendChild(texto);
        lista.appendChild(elemento);
    }
}
