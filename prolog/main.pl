:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_files)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/html_write)).

% -------------------------
% Servir archivos estáticos desde el directorio actual
% -------------------------
:- http_handler(root(.), http_reply_from_files('.', [index('index.html')]), [prefix]).
:- http_handler(root(buscar), buscar_handler, []).

% -------------------------
% Iniciar servidor
% -------------------------
iniciar :-
    http_server(http_dispatch, [port(8080)]).

% -------------------------
% Base de datos de herramientas
% -------------------------
herramienta(t001, 'Multimetro', 15, 12, 2, 1).
herramienta(t002, 'Pinzas', 20, 15, 4, 1).
herramienta(t003, 'Destornillador plano', 30, 25, 3, 2).
herramienta(t004, 'Destornillador de cruz', 30, 26, 3, 1).
herramienta(t005, 'Llave Nuda', 18, 14, 2, 2).
herramienta(t006, 'Taladro', 8, 6, 1, 1).
herramienta(t007, 'Cautin', 12, 9, 2, 1).
herramienta(t008, 'Extractor de poleas', 6, 5, 1, 0).
herramienta(t009, 'Brida de 4 patas', 10, 8, 1, 1).
herramienta(t010, 'Cinta aislante', 50, 40, 7, 3).
herramienta(t011, 'Clavones de fierro', 5, 4, 1, 0).
herramienta(t012, 'Llave allen', 25, 20, 3, 2).
herramienta(t013, 'Juego de dados', 10, 9, 1, 0).
herramienta(t014, 'Pistola de calor', 7, 6, 1, 0).
herramienta(t015, 'Martillo', 20, 18, 2, 0).
herramienta(t016, 'Chupones de manguera', 20, 18, 2, 0).

% -------------------------
% Manejador de búsqueda
% -------------------------
buscar_handler(Request) :-
    http_parameters(Request, [q(Query, [optional(true), default('')])]),
    buscar(Query, Resultado),
    reply_html_page(
        title('Resultado de búsqueda'),
        \pagina_resultado(Query, Resultado)
    ).

pagina_resultado(Query, Resultado) -->
    html([
        h1('Resultado de la búsqueda'),
        p(['Término buscado: ', Query]),
        pre(Resultado),
        p(a([href='/'], 'Volver al inicio'))
    ]).

% -------------------------
% Lógica de búsqueda
% -------------------------
buscar('', 'Por favor escribe un término para buscar.') :- !.
buscar(Busqueda, Resultado) :-
    string_lower(Busqueda, Normal),
    herramienta(Clave, Nombre, Total, Buen, Regular, Malo),
    string_lower(Nombre, NombreL), string_lower(Clave, ClaveL),
    (   sub_string(NombreL, _, _, _, Normal)
    ;   sub_string(ClaveL, _, _, _, Normal)
    ),
    format(string(Resultado),
        "~w\nClave: ~w\nCantidad total: ~d\nBuen estado: ~d\nRegular: ~d\nMal estado: ~d",
        [Nombre, Clave, Total, Buen, Regular, Malo]),
    !.
buscar(_, 'No se encontró información sobre esa herramienta.').
