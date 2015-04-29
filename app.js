
$(function() {
	"use strict";

	// Inicializacion de la pagina web
	var floorplan = $(".floorplan");

	// Rellenamos los laboratorios con sus etiquetas
	var tabindex = 0;
	floorplan.find(".lab").each(function() {
		var lab = $(this);

		lab.attr("tabindex", ++tabindex);
		// Añadimos la etiqueta con el nombre del laboratorio
		lab.append("<span class='info name'>" + this.id + "</span>");
		lab.append(" <span class='info activity'></span>");
		lab.append(" <span class='info timeUntilChange'></span>");
	});

	// Basado en esta respuesta: http://stackoverflow.com/a/21152762/3080396
	var qd = {};
	location.search.substr(1).split("&").forEach(function(item) {
		var pair = item.split("=");
		qd[pair[0]] = decodeURIComponent(item.split("=")[1]);
	});

	// Timetable starts at 9 o'clock
	var now  = new Date();
	var day  = ("day"  in qd) ? parseInt(qd.day, 10)  : now.getDay();
	var hour = ("hour" in qd) ? parseInt(qd.hour, 10) : (now.getHours() - 9);


	// Test if the day and hour are in-range
	if ((day <= 0 || day >= 6) || (hour < 0 || hour > 11)) {
		$(".lab").addClass("busy");
		return; // Abort
	}

	// Fetch the timetable
	$.getJSON("timetable.json", function(timetable, status) {
		timetable[day].forEach(function(lab) {
			var self = $("#" + lab.id);
			if (!self) return; // No esta el laboratorio en el plano

			var activity = lab.schedule[hour];

			self.children(".activity").text(activity || "");

			var timeUntilChange = self.children(".timeUntilChange");
			var howMuch = "", i;

			if (activity) {
				self.addClass("busy");
				// Calculamos dentro de cuanto estara desocupado
				howMuch = -now.getMinutes();
				for (i = hour; i < 12; i++) {
					if (lab.schedule[i]) howMuch += 60;
					else break;
				}
				howMuch += " min";
			}
			else {
				if (lab.schedule[hour+1]) {
					howMuch = (60 - now.getMinutes()) + " min";
					self.addClass("soon", (i == 12));
				}
				for (i = hour; i < 12; i++) {
					if (lab.schedule[i]) break;
				}
				self.toggleClass("free", (i == 12));
			}
			timeUntilChange.text(howMuch);

		});
	});
});
