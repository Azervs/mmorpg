module.exports.jogo = function(application, req, res){
	
	if(req.session.autorizado !== true){
		res.send('Usuario precisa fazer login');
		return;
	} 
	var msg = '';
	if(req.query.msg != ''){
		msg= req.query.msg;
	}
	console.log(msg);

	var usuario = req.session.usuario;
	var casa = req.session.casa;

	var JogoDAO = getJogoDAO(application);

	

	JogoDAO.iniciaJogo(res, usuario, casa,msg);
	
}

module.exports.sair = function(application, req, res){
	
	req.session.destroy(function(err){
		res.render("index", {validacao: {}});
	});
}

module.exports.suditos = function(application, req, res){
	if(req.session.autorizado !== true){
		res.send('Usuario precisa fazer login');
		return;
	} 
	res.render("aldeoes", {validacao: {}});
}

module.exports.pergaminhos = function(application, req, res){
	if(req.session.autorizado !== true){
		res.send('Usuario precisa fazer login');
		return;
	} 
	
	var JogoDAO = getJogoDAO(application);
	var usuario = req.session.usuario;

	JogoDAO.getAcoes(res, usuario);
	
	//res.render("pergaminhos", {validacao: {}});
}

module.exports.ordernar_acao_sudito = function(application, req, res){
	if(req.session.autorizado !== true){
		res.send('Usuario precisa fazer login');
		return;
	} 
	var dadosForm = req.body;

	req.assert("acao", 'Ação deve ser informada').notEmpty();
	req.assert("quantidade", 'Quantidade deve ser informada').notEmpty();

	var erros = req.validationErrors();

	if(erros){
		res.redirect('jogo?msg=A');
		return;
	}
	var JogoDAO = getJogoDAO(application);

	dadosForm.usuario = req.session.usuario;

	dadosForm.acao_termina_em = getTempoTerminaEm(dadosForm.acao);

	JogoDAO.acao(res ,dadosForm);

	res.redirect('jogo?msg=B');
}


module.exports.revogar_acao = function(application, req, res){
	var url_query = req.query;
	var id_acao = url_query.id_acao;

	var JogoDAO = getJogoDAO(application);
	JogoDAO.revogarAcao(res, id_acao);
}

function getJogoDAO(application){
	var connection = application.config.dbConnection;
	return new application.app.models.JogoDAO(connection);
}

function getTempoTerminaEm(acao){

	var tempo = null;

	switch(parseInt(acao)){
		case 1: tempo = 1 * 60 * 60000; break;
		case 2: tempo = 2 * 60 * 60000; break;
		case 3: tempo = 5 * 60 * 60000; break;
		case 4: tempo = 5 * 60 * 60000; break;
	}
	
	var date = new Date();

	return date.getTime() + tempo; 
}


function getJogoDAO(application){
	var connection = application.config.dbConnection;
	return new application.app.models.JogoDAO(connection);
}