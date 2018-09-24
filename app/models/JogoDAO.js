var ObjectID = require('mongodb').ObjectId;
function JogoDAO(connection){
	this._connection = connection;
}

JogoDAO.prototype.gerarParametros = function(usuario){
	var dados = {
		operacao: "inserir",
		documento: {
			usuario: usuario,
			moeda: 15,
			suditos: 10,
			temor: Math.floor(Math.random() * 1000),
			sabedoria: Math.floor(Math.random() * 1000),
			comercio: Math.floor(Math.random() * 1000),
			magia: Math.floor(Math.random() * 1000)
		},
		collection: "jogo",
		callback: function(err, result) {
			//res.send("callback de inserirUsuario");
		}
	};
	this._connection(dados);
	console.log(dados);
}

JogoDAO.prototype.iniciaJogo = function(res, usuario, casa, msg){

	//console.log(msg);

	var dados = {
		operacao: "consultar",
		documento: {
			usuario: usuario
		},
		collection: "jogo",
		callback: function(err, result) {

			result.toArray(function(errArray, resultArray){

				res.render("jogo", {
					img_casa: casa, 
					jogo: resultArray[0],
					msg: msg
					});
			});
		}
	};
	this._connection(dados);
}


	JogoDAO.prototype.acao = function(res, acao){
	
		var dadosInserir = {
			operacao: "inserir",
			documento: acao,
			collection: "acao",
			callback: null
		};

	
	this._connection(dadosInserir);
	
	console.log(dadosInserir);
	//atualizar moedas

	var moedas = null;

	switch(parseInt(acao.acao)){
		case 1: moedas = -2 * acao.quantidade; break;
		case 2: moedas = -3 * acao.quantidade; break;
		case 3: moedas = -1 * acao.quantidade; break;
		case 4: moedas = -1 * acao.quantidade; break;
	}

	var dadosJogo = { 
		operacao: "atualizarUm",
		filtro: {
			usuario: acao.usuario
		},
		documento: {
			$inc: {moeda: moedas}
		},
		collection: "jogo",
		callback: function(err, result) {
			//res.send("callback de acao");
		//	res.redirect('jogo?msg=B');
		}
	};

	//console.log(dadosJogo);
	
	this._connection(dadosJogo);

}

JogoDAO.prototype.getAcoes = function(res, usuario){

	var date = new Date();
	var momento_atual = date.getTime();

	var dados = {
		operacao: "consultar",
		documento: {
			usuario: usuario,
			acao_termina_em: {$gt: momento_atual}
		},
		collection: "acao",
		callback: function(err, result) {
			
			//console.log(result);

			result.toArray(function(errArray, resultArray){

				//console.log(usuario);
				//console.log(resultArray);

				res.render("pergaminhos", {acoes: resultArray});
			});
		}
	};
	this._connection(dados);
}

JogoDAO.prototype.revogarAcao = function(res, id_acao){
	var date = new Date();
	var momento_atual = date.getTime();

	var dados = {
		operacao: "remover",
		documento: {
			_id: ObjectID(id_acao)
		},
		collection: "acao",
		callback: function(err, result) {
			res.redirect("jogo?msg=D");
		}
	};
	this._connection(dados);
}


module.exports = function() {
    return JogoDAO;
}