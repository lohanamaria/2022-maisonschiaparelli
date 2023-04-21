+//Lê um arquivo qualquer
//caminhoArquivo é o parâmetro que você deve usar para informar o nome do arquivo.

console.log("teste")

const loadFile = function(caminhoArquivo, done) {
  var xhr = new XMLHttpRequest()
  xhr.onload = function() { return done(this.responseText) } 
  xhr.open("GET", caminhoArquivo, true)
  xhr.send()
}

//Objeto contendo os dados do usuário que serão carregados do JSON
let dadosUsuario = {}
//Objeto contendo os dados dos items que serão carregados do JSON
let dadosProdutos = {}

//Coleção de items que foram comprados
let carrinho = []

//Carrega os dados contidos nos arquivos JSON dos items e do usuário
//JSONFile: Nome do arquivo contendo os dados dos items. Ex: dados.json
//userFile: Nome do arquivo contendo os dados do usuário. Ex: usuário.json
//func: Função a ser chamada depois que os dados dos arquivos JSON forem carregados
//Retorna o valor 1 para indicar que o carregamento foi bem sucedido
const carregaJSON = function(JSONFile, userFile, func) {
  console.log("Carregando JSON com os items do site ...");
  loadFile(JSONFile, function(responseText) {
    dadosProdutos = JSON.parse(responseText)
    console.log("OK dados produtos")
    console.log("Carregando dados do usuário ...");
    loadFile(userFile, function(responseText) {
      dadosUsuario = JSON.parse(responseText)
      console.log("OK dados usuario")
      func()
      return 1
    })
  })
}

//A função setup é chamada após os dados do JSON dos items e do usuário terem sido carregadas em seus respectivos objetos. Todas as outras funcionalidades a serem feitas após o carregamento dos arquivos devem estar dentro da função setup.
//Sem parâmetros
//Retorna 1  para mostrar que o carregamento foi bem sucedido
const setup = function() {
  //Chama a função para criar os elementos HTML a partir de um array de items
  criaProdutosNoHTML("containerProdutos", dadosProdutos.produtos, "Todos os produtos")
  document.getElementById("nomeUsuario").innerHTML = dadosUsuario.nome
  document.getElementById("localUsuario").innerHTML = dadosUsuario.local
  return 1
}

//A função init é chamada automaticamente ao término do carregamento dos elementos do body no HTML
//Sem parâmetros
//Sem retorno
const init = function() {
  carregaJSON("produto.json", "usuario.json", setup);
}

//A função comprarItemClick é atribuida a todos os botões "comprar" de todos os items. Para diferenciar qual item está sendo selecionado utilizaremos o ID do próprio botão, que é igual ao ID do produto no JSON ...
//Sem parâmetros
//Sem retorno
const comprarItemClick = function() {
  console.log("Adicionando item ao carrinho ", this.id)
  let compra = dadosProdutos.produtos.filter(
    compra => compra.referencia == this.id
  )
  carrinho.push(compra[0])
  console.log(carrinho)
}


const retirarItemClick = function() {
  console.log("Retirando item do carrinho", this.id)
  let retira = dadosProdutos.produtos.filter(
    retira => retira.referencia == this.id
  )
  carrinho.pop(retira[0])
}

  const favoritarItemClick = function(){
    console.log("Favoritando item ", this.id)
   let index = dadosProdutos.produtos.findIndex(
    produto => produto.referencia == this.id
     )
    console.log(index)
    dadosProdutos.produtos[index].favorito = !(dadosProdutos.produtos[index].favorito)    
  }




//A função criaProdutosNoHTML vai gerar, a partir de um array de items, os elementos HTML que apresentam um determinado item (titulo, imagem, descricao, botão de compra)
//container: String que contém o ID da div no HTML onde os elementos ficarão ancorados
//dadosProdutos: Array contendo os items a serem apresentados
//categoria: String contendo o título a ser apresentado na div (na prática é um H1)
//Sem retorno

