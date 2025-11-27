INSERT INTO terox.usuarios (
    username,
    password_hash,
    email,
    nombre)
    VALUES ('leo', '$2b$10$v1xa5hA7RdBGwSJgDVIl6eZ49SJSTRt0n4xzDqhovDjJeISk/OyOC', 'pepe@gmail.com', 'Pepe Van Houten'),
	('cristiano', '$2b$10$bf2hoLg5GLF7X6//pV/sHeyDX4IQ3CKRBykK/Xxj1YwY14ObbUrrW','pipo@yahoo.com','Lionel Messi');

/*la contraseña de leo es messi, la de cristiano es ronaldo*/

INSERT INTO terox.identidad_fiscal (
	cuil,
	username,
	nombre_completo,
	domicilio_fiscal)
	VALUES (20304050607, 'leo', 'Pepe Van Houten', 'Calle Falsa 123, Springfield'),
	(211, 'cristiano', 'Lionel Messi', 'Avenida Siempreviva 742, Springfield');

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
