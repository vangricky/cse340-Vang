async function fun(res, rej) {
    // rej()
    throw(error)
}

fun() 
    .then((res) => {

    })
    .then((res) => {

    })
    .catch((err) => {
        console.log(err.name, err.message)
    })

    // Use async when you use I/O problems