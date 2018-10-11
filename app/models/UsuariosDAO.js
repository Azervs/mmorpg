var crypto = require("crypto");

function UsuariosDAO(connection){
	this._connection = connection;
}
        UsuariosDAO.prototype.inserirUsuario = function(usuario, res){
            var dados = {
                operacao: "inserir",
                documento: usuario,
                collection: "usuarios",
                callback: function(err, result) {
                  //  res.send("callback de inserirUsuario");
                  
                }
                
            };
            var senha_criptografada = crypto.createHash("md5").update(usuario.senha).digest("hex");
                  usuario.senha = senha_criptografada;
                  console.log(senha_criptografada);
            this._connection(dados);
            
        }
    UsuariosDAO.prototype.autenticar = function(usuario, req, res){
        console.log(usuario);
        var dados = {
            operacao: "consultar",
            documento: usuario,
            collection: "usuarios",
            callback: function(err, result) {
                var senha_criptografada = crypto.createHash("md5").update(usuario.senha).digest("hex");
                usuario.senha = senha_criptografada;
                result.toArray(function(errArray, resultArray){
    
                    if(resultArray[0] != undefined){
                        req.session.autorizado = true;
                        req.session.usuario = resultArray[0].usuario;
                        req.session.casa = resultArray[0].casa;
                    }
    
                    if(req.session.autorizado){
                        res.redirect("jogo");
                    }
                    else{
                        res.render("index", {
                            validacao: [
                                {msg: 'Usuario nao encontrado'}
                            ]
                        });
                    }
                });
            }
        };
        this._connection(dados);
    }

    module.exports = function() {
            return UsuariosDAO;
    }