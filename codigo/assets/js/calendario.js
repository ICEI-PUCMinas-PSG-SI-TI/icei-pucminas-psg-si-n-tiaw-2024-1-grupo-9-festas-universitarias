document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar;

    buscarEventos()
        .then(eventos => {
            calendar = new FullCalendar.Calendar(calendarEl, {
                themeSystem: 'bootstrap',
                eventColor: 'green',
                nextDayThreshold: '09:00:00',
                eventContent: function(arg) {
                    return {
                        html: '<b>' + arg.timeText + '</b> ' + arg.event.title
                    };
                },
                events: eventos,
                height: 'auto',
                aspectRatio: 1.5,
                locale: 'pt-br'
            });

            calendar.render();
        })
        .catch(error => {
            console.error('Erro ao buscar eventos:', error);
        });
});

$(document).ready(function() {
    $("#lastButton").click(function() {
      $("#modalNovoEvento").modal("show");
    });
});

$('#preco').change(function(){
    let valor = $(this).val().replace(/[^\d,]/g, '');
    
    let valorNumerico = parseFloat(valor.replace(',', '.'));

    let valorFormatado = valorNumerico.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    if($(this).val().trim() == "" ||$(this).val().trim() == "R$" ){
        $(this).val("");
    }else{
        $(this).val(valorFormatado);
    }

    //console.log(valor, valorFormatado);
});

function buscarEventos() {
    return fetch("http://localhost:3000/eventos")
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao fazer a requisição: ' + response.statusText);
        }
        return response.json(); 
      })
      .then(data => {
        let eventos = []
        
        data.forEach(dado => {
            let evento = ""
            let color = ""
            if(dado.tipo == "1"){
                color = "#8A2BE2"
            }else{
                color = "#21a34f"
            }
            evento = {
                "title": dado.nomeEvento,
                "start": dado.dataInicio,
                "end": dado.dataFim,
                "color": color,
                "display": "block"
            }
            eventos.push(evento)
        });
  
        return eventos
      })
      .catch(error => {
        console.error('Ocorreu um erro:', error);
      });
}



$('#salvar').click(function(){
    var request = true
    var nomeEvento = $('#nomeEvento').val()
    var dataInicio = $('#dataInicio').val()
    var dataFim = $('#dataFim').val()
    var participantes = $('#qtdPessoas').val()
    var endereco = $('#endereco').val()
    var preco = $('#preco').val()
    var tipo = $('#tipo').val()
    var descricao = $('#descricao').val()

    // console.log({
    //     nomeEvento,
    //     dataInicio,
    //     dataFim,
    //     participantes,
    //     endereco,
    //     preco,
    //     tipo,
    //     descricao
    // })


    if(nomeEvento.trim()==""||
       dataInicio.trim()==""||
       dataFim.trim()==""||
       participantes == ""||
       endereco.trim()==""||
       tipo == null
    ){
        Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Preencha os campos obrigatórios!',
          });
          
        request = false
    }


    if(!request){
        return
    }

    const url = 'http://localhost:3000/eventos';

    const data = {
        nomeEvento,
        dataInicio,
        dataFim,
        participantes,
        endereco,
        preco,
        tipo,
        descricao
      };
    
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };

      fetch(url, options)
        .then(response => {
            if (!response.ok) {
            throw new Error('Erro ao fazer a requisição: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Evento cadastrado com sucesso!',
              }).then(function() {
                $("#modalNovoEvento").modal("toggle");
                $('#nomeEvento').val("")
                $('#dataInicio').val("")
                $('#dataFim').val("")
                $('#qtdPessoas').val("")
                $('#endereco').val("")
                $('#preco').val("")
                $('#tipo').val("")
                $('#descricao').val("")
                var calendarEl = document.getElementById('calendar');
                var calendar;
                buscarEventos()
                    .then(eventos => {
                        calendar = new FullCalendar.Calendar(calendarEl, {
                            themeSystem: 'bootstrap',
                            eventColor: 'green',
                            nextDayThreshold: '09:00:00',
                            eventContent: function(arg) {
                                return {
                                    html: '<b>' + arg.timeText + '</b> ' + arg.event.title
                                };
                            },
                            events: eventos,
                            height: 'auto',
                            aspectRatio: 1.5,
                            locale: 'pt-br'
                        });

                        calendar.render();
                    })
                    .catch(error => {
                        console.error('Erro ao buscar eventos:', error);
                    });
              });
        })
        .catch(error => {
            console.error('Ocorreu um erro:', error);
        });



})

function searchArray(){
    let texto = $('#searchInput').val();
    let html = ""

   if(texto.trim() != ""){
        $('#searchResults').removeClass('d-none')
        $('#searchResults').addClass('d-flex, flex-column,gap-1')
        let regex = new RegExp(texto, 'i');
        let filtro = search.filter((s) => regex.test(s.nomeEvento));
        let id = ""
        filtro.forEach(dado => {
            if(dado.tipo == "1"){
                id = 'festa'
            }else{
                id = 'palestra'
            }
            html += `<div class='search w-100 p-1 bolder' onclick='editaEvento("${dado.id}")' id='${id}'>${dado.nomeEvento}</div>`
        })
   }else{
        $('#searchResults').removeClass('d-flex')
        $('#searchResults').addClass('d-none')
   }
    $('#searchResults').html(html)
}

var search = []
$('#searchInput').click(function(){
    axios.get('http://localhost:3000/eventos')
    .then(function (response) {
        // console.log(response.data)
        search = []
        response.data.forEach(dado => {
            
            search.push(dado)
        })
        searchArray()
    })
    .catch(function (error) {
      console.log(error);
    })
})

$('#searchInput').keyup(function(){
    searchArray()
})



// $('#searchInput').change(function(){
//     $('#searchResults').removeClass('d-flex')
//     $('#searchResults').addClass('d-none')
// })


function editaEvento(id){
    axios.get(`http://localhost:3000/eventos?id=${id}`)
    .then(function (response) {
         console.log(response.data[0])
                    
    })
    .catch(function (error) {
      console.log(error);
    })
}