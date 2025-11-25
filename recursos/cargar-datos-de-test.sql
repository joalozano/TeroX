INSERT INTO terox.usuarios (
    username,
    password_hash,
    email,
    nombre)
    VALUES ('leo', '$2b$10$v1xa5hA7RdBGwSJgDVIl6eZ49SJSTRt0n4xzDqhovDjJeISk/OyOC', 'pepe@gmail.com', 'Pepe Van Houten'),
	('usuario_eliminado', '''$2b$10$v1xa5hA7RdBGwSJgDVIl6eZ49SJSTRt0n4xzDqhovDjJeISk/OyOC$v1xa5hA7RdBGwSJgDVIl6eZ49SJSTRt0n4xzDqhovDjJeISk/OyOC$v1xa5hA7RdBGwSJgDVIl6eZ49SJSTRt0n4xzDqhovDjJeISk/OyOC','NULL','NULL');

/*la contraseña de leo es messi*/

INSERT INTO terox.productos (
    nombre,
    precio,
    stock,
    descripcion,
    username)
    VALUES ('Big Dipper', '20', '1', 'Goma Pegajosa de Tenis de Mesa, con tecnología MaxTense', 'leo'),
    ('Battle 2 National', '25', '3', 'Goma de Tenis de Mesa para jugadores ofensivos, con tecnología MaxTense', 'leo'),
    ('Jupiter 3 Asia', '30', '2', 'Goma de Tenis de Mesa para jugadores ofensivos, con tecnología MaxTense y topsheet asiático', 'leo');

INSERT INTO terox.imagenes (
    producto_id,
    url)
    VALUES
    (1, 'big_dipper.avif'),
    (2, 'battle-2-national.avif'),
    (3, 'jupiter3-asia.png');
