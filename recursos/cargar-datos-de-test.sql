INSERT INTO terox.productos (
    nombre,
    precio,
    stock,
    descripcion,
    usuario_id)
    VALUES ('Big Dipper', '20', '1', 'Goma Pegajosa de Tenis de Mesa, con tecnología MaxTense', 1),
    ('Battle 2 National', '25', '3', 'Goma de Tenis de Mesa para jugadores ofensivos, con tecnología MaxTense', 1),
    ('Jupiter 3 Asia', '30', '2', 'Goma de Tenis de Mesa para jugadores ofensivos, con tecnología MaxTense y topsheet asiático', 1);

INSERT INTO terox.imagenes (
    producto_id,
    url)
    VALUES
    (1, 'big_dipper.avif'),
    (2, 'battle_2_national.avif'),
    (3, 'jupiter3-asia.png');


INSERT INTO terox.usuarios (
    username,
    password_hash,
    email,
    nombre)
    VALUES ('leo', '$2b$10$v1xa5hA7RdBGwSJgDVIl6eZ49SJSTRt0n4xzDqhovDjJeISk/OyOC', 'pepe@gmail.com', 'Pepe Van Houten');

/*la contraseña de leo es messi*/
