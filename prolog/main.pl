:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_files)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/html_write)).

% ------------------------------------------------------------------
%  Handlers
% ------------------------------------------------------------------
:- http_handler(root(.),              http_reply_from_files('.', [index('index.html')]), [prefix]).
:- http_handler(root(buscar),         buscar_handler,               []).
:- http_handler(root(prestamos),      pagina_prestamos_handler,     []).
:- http_handler(root(buscar_prestamos), buscar_prestamos_handler,   []).

% ------------------------------------------------------------------
%  Arranque del servidor
% ------------------------------------------------------------------
iniciar :- http_server(http_dispatch, [port(8080)]).

% ------------------------------------------------------------------
%  Base de datos: herramientas
% ------------------------------------------------------------------
herramienta(t001, 'Multimetro',              15, 12, 2, 1).
herramienta(t002, 'Pinzas',                  20, 15, 4, 1).
herramienta(t003, 'Destornillador plano',    30, 25, 3, 2).
herramienta(t004, 'Destornillador de cruz',  30, 26, 3, 1).
herramienta(t005, 'Llave Nuda',              18, 14, 2, 2).
herramienta(t006, 'Taladro',                 8,   6, 1, 1).
herramienta(t007, 'Cautin',                  12,  9, 2, 1).
herramienta(t008, 'Extractor de poleas',     6,   5, 1, 0).
herramienta(t009, 'Brida de 4 patas',        10,  8, 1, 1).
herramienta(t010, 'Cinta aislante',          50, 40, 7, 3).
herramienta(t011, 'Clavones de fierro',      5,   4, 1, 0).
herramienta(t012, 'Llave allen',             25, 20, 3, 2).
herramienta(t013, 'Juego de dados',          10,  9, 1, 0).
herramienta(t014, 'Pistola de calor',        7,   6, 1, 0).
herramienta(t015, 'Martillo',                20, 18, 2, 0).
herramienta(t016, 'Chupones de manguera',    20, 18, 2, 0).

% ------------------------------------------------------------------
%  Base de datos: préstamos
% ------------------------------------------------------------------
:- dynamic prestamo/7.
%  prestamo(ID, NumCtrl, Alumno, Herramienta, FechaPrest, Estado, FechaDevol)

prestamo(1,  '21451234', 'Juan Pérez',        'Martillo',            '2025-06-25', 'En curso', '').
prestamo(2,  '21456789', 'Ana López',         'Multímetro digital',  '2025-06-28', 'Devuelto',  '2025-06-30').
prestamo(3,  '21459876', 'Carlos Torres',     'Destornillador',      '2025-06-27', 'Devuelto',  '2025-06-29').
prestamo(4,  '21457654', 'Laura Medina',      'Pinzas',              '2025-06-29', 'En curso', '').
prestamo(5,  '21450987', 'Miguel Ángel',      'Llave inglesa',       '2025-07-01', 'En curso', '').
prestamo(6,  '21451111', 'Sofía Castro',      'Cinta métrica',       '2025-07-02', 'Devuelto',  '2025-07-05').
prestamo(7,  '21452222', 'Roberto Jiménez',   'Nivel láser',         '2025-07-03', 'En curso', '').
prestamo(8,  '21453333', 'Elena Ruiz',        'Sierra manual',       '2025-07-04', 'Devuelto',  '2025-07-07').
prestamo(9,  '21454444', 'David Mendoza',     'Osciloscopio',        '2025-07-05', 'En curso', '').
prestamo(10, '21455555', 'Patricia Núñez',    'Generador de señales','2025-07-06', 'Devuelto',  '2025-07-09').

% ------------------------------------------------------------------
buscar_handler(Request) :-
    http_parameters(Request, [ q(Query, [optional(true), default('')]) ]),
    buscar_herr(Query, Res),
    reply_html_page( title('Resultado de búsqueda'),
                     \pagina_resultado_herr(Query, Res) ).

pagina_resultado_herr(Q,R) -->
    html([ h1('Resultado de la búsqueda de herramientas'),
           p(['Término buscado: ', Q]),
           pre(R),
           p(a([href='/'], 'Volver al inicio')) ]).

buscar_herr('', 'Por favor escribe un término para buscar.').
buscar_herr(Busq, Res) :-
    string_lower(Busq, Normal),
    herramienta(Clave, Nombre, Tot, Buen, Reg, Mal),
    string_lower(Nombre, NL), string_lower(Clave, CL),
    ( sub_string(NL, _,_,_, Normal) ; sub_string(CL, _,_,_, Normal) ),
    format(string(Res),
           "~w\nClave: ~w\nCantidad total: ~d\nBuen estado: ~d\nRegular: ~d\nMal estado: ~d",
           [Nombre,Clave,Tot,Buen,Reg,Mal]), !.
buscar_herr(_, 'No se encontró información sobre esa herramienta.').

% ------------------------------------------------------------------


pagina_prestamos_handler(_Request) :-
    reply_html_page( title('Buscar Préstamos'),
                     \form_busq_prestamos ).

