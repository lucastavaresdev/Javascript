# Multiroom Chat

Express

### Base para um projeto Express
```
    Express
    Ejs
    Consign 
    Express-Validator
    Body-parser
```

### Init

1) Criar diretório e repositorio do projeto 
2) Git Ignore
3) Iniciar o NPM (NPM init
4) Express
5) EJS (ou outra engine)
6) Consign
7) Body-Parser
8) Express-validator


### Estrutura do Projeto
```
            Nome_do_projeto/
            ├── app/
                     ├── controllers/
                            ├──index.js
                            ├──chat.js
                     ├── models/
                     ├── public/
                              ├──css/
                              ├──images/
                              ├──js/
                     ├── routes/
                              ├──index.js
                              ├──chat.js
                     ├── views/
            ├── config/
                        ├── server.js
            ├── node_modules/
            ├── .gitignore
            ├── app.js
            ├── package.json
            ├── README.md
```

###Criando o servidor

 1) app.js
    
    ```
        /*importar as configurações do  servidor*/

        var app = require('./config/server');

        /*Parametrizar a porta de esculta  */
        app.listen(80, function(){
            console.log('Servidor Online');
        });

    ```

    2) Server.js

    ```
            /*Importar o modulo do framework express */
            var express = require('express');

            /*Importar o modulo do consign */
            var consign = require('consign');

            /*Importar o modulo do body-parser */
            var bodyParser = require('body-parser');

            /*Importar o modulo do express-validator */
            var expressValidator = require('express-validator');


            /*Iniciar o objeto express */
            var app = express();


            /*Setar as variaveis de 'view engine e views do express'*/
            app.set('view engine', 'ejs');
            app.set('views', './app/views');

            /*Configurar os middleware express.static*/
            app.use(express.static('./app/public'));

            /*configurar o middeware body-parser (recupera os submit do formulario em json se tiver o mesmo nome dos campos na tabela)*/
            app.use(bodyParser.urlencoded({extended: true}))

            /*configurar o body-parser express-validator*/
            app.use(expressValidator());

            /*efetua o autoload das rotas, dos modulos e dos controllers para o objeto app*/
            consign()
            .include('app/routes')
                .then('app/models')
                .then('app/controllers')
                .into(app);

            /* exportar o objeto app */
            module.exports = app;
    ```
---------------------------------------------------


##routes


As rotas redirecionam para a pagina e pode ser via get ou post

```
module.exports = function(application){
    //post porque é submetido por um formulario
    application.post('/chat', function(req, res){
        //busca na pasta o aquivo ejs
        res.render('chat');
    });

    //post porque é submetido por um formulario
    application.get('/chat', function(req, res){
        //busca na pasta o aquivo ejs
        res.render('chat');
    });

}

```
----------------------------------------------
##controllers


Os controlers recebe a logica de programação


```

Controllers ---- index.js

    module.exports.home = function(application,req, res){
        res.render('index');
    }


routes --- indes.js

    module.exports = function(application){

        application.get('/', function(req, res){
            //busca na pasta o aquivo ejs
            application.app.controllers.index.home(application, req, res);
        });

    }
```

##Socket.io

Abre uma conexao co cliente do servidor e sevidor cliente;


Alterar o arquivo app.js

    ```
    /* importar as configurações do servidor */
    var app = require('./config/server');

    /* parametrizar porta de escuta */
    var server = app.listen(8001, function(){
        console.log('Servidor online');
    })

    require('socket.io').listen(server);

    ```

Colocar o socket no cliente 
    ```
					<script src="/socket.io/socket.io.js"></script>
    ```

chamando a instancia do objeto que se conecta com o web socket

```
        var socket = io('http://localhost:8001');
```

ir no app.js pegar o require que esta escutando a porta e encapsular numa variavel

Depois cria a conexao chamando o metodo on que fica escutando o que acontece com o cliente ou vice versa
```
    var io = require('socket.io').listen(server);


    /*Criar a conexao por websocket */

    io.on('connection', function(socket){
        console.log('teste de usuario');
    })
```

Adiciona o metodo de desconectar 
    *A variavel sabe que desconectou pq ela a conexao do socket com o lado do cliente some

```
    /*Criar a conexao por websocket */

    io.on('connection', function(socket){
        console.log('teste de usuario');

        socket.on('disconnect' , function(){
            console.log("usuario desconectou")
        })
        
    })
```

##Abrindo a conexao
    Explicação
        ```
            //Ouve pedidos de Execução
            on('nome', function()data{})
            
            //Envia pedido para execurtar alguma funcao
            emit('nome', {})

        ```
No app.js coloca uma variavel global para poder ter as instancia do objeto
        ```
        var io = require('socket.io').listen(server);

        app.set('io', io);

        ```

        no app.js estamos instanciando o io
        ```
            var io = require('socket.io').listen(server);
        ```

    Em controller chat
        ```
                                //nome para recuperar/estrutura de dados
           application.get('io').emit(msgParaCliente','Teste' )

        ```

    na view chat
          ```
                   var socket = io('http://localhost:8001');

                    socket.on('msgParaCliente', function(){
                        alert('recebi uma requisição do servidor');
                    })
    ```

