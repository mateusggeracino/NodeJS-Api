const express = require('express')
var mongoose = require('mongoose');
const app = express()
const port = 3000

mongoose.connect('mongodb://localhost:27017/LanchoneteVegetarianaSemMais')
    .then(() => console.log('Now connected to MongoDB!'))
    .catch(err => console.error('Something went wrong', err));

var LancheSchema = new mongoose.Schema({
    nome: String,
    preco: String,
    vegano: Boolean
  });
  
var Lanche = mongoose.model('Lanche', LancheSchema);

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/solicitaLanche', function(request, response){
    var nomeSolicitado = request.body.nome;
    var precoSolicitado = request.body.preco;
    var veganoSolicitado = request.body.vegano;
  
    var Pedido = new Lanche({ nome: nomeSolicitado, preco: precoSolicitado, vegano: veganoSolicitado });
    Pedido.save(function (err, Pedido) {
      if (err) return console.error(err);
      
    });
    response.send("Pedido Criado com Sucesso"); 
});
  
app.get('/', (req, res) => {
    Lanche.find({}, function(err, lanches) {
    var lancheMap = {};

    lanches.forEach(function(lanche) {
        lancheMap[lanche._id] = lanche;
    });

    res.send(lancheMap);  
  });
});


app.get('/:nomeLanche', (req, res) => {
    var nomeLanche = req.params.nomeLanche;
    Lanche.findOne({ nome: nomeLanche }, function (err, lanches) {
        res.send(lanches);  
    });
  });



app.listen(port, () => console.log(`Example app listening on port ${port}!`))