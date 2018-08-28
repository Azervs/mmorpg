module.exports.index = function (application, req, res){
    res.render('index', {validacao: {}});
}

module.exports.autenticar = function (application, req, res){
    var dadosForm = req.body;

    req.assert('usuario', 'Usuario nao pode ser vazio').notEmpty();
    req.assert('senha', 'Senha nao pode ser vazio').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.render("index", {validacao:erros});
        return;
    }

    res.send('tudo ok para criar a sessão');
}