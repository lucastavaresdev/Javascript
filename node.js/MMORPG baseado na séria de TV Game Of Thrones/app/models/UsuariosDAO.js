//importando o crypto
var crypto = require('crypto');

function UsuariosDAO(connection) {
	this._connection = connection;
}

UsuariosDAO.prototype.inserirUsuario = function (usuario, res) {
	var senha_criptografada = crypto.createHash("md5").update(usuario.senha).digest("hex")
	usuario.senha = senha_criptografada

	var dados = {
		operacao: "inserir",
		usuario: usuario,
		collection: "usuarios",
		callback: function (err, result) {


		}
	};
	this._connection(dados);
};


UsuariosDAO.prototype.autenticar = function (usuario, req, res) {
	var senha_criptografada = crypto.createHash("md5").update(usuario.senha).digest("hex")
	usuario.senha = senha_criptografada

	var dados = {
		operacao: "buscar",
		usuario: usuario,
		collection: "usuarios",
		callback: function (err, result) {
			result.toArray(function (err, result) {
				if (result[0] != undefined) {
					req.session.autorizado = true;

					req.session.usuario = result[0].usuario;
					req.session.casa = result[0].casa;

				}

				if (req.session.autorizado) {
					res.redirect('jogo');
				} else {
					res.render('index', { validacao: {} })
				}

			})
		}
	}

	this._connection(dados);
}


module.exports = function () {
	return UsuariosDAO;
};