form_busq_prestamos -->
    html([ h1('Buscar en registros de préstamos'),
           form([action='/buscar_prestamos', method='GET'], [
               p(['ID del préstamo: ', input([name=id,          type=number])]),
               p(['Nombre del alumno: ',  input([name=nombre,     type=text])]),
               p(['Herramienta: ',       input([name=herramienta,type=text])]),
               p(['Fecha (YYYY-MM-DD): ',input([name=fecha,      type=text])]),
               p(input([type=submit, value='Buscar']))
           ])
         ]).

% ------------------------------------------------------------------
%  MANEJADOR /buscar_prestamos
% ------------------------------------------------------------------
buscar_prestamos_handler(Rq) :-
    % Recibimos todos los parámetros como ÁTOMOS
    http_parameters(Rq, [
        id(IdA,                [optional(true), default('')]),
        nombre(NomA,           [optional(true), default('')]),
        herramienta(HerrA,     [optional(true), default('')]),
        fecha(FechaA,          [optional(true), default('')])
    ]),
    % Convertimos átomo -> string para reutilizar la lógica
    maplist(atom_string,
            [IdA, NomA, HerrA, FechaA],
            [IdS, NomS, HerrS, FechaS]),
    interpretar_busqueda(IdS, NomS, HerrS, FechaS, Resultado),
    reply_html_page( title('Resultados de búsqueda'),
                     \mostrar_res_prestamos(IdS, NomS, HerrS, FechaS, Resultado) ).

mostrar_res_prestamos(Id,Nom,Herr,Fecha,Res) -->
    html([ h1('Resultados de la búsqueda de préstamos'),
           p(['ID: ',Id, br,
              'Nombre: ',Nom, br,
              'Herramienta: ',Herr, br,
              'Fecha: ',Fecha]),
           pre(Res),
           p(a([href='/'], 'Volver al formulario')) ]).

% ------------------------------------------------------------------
%  BÚSQUEDA DE PRÉSTAMOS (lógica)
% ------------------------------------------------------------------
%  Conversión segura de string a número
safe_number_string(N,S) :- catch(number_string(N,S), _, fail).

interpretar_busqueda(IdStr, Nom, Herr, Fecha, Res) :-
    (   IdStr \= '',
        safe_number_string(IdNum, IdStr),
        prestamo(IdNum, NumC, Alumno, Herram, FPrest, Est, FDev)
    ->  format(string(Res),
            "📄 ID: ~w\nAlumno: ~w\nNúmero de control: ~w\nHerramienta: ~w\nFecha de préstamo: ~w\nEstado: ~w\nFecha de devolución: ~w",
            [IdNum,Alumno,NumC,Herram,FPrest,Est,FDev])

    ;   Nom \= ''                 ->  buscar_por(nombre,      Nom,     Res)
    ;   Herr \= ''                ->  buscar_por(herramienta, Herr,    Res)
    ;   Fecha \= ''               ->  buscar_por(fecha,       Fecha,   Res)
    ;   Res = '⚠️ No se ingresó ningún dato para buscar.'
    ).

buscar_por(nombre, Nombre, Res) :-
    findall(Txt,
        (   prestamo(Id,Nc,Nombre,H,F,Es,Dv),
            format(string(Txt),
                "📄 ID: ~w\nAlumno: ~w\nNúmero de control: ~w\nHerramienta: ~w\nFecha: ~w\nEstado: ~w\nDevolución: ~w\n\n",
                [Id,Nombre,Nc,H,F,Es,Dv]) ),
        L),
    ( L \= [] -> atomic_list_concat(L,'',Res)
    ; format(string(Res),'⚠️ No se encontraron préstamos para: ~w',[Nombre]) ).

buscar_por(herramienta, Herr, Res) :-
    findall(Txt,
        (   prestamo(Id,Nc,Al,Herr,F,Es,Dv),
            Herr = Herr,  % igualdad textual exacta
            format(string(Txt),
                "📄 ID: ~w\nAlumno: ~w\nNúmero de control: ~w\nHerramienta: ~w\nFecha: ~w\nEstado: ~w\nDevolución: ~w\n\n",
                [Id,Al,Nc,Herr,F,Es,Dv]) ),
        L),
    ( L \= [] -> atomic_list_concat(L,'',Res)
    ; format(string(Res),'⚠️ No se encontraron préstamos con herramienta: ~w',[Herr]) ).

buscar_por(fecha, Fecha, Res) :-
    findall(Txt,
        (   prestamo(Id,Nc,Al,H,Fecha,Es,Dv),
            format(string(Txt),
                "📄 ID: ~w\nAlumno: ~w\nNúmero de control: ~w\nHerramienta: ~w\nFecha: ~w\nEstado: ~w\nDevolución: ~w\n\n",
                [Id,Al,Nc,H,Fecha,Es,Dv]) ),
        L),
    ( L \= [] -> atomic_list_concat(L,'',Res)
    ; format(string(Res),'⚠️ No se encontraron préstamos con fecha: ~w',[Fecha]) ).
