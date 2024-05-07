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

    console.log(valor, valorFormatado);
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