function criaProdutosNoHTML(container, dadosProdutos, categoria) {
  let containerCategoria = document.getElementById(container)

  let child = containerCategoria.lastElementChild
  while (child) {
    containerCategoria.removeChild(child)
    child = containerCategoria.lastElementChild
  }

  //Cria o título da categoria dentro do container
  let titulo = document.createElement('h3')
  //Substituir pela classe que você criou para o seu título de produto
  titulo['className'] = ""
  titulo.textContent = categoria
  containerCategoria.appendChild(titulo)

  //Carrega todos os produtos no container (div)
  let containerProdutos = document.getElementById(container)

  child = containerProdutos.lastElementChild
  while (child) {
    containerProdutos.removeChild(child)
    child = containerProdutos.lastElementChild
  }
  
  let contador = 0
  //Percorre todos os produtos para criar cada card dos items
  for (let produto of dadosProdutos) {
    if (contador % 4 == 0) {
      var row = document.createElement('div')
      row['className'] = "row g-4"
      containerProdutos.appendChild(row);
    }
    //Cria a div card para o produto
    let novaDiv = document.createElement('div')

    //Substituir pela classe que você criou para o seu título de produto
    novaDiv['className'] = "col"
    row.appendChild(novaDiv);

    //cria a imagem dentro da div do card
    let imagem = document.createElement('img')
    // imagem['style'] = "shadow-lg p-3 mb-3 bg-body rounded"
    imagem['src'] = produto.imagem
    imagem['alt'] = produto.alt
    imagem['className'] = "card-img-top"
    novaDiv.appendChild(imagem)

    //Cria o titulo do produto na div   
    let nH5 = document.createElement('h4');
    nH5['className'] = "text-start"
    nH5['style'] = "display: flex; justify-content: center;"
    nH5.textContent = produto.identificacao
    novaDiv.appendChild(nH5)

    //Cria o preco   
   let pPreco = document.createElement('h2')
    pPreco['className'] = "text-start"
    pPreco['style'] = "display: flex; justify-content: center;"
    pPreco.textContent = '€' + produto.valor
    novaDiv.appendChild(pPreco)

    //Cria o botão    
    let pComprar = document.createElement("p")
    novaDiv.appendChild(pComprar)
    

    let pRetirar = document.createElement("p")
    novaDiv.appendChild(pRetirar)

    let pFavoritar = document.createElement("p")
    novaDiv.appendChild(pFavoritar)

    let bBotao = document.createElement("button")
    bBotao["className"] = "btn btn-outline-dark"
    bBotao['id'] = produto.referencia
    bBotao.onclick = comprarItemClick
    bBotao.textContent = "ADD TO CART "
    pComprar.appendChild(bBotao)

    //cria a imagem dentro da div do card
    let imagemC = document.createElement('img')
     imagemC['src'] = "trolley.png"
     imagemC['className'] = ""
     imagemC['style'] = "max-width:19px; max-heigth:19px;"
     bBotao.appendChild(imagemC)

    

    let bBotao2 = document.createElement("button")
    bBotao2["className"] = "btn btn-outline-dark"
    bBotao2['id'] = produto.referencia
    bBotao2.onclick = retirarItemClick
    bBotao2.textContent = "REMOVE FROM CART "
    pRetirar.appendChild(bBotao2)

    let imagemD = document.createElement('img')
     imagemD['src'] = "trasi.png"
     imagemD['className'] = ""
     imagemD['style'] = "max-width:19px; max-heigth:19px;"
     bBotao2.appendChild(imagemD)

    
    let bBotao3 = document.createElement("button")
      bBotao3["className"] = "btn btn-outline-dark"
      bBotao3["style"] = "margin: 10px;"
      bBotao3.onclick = favoritarItemClick
      bBotao3['id'] = produto.referencia
      bBotao3.textContent = "FAVORITE "
      pFavoritar.appendChild(bBotao3)
    

    let imagemF = document.createElement('img')
      imagemF['src'] = "https://maisonschiaparelli.mariadecarvalho.repl.co/hearts%20(5).png"    
      imagemF['className'] = ""
      imagemF['style'] = "max-width:19px; max-heigth:19px;"
      bBotao3.appendChild(imagemF)

    contador++
  }
}


const filterJacket = function() {
  let roupaJacket = dadosProdutos.produtos.filter(
    roupa => roupa.tipo == "jacket"
  )
  criaProdutosNoHTML("containerProdutos", roupaJacket, "Tipo: Jacket")
}

const filterDress = function() {
  let roupaDress = dadosProdutos.produtos.filter(
    roupa => roupa.tipo == "dress"
  )
  criaProdutosNoHTML("containerProdutos", roupaDress, "Tipo: Dress")
}

const filterSkirt = function() {
  let roupaSkirt = dadosProdutos.produtos.filter(
    roupa => roupa.tipo == "skirt"
  )
  criaProdutosNoHTML("containerProdutos", roupaSkirt, "Tipo: Skirt")
}

const filterPants = function() {
  let roupaPant = dadosProdutos.produtos.filter(
    roupa => roupa.tipo == "pants"
  )
  criaProdutosNoHTML("containerProdutos", roupaPant, "Tipo: Pant")
}

const filterTop = function() {
  let roupaTop = dadosProdutos.produtos.filter(
    roupa => roupa.tipo == "top"
  )
  criaProdutosNoHTML("containerProdutos", roupaTop, "Tipo: Top")
}

const filterEarring = function() {
  let earring = dadosProdutos.produtos.filter(
    joia => joia.tipo == "Earring"
  )
  criaProdutosNoHTML("containerProdutos", earring, "Tipo: Earring")
}

