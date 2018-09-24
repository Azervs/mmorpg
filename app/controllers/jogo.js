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
	res.render("pergaminhos", {validacao: {}});
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
	JogoDAO.acao(res ,dadosForm);
	res.redirect('jogo?msg=B');
}

function getJogoDAO(application){
	var connection = application.config.dbConnection;
	return new application.app.models.JogoDAO(connection);
}