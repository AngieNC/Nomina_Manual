
const enviar = async()=>{

    let config = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            valor: "10000",
            tipo: "egreso"
        })
    }
    let res =await (await fetch("http://127.0.0.1:5010/nomina", config)).json()
    console.log(res)
}

enviar();