const filterNecklaces = function() {
  let necklaces = dadosProdutos.produtos.filter(
    acessorio => acessorio.tipo == "Necklaces"
  )
  criaProdutosNoHTML("containerProdutos", necklaces, "Tipo: Necklaces")
}

const filterBrooches = function() {
  let brooches = dadosProdutos.produtos.filter(
    acessorio => acessorio.tipo == "Brooches"
  )
  criaProdutosNoHTML("containerProdutos", brooches, "Tipo: Brooches")
}

const filterRings = function() {
  let rings = dadosProdutos.produtos.filter(
    acessorio => acessorio.tipo == "Rings"
  )
  criaProdutosNoHTML("containerProdutos", rings, "Tipo: Rings")
}

const filterBracelets = function() {
  let bracelets = dadosProdutos.produtos.filter(
    acessorio => acessorio.tipo == "Bracelets"
  )
  criaProdutosNoHTML("containerProdutos", bracelets, "Tipo: Bracelets")
}

const filterBags = function() {
  let bags = dadosProdutos.produtos.filter(
    acessorio => acessorio.tipo == "Bags"
  )
  criaProdutosNoHTML("containerProdutos", bags, "Tipo: Bags")
}

const filterSmallLeatherGoods = function() {
  let smallLeatherGoods = dadosProdutos.produtos.filter(
    acessorio => acessorio.tipo == "Small Leather Goods"
  )
  criaProdutosNoHTML("containerProdutos", smallLeatherGoods, "Tipo: Small Leather Goods")
}

const filterBelts = function() {
  let belts = dadosProdutos.produtos.filter(
    acessorio => acessorio.tipo == "Belts"
  )
  criaProdutosNoHTML("containerProdutos", belts, "Tipo: Belts")
}

const filterCarabiner = function() {
  let carabiner = dadosProdutos.produtos.filter(
    acessorio => acessorio.tipo == "carabiner"
  )
  criaProdutosNoHTML("containerProdutos", carabiner, "Tipo: Carabiner")
}

const filterScarf = function() {
  let scarf = dadosProdutos.produtos.filter(
    acessorio => acessorio.tipo == "scarf"
  )
  criaProdutosNoHTML("containerProdutos", scarf, "Tipo: Scarf")
}

const favoritar = function(){
  let favoritos = dadosProdutos.produtos.filter(
    acessorio => acessorio.favorito == true
  )
   criaProdutosNoHTML("containerProdutos", favoritos, "Favoritos")
  let itens = favoritos.length
  document.getElementById("itensTotais").innerHTML = "Total de itens: " + itens
}
//soma do valor total do carrinho
const somador = function (acu, elemento){
  return acu + elemento.valor
}
const carregaCarrinho = function() {
  let total = carrinho.reduce(somador, 0)
  criaProdutosNoHTML("containerProdutos", carrinho, "Carrinho")
  
  novaDiv  = document.getElementById("containerProdutos")

  let itens = carrinho.length
  document.getElementById("itensTotais").innerHTML = "Total de itens: " + itens
  
  //mostrar valor total dos itens no html
  let nH5 = document.createElement('h4');
  nH5['className'] = "text-start"
  nH5['style'] = "display: flex; justify-content: center;"
  nH5.textContent = "Total do carrinho: €" + total
  novaDiv.prepend(nH5)    

  let bt = document.createElement('button');
  bt['className'] = "btn btn-outline-dark"
  bt.textContent = "CLEAR CART "
  bt.onclick = limparCarrinho
  novaDiv.appendChild(bt) 
}
const limparCarrinho = function(){
  console.log("Limpando carrinho")
  carrinho = []
}

// let bt = document.createElement('button');
//   bt['className'] = "btn btn-outline-dark"
//   bt.textContent = "CLEAR CART "
//   bt.onclick = limparCarrinho
//   novaDiv.appendChild(bt) 

const pesquisar = function(){
  let termoPesquisa = document.getElementById("search").value
  let e = document.getElementById("shopSelect")
  let opcao = e.value 

  if (opcao == 1) {//tipo
    var busca = dadosProdutos.produtos.filter(
      acessorio => acessorio.tipo.toUpperCase().includes(termoPesquisa.toUpperCase())
    )
  }  
  if (opcao == 2) {//cor
    var busca = dadosProdutos.produtos.filter(
      acessorio => acessorio.cor.toUpperCase().includes(termoPesquisa.toUpperCase())
    )
  }  
   if (opcao == 3) {//colecao
    var busca = dadosProdutos.produtos.filter(
      acessorio => acessorio.colecao.toUpperCase().includes(termoPesquisa.toUpperCase())
    )
  }  
  if (opcao == 4) {//valor
    var busca = dadosProdutos.produtos.filter(
      acessorio => acessorio.valor < parseFloat(termoPesquisa)
    )
  }
  criaProdutosNoHTML("containerProdutos", busca, "Busca")
  console.log(opcao)
 }
