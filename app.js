//Importar libreria express que permite crear un backend
const { request, response } = require("express");
const express = require("express");


//importar libreria mysql que me permite conectarme y hacer consultas a las base de datos
const mysql = require('mysql');

// Se crea constante del puerto
const port = process.env.PORT || 3000;

//Crea la conexion a la base de datos y la guarda en una constante
const connection = mysql.createConnection({
    host     : 'mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com',
    port     : '3306',
    user     : 'bsale_test',
    password : 'bsale_test',
    database : 'bsale_test'
  });

//Se conecta a la base de datos
connection.connect((error)=>{
    if(error){
        console.log('Error', error);
    } else {
        console.log('Conexion creada');
    }
    
});
//Inicializar nuestra aplicacion backend
const app = express();


app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, 	X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-	Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, 	DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});


//Inicializar nuestro administrador de rutas
const router = express.Router();

//Obtener listado de categorias
router.get("/categorias", (request, response)=>{

    const consulta =" Select * from category";

    connection.query(consulta, (error, results) => {
        if (error) {

            response.status(400).json({
                ok: false,
                error: 'Se ha producido un error'
            });
            return
        };
        
        response.status(200).json({
            ok: true,
            categorias: results
        })
      });
});

//Obtener listado de productos
router.get("/productos", (request, response)=>{

    const consulta =" Select * from product";

    connection.query(consulta, (error, results) => {
        if (error) {

            response.status(400).json({
                ok: false,
                error: 'Se ha producido un error'
            });
            return
        };
        
        response.status(200).json({
            ok: true,
            productos: results
        })
      });
});

//Obtener listado de productos segun Id de categoria

router.get("/productosPorIdCategoria", (request, response)=>{

    const idCategoria = request.query.idCategoria;

    const consulta = `select * from product where category = ${idCategoria}`;

    connection.query(consulta, (error, results)=>{
        if (error) {

            response.status(400).json({
                ok: false,
                error: 'Se ha producido un error'
            });
            return
        };
        
        response.status(200).json({
            ok: true,
            productos: results
        });
    });

});

//Obtener listdo de productos segun el nombre

router.get("/productosPorNombre",(request,response)=>{

    const nombre = request.query.nombre;

    const consulta = `select * from product where name like "%${nombre}%";`;

    connection.query(consulta, (error, results)=>{
        if (error) {

            response.status(400).json({
                ok: false,
                error: 'Se ha producido un error'
            });
            return
        };
        response.status(200).json({
            ok: true,
            productos: results
        });
    });

})


//Agregamos nuestro administrador de rutas a la aplicacion backend
app.use(router);

//Evento que escucha el estado de nuestra aplicacion
app.listen(port, ()=>{
    console.log("Backend corriendo en el puerto ", port);
});