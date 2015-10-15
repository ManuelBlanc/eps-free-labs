"use strict";

// Initialization & includes
var fs = require("fs");
var casper = require("casper").create({
	clientScripts    	: ["lib/jquery-2.1.3.min.js"],
	verbose          	: true,
	logLevel         	: 'info',
	loadImages       	: false,
	loadPlugins      	: false,
	javascriptEnabled	: false,
});

// Error logging
casper.on("error", function(msg) {
	casper.log("error: " + msg, "warning");
});
casper.on("page.error", function(msg) {
	casper.log("page.error: " + msg, "warning");
});

// Devuelve la direccion del i-esimo dia de la semana
function getUrlForDay(i) {
	if (i < 0 || i > 6) throw new Error("Weekday out of bounds");
	i += 5; // La semana del 19 de abril de 2015
	return "http://www.eps.uam.es/nueva_web/lab_libres.php?anno=2015&mes=10&dia="+i;
}

var timetable = {};

function inject_name_normalizer() {
	// Hacemos algunos reemplazados elegidos a mano
	// para normalizar los nombres de las asignaturas
	var replacements = [
		[ /Clase de /g                                        	, ""       	],
		[ /master/i                                           	, ""       	],
		[ "Practicas Calculo Numerico II"                     	, "CALNUM2"	],
		[ "Curso Citius: Programacion Visual Basic"           	, "CITIUS" 	],
		[ "Desarrollo Aplicaciones Dispositivos Moviles"      	, "DADM"   	],
		[ "Curso In-Company del CFC"                          	, "CCFC"   	],
		[ "Examen Filtros"                                    	, "FILTROS"	],
		//[ "Multimedia"                                      	, "MM"     	],
		[ "Tecnicas Analisis Secuencias Video Videovigilancia"	, "TASVV"  	],
		[ "Curso Formacion Docente"                           	, "CFD"    	],
		[ "Proyecto de Programacion"                          	, "PPROG"  	],
		[ "PPROG-2122"                                        	, "PPROG"  	],
		[ "Programacion II"                                   	, "PROG2"  	],
		[ "Moodle 2.0: Actividades"                           	, "MOODLE2"	],
		[ "Introductory on R"                                 	, "INTRO R"	],
		[ "Evidencia Digital"                                 	, "EVIDIG" 	],
	];
	window.normalizeActivityName = function(str) {
		replacements.forEach(function(rep) {
			str = str.replace(rep[0], rep[1]);
		});
		return str;
	};
}

casper.start();
// Iteramos por os dias de la semana
casper.each([1, 2, 3, 4, 5], function(self, i) {

	// Abrimos la pagina
	casper.thenOpen(getUrlForDay(i), function() {
		casper.log("Visitando la pagina del dia " + i, "info");

		// Guardamos
		casper.evaluate(inject_name_normalizer);
		var dailyData = casper.evaluate(function() {
			// Llamamos a la variable igual dentro, es la que devolveremos
			var dailyData = [];

			// Por cada laboratorio ...
			$("table.tabladatos > tbody > tr").slice(0, 22).each(function() {
				var self = $(this);

				// Su nombre
				var labName = self.children(".lab")
					.text()
					.replace("Laboratorio ", "") // Quitamos el prefijo
					.replace(/\(.*$/, "") // Quitamos del parentesis al final
					.replace(/8-([AB])/g, "8$1") // Quitamos el guion del 8-A y 8-B
					.toLowerCase()
					.trim();

				// Unificacion de los laboratorios 3, 4 y 7
				if (labName.match(/[347][b]/)) return;
				if (labName.match(/[347][a]/)) labName = labName.replace("a", "");

				// Extraemos el horario
				var timetable = self.children(".hora").map(
					function() {
						var self = $(this);
						if (!self.hasClass("ocupada")) return false;
						var activity = self.attr("title").match(/-> (.+)/);
						if (null === activity)  {
							throw new Error("Could not extract activity");
						}
						// Normalizamos el nombre de la actividad y lo devolvemos
						return window.normalizeActivityName(activity[1]).trim();
					}
				).get();

				// Rellenamos la estructura del dia
				dailyData.push({
					id       : labName,
					schedule : timetable
				});
			});

			// Devolvemos la estructura rellena
			return dailyData;
		});

		timetable[i] = dailyData;
	});
});

// Escribir los datos a fichero
casper.then(function() {
	casper.log("Escribiendo los datos a fichero ...", "info");
	fs.write("timetable.json", JSON.stringify(timetable/*, null, 2*/), "w");

	casper.log("Terminado! Cerrando casperjs.", "info");
	setTimeout(function() { casper.exit(); }, 0);
});

casper.run();
