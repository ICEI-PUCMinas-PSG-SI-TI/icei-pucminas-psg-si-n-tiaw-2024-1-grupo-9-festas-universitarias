//console.log("hello")

//script de criação do calendario
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        
        themeSystem: 'bootstrap',


        eventContent: function(arg) {
            return {
                html: '<b>' + arg.timeText + '</b> ' + arg.event.title
            };
        },

        
        
        

        height: 'auto',
        aspectRatio: 1.5,

        
        locale: 'pt-br'
    });

    calendar.render();
});
