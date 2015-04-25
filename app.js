
$(function() {
	"use strict";

	// Inicializacion de la pagina web
	var floorplan = $(".floorplan");

	// Rellenamos los laboratorios con sus etiquetas
	floorplan.find(".lab").each(function() {
		var lab = $(this);

		// Añadimos la etiqueta con el nombre del laboratorio
		lab.append("<span class='info name'>" + this.id + "</span>");
		lab.append(" <span class='info activity'></span>");
		lab.append(" <span class='info timeUntilChange'></span>");
	});

	// String hash function
	function hashCode(str) {
		var hash = 0, i, chr, len;
		for (i = 0, len = str.length; i < len; i++) {
			chr   = str.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	}

	// From StackOverflow: http://stackoverflow.com/a/21152762/3080396
	var qd = {};
	location.search.substr(1).split("&").forEach(function(item) {
		var k = item.split("=")[0],
		    v = decodeURIComponent(item.split("=")[1]);
		if (k in qd) qd[k].push(v);
		else         qd[k] = [v,];
	});

	var now  = new Date();
	var day  = $.isNumeric(qd.day)  || qd.day  || now.getDay();
	var hour = $.isNumeric(qd.hour) || qd.hour || now.getHours() - 9;
	// Timetable starts at 9 o'clock

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
			self.toggleClass("busy", !!activity);
			self.toggleClass("free", !!!activity);
			self.children(".activity").text(activity || "");

			var timeUntilChange = self.children(".timeUntilChange");
			var howMuch = "";

			if (activity) {
				howMuch = "> 2 hours";
				if (!lab.schedule[hour+2]) {
					howMuch = (60 - now.getMinutes()) + (lab.schedule[hour+1] ? 60 : 0) + " min";
				}
			}
			else {
				if (lab.schedule[hour+2]) {
					howMuch = (60 - now.getMinutes()) + (!lab.schedule[hour+1] ? 60 : 0) + " min";
				}
				else {
					self.addClass("recommended");
				}
			}
			timeUntilChange.text(howMuch);

		});
	});
});
