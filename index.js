// Se declaran las constantes para trabajar con los formularios y la base de datos
const formulario = document.querySelector("#formAdd");
const formu = document.querySelector("#formEdit");
const dialog = document.querySelector ("dialog");
const url = "http://127.0.0.1:5010/nomina";
const ingreso = document.querySelector("#ingreso");
const egresos = document.querySelector("#egresos");
const total = document.querySelector("#total");
let totel = {egreso:0, ingreso:0};

//Para que funcione el metodo eliminar

const principalEliminar = async(id)=>{
    let config = {
        method: "DELETE",
        headers: {"content-type":"application/json"}
    };
    let res = await (await fetch(url + "/" + id, config)).json();
    location.reload(); //Para que cargue ahí mismo
};


// Para que sirva el boton cancelar
const cancelar = document.querySelector("#cerrar");

cancelar.addEventListener("click", async()=>{
    dialog.close()
})


// Para que funcione el metodo editar
const principalEditar = async(id)=>{  //El asincronico hace que cargue primero todo el archivo y despues lo muestra
    
    formu.addEventListener('submit', async(e)=>{ 
        e.preventDefault();
        let dato = Object.fromEntries(new FormData(e.target));

        let config = {
            method: "PUT",
            headers: {"content-type":"application/json"},
            body: JSON.stringify(dato)
        };
        let res = await fetch(url + "/" + id, config);

        
        location.reload();
    });
    
};

// Todo esto es el evento que se desarrolla después de presionar 'ENVIAR'

formulario.addEventListener("submit", async(e)=>{
    e.preventDefault();
    
    let dato = Object.fromEntries(new FormData(e.target )); //Crea un array para guardar los datos y el target hace que la información se quede en la misma pestaña
    
    const peticion = await (await fetch(url)).json();

    let config = {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(dato)
    }

    const enviar = await (await fetch(url, config)).json();
    location.reload();
});

// Descarga todo el contenido como el HTML o los estilos 

document.addEventListener("DOMContentLoaded", async(e)=>{
    const tabla = document.querySelector('#data-tabla');
    let res = await (await fetch(url)).json();
    totel = {egreso:0, ingreso:0};
    for (let i = 0; i < res.length; i++) {
        if(res[i].tipo=="ingreso") 
            totel.ingreso = parseInt(totel.ingreso) + parseInt(res[i].valor);
        else
            totel.egreso = parseInt(totel.egreso) + parseInt(res[i].valor);
        tabla.insertAdjacentHTML("beforeend", `
        <tr>
            <td>${res[i].id}</td>
            <td>${res[i].valor}</td>
            <td>${res[i].tipo}</td>
            <td>
                <button id="${res[i].id}" class="edit">Editar</button>
                <button id="${res[i].id}" class="delet">Eliminar</button>
            </td>
         </tr>
        `);

    }
    ingreso.innerHTML = `$ ${totel.ingreso}`;
    egresos.innerHTML = `$ ${totel.egreso}`;
    total.innerHTML = `$ ${totel.ingreso-totel.egreso}`;

    //Declarar variables eliminar y editar
    const eliminar = document.querySelectorAll('.delet');
    const editar = document.querySelectorAll('.edit');
    
    //Evento eliminar
    eliminar.forEach((elemento) =>{
        elemento.addEventListener("click",()=>{
            principalEliminar(elemento.id);
        });
    });

    //Evento editar

    editar.forEach((elemento)=>{
        elemento.addEventListener("click",()=>{
            dialog.showModal(); 
            principalEditar(elemento.id);
        });
    });

});

