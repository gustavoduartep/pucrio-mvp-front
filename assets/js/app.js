//Listar itens registrados no banco
function listarItens(item) {
  $.ajax({
    type: "GET",
    global:false,
    url: "http://127.0.0.1:5000/itens",
    success: function (response) {
      response.itens.forEach(item => exibirItemLista(item.id, item.nome, item.quantidade, item.valor))
      //response.itens.forEach(item => atualizarTabela(item.id, item.nome, item.quantidade, item.valor))
      console.log(response.itens)

    },
    error: function (xhr, error) {
      exibirAlerta('error', 'Ops!', `${xhr.responseJSON.message}.`, 3000)
    }
  });
}

listarItens()


// Constrói objetos (itens)
const dados = (item) => {

  let item_valor_real = $(`${item} .valor-real`).text();
  let item_valor_centavo = $(`${item} .centavos`).text();
  let concat_valor = item_valor_real + item_valor_centavo;
  let convert_decimal = parseFloat(concat_valor)

  return {
    nome: $(`${item} .nome-item`).text(),
    quantidade: $(`${item} .quantidade input`).val(),
    valor: convert_decimal
  }
}

function exibirAlerta(status, titulo, texto, tempo) {
  Swal.fire({
    position: 'center',
    title: titulo,
    text: texto,
    icon: status,
    color: '#fff',
    showConfirmButton: false,
    background: '#212529',
    timer: tempo
  })
}

function adicionarItem(item) {
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:5000/item",
    global:false,
    dataType: 'json',
    data: dados(item),
    success: function (response) {
      exibirAlerta('success', 'Sucesso!', 'O item foi adicionado na lista.', 3000)
      listarItens()
    },
    error: function (xhr, error) {
      exibirAlerta('error', 'Ops!', `${xhr.responseJSON.message}.`, 3000)
    }
  });
}

function removerItem(item) {
  Swal.fire({
    title: 'Remover o item?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, por favor!',
    confirmButtonColor: '#000',
    background: '#212529',
    color: '#fff',
    cancelButtonText: 'Cancelar!',

  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "DELETE",
        global:false,
        url: "http://127.0.0.1:5000/item?id=" + item,
        success: function (response) {
          $('tr[id="deletar-' + item + '"]').remove();
          Swal.fire({
            title: 'Removido!',
            text: 'Item removido do pedido.',
            icon: 'success',
            confirmButtonText: 'Ok',
            color: '#fff',
            confirmButtonColor: '#000',
            background: '#212529',
            timer: 3000
          })
        },
        error: function (xhr, error) {
          exibirAlerta('error', 'Ops!', `${xhr.responseJSON.message}.`, 3000)
        }
      });
    }
  })
}

let contador = 1;

const exibirItemLista = (id, nome, quantidade, valor) => {

  const options = { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }
  const formatNumber = new Intl.NumberFormat('pt-BR', options)

  let itens = [nome, quantidade, valor];
  let tabela = $('#tabela-pedidos > tbody');
  let calculo = valor * quantidade;
  let moedaUnidade = formatNumber.format(valor)
  let moedaTotal = formatNumber.format(calculo)

  if (itens != null) {
    $('.carrinho p').hide();
    tabela.append(`<tr class="linha" id="deletar-${id}"><th scope="row" id="contagem">${contador++}</th><td>${nome}</td><td>${quantidade}</td><td>${moedaUnidade}</td><td>${moedaTotal}</td><td><button class="btn btn-danger" type="button" href="#DeletarItem" onclick="removerItem(${id})">Remover <i class="fa fa-trash" aria-hidden="true"></i> </button></td></tr>`);
  }
  else {
    $('.carrinho p').show();
  }
}



$(document).ready(function () {

  $('.btn-plus, .btn-minus').on('click', function (e) {
    const isNegative = $(e.target).closest('.btn-minus').is('.btn-minus');
    const input = $(e.target).closest('.input-group').find('input');
    if (input.is('input')) {
      input[0][isNegative ? 'stepDown' : 'stepUp']()
    }
  })
  
  var $loading = $('.loading').hide()
  $(document)
    .ajaxStart(function () {
        $loading.show();
    })
  .ajaxStop(function () {
       $loading.hide();
   });

});