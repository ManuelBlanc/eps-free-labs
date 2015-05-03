# ¿Qué laboratorio esta libre?

Esta pequeña web muestra que laboratorios de la [EPS] estan disponibles en un gráfico que imita la disposición espacial de estos.

Los datos son extraidos de la página de [laboratorios libres][labs_libres] usando CasperJS. Se aplican algunas substituciones sobre los nombres de las asignaturas para acotarlos y que haya más consistencia.

Estos datos se presentan con jQuery, usando Bootstrap para mayor portabilidad y un diseño responsivo.

Para ver otra hora hora y/o día, añade `/?day=WD&hour=HH` al final de la URL, donde

* `WD` es el dia de la semana y esta entre 1 (Lunes) y 5 (Viernes).
* `HH` es el número de horas desde las 9:00 AM.

El favicon de la pagina es un icono del set [Silk de FamFamFam][silk], (en concreto, `application_osx_terminal`).

[labs_libres]: http://www.eps.uam.es/nueva_web/lab_libres.php
[eps]: www.ii.uam.es/
[silk]: http://www.famfamfam.com/lab/icons/silk/

### Creditos

Programado por ManuelBlanc, con ayuda para probarlo e ideas de Ana, Danis, Lara y Saras.

### Licencia

Todo el contenido esta bajo la GPLv2. Vease el fichero [LICENSE](LICENSE).
