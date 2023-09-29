// Se declaran las constantes para trabajar con los formularios y la base de datos
const formulario = document.querySelector("#formAdd");
const formu = document.querySelector("#formEdit");
const dialog = document.querySelector ("dialog");
const url = "http://127.0.0.1:5010/nomina";


//Para que funcione el metodo eliminar

const principalEliminar = async(id)=>{
    let config = {
        method: "DELETE",
        headers: {"content-type":"application/json"}
    };
    let res = await (await fetch(url + "/" + id, config)).json();
    location.reload(); //Para que cargue ahí mismo
};

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

        dialog.close();
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
    
    //Crea un nuevo array y manipula el array que recorre.
    res.map((elemento)=>{
        tabla.insertAdjacentHTML("beforeend", `
        <tr>
            <td>${elemento.id}</td>
            <td>${elemento.valor}</td>
            <td>${elemento.tipo}</td>
            <td>
                <button id="${elemento.id}" class="edit">Editar</button>
                <button id="${elemento.id}" class="delet">Eliminar</button>
            </td>
        </tr>
        `);
    });

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