recebendo a msg passada la no msg
    ```
    //recuperando a informação passada no emit
            socket.on('msgParaCliente', function(data){
                 alert(data);
             })
    ```

    ----------------------------------------------

    ```
      application.get('io').emit(
            'msgParaCliente',
                {apelido: dadosForm.apelido, mesagem: 'acabou de entrar no chat'}
        )
    ```

Script final do chat.ejs

```
		<script>
				var socket = io('http://localhost:8001');

				socket.on('msgParaCliente', function(data){
						var html = ' ';

						html += '<div class="dialogo">';
						html += '<h4>' +  data.apelido +'</h4>';
						html += '<p>' +  data.mensagem +'</p>';
						html += '</div>';


						$('#dialogos').append(html)
				})
			</script>
```



-------------------------------------------------------------
## Configurando pra troca de mensagem

no chat.js

´´´
//pega o botão onde do clique, após instancia o emit da variavel socket para a função do on(msgParaServidor) com o json
	$('#enviar_mensagem').click( function(){
		socket.emit(
			'msgParaServidor',
			{ apelido: ' ', mensagem: $('#mensagem').val()}
		);
	});
´´´


-----------------------

//O emit que esta na view envia a mensagem para o servidor (app.js) que recebe a mensam e envia outro emit com os dados
*apensa o usuario ve

No chat.js
´´´
	$('#enviar_mensagem').click( function(){
		socket.emit(
			'msgParaServidor',
			{ apelido: ' ', mensagem: $('#mensagem').val()}
		);
	});
´´´

no app.js
´´´
    socket.on('msgParaServidor', function(data){
        socket.emit('msgParaCliente', {apelido: data.apelido, mensagem: data.mensagem})
    });
´´´

-----------------------------------------------------------------


no app js o emit é so para a mesmo passoa duplica a linha e coloca o bloadcast.emit

```
 socket.on('msgParaServidor', function(data){
        socket.emit(
            'msgParaCliente', 
            {apelido: data.apelido, mensagem: data.mensagem}
        );
        socket.broadcast.emit(
            'msgParaCliente', 
            {apelido: data.apelido, mensagem: data.mensagem}
        );
    })
```


trazendo o apelido

No controller da pagina quando ela é rederizada é pássado por parametro o dado do form que logou

```
 res.render('chat', {dadosForm: dadosForm});
```



Colocado um input escondido para pegar o dado do apelido 
e depois capiturado pelo js
```

	<input type='hidden' value="<%=dadosForm.apelido%>" id="apelido">


				$('#enviar_mensagem').click( function(){
					socket.emit(
						'msgParaServidor',
						{ apelido: $('#apelido').val() , mensagem: $('#mensagem').val()}
					);
				});

```
--------------------------------------------------------------
##Atualizando a lista de participantes

Para atualizar a lista de participantes

criar o elem pai com um id

```
	<div class="col-md-10" id="pessoas"></div>
```

atulizar a lista de partitcipantes no servidor (app.js)
```
    if (parseInt(data.apelido_atualizado_nos_clientes) == 0) {
            socket.emit(
                'participantesParaCliente', 
                {apelido: data.apelido}
            );
            socket.broadcast.emit(
                'participantesParaCliente', 
                {apelido: data.apelido}
            );
     }

```
no lado do cliente na view (chat.ejs)

```
		socket.on('participantesParaCliente', function(data){
						var html = ' ';

						html += '<span class="participante">';
						html +=   data.apelido ;
						html += '</span>';


						$('#pessoas').append(html)
				})
```

para evitar duplicata de usuario

coloca um input escondido onde o valor recebe 0 se e ele nao exitir vira 1 para na proxima tentativa cair na condição
```
	<input type='hidden' value="0" id="apelido_atualizado_nos_clientes">
```

coloca na hora de enviar no chat.ejs 
```
		$('#enviar_mensagem').click( function(){
					socket.emit(
						'msgParaServidor',
						{ apelido: $('#apelido').val() , 
						mensagem: $('#mensagem').val(),
						apelido_atualizado_nos_clientes: $('#apelido_atualizado_nos_clientes').val();
						}
					);

```

adiciona if para validar se ja existe

```
 /* participantes */
    if (parseInt(data.apelido_atualizado_nos_clientes) == 0) {
        socket.emit(
            'participantesParaCliente',
            { apelido: data.apelido }
        );
        socket.broadcast.emit(
            'participantesParaCliente',
            { apelido: data.apelido }
        );
    }
```


adiciona depois da execução 1

```
	$('#enviar_mensagem').click( function(){
					socket.emit(
						'msgParaServidor',
						{ apelido: $('#apelido').val() , 
						mensagem: $('#mensagem').val(),
						apelido_atualizado_nos_clientes: $('#apelido_atualizado_nos_clientes').val();
						}
					);

					$('#apelido_atualizado_nos_clientes').val(1);//essa linha foi add
				});
```


