document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var eventos = [
        {
            title: "Calourada PUC",
            start: moment().format(), 
            end:  moment().format(), 
            color: "#8A2BE2",
            display: "block",
        },
        {
            title: "Palestra Networking",
            start: '2024-05-05', 
            end: '2024-05-07', 
            color: "#21a34f",
            display: "block",
        },
    ]
    
    var calendar = new FullCalendar.Calendar(calendarEl, {
      
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


