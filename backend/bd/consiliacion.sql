drop database if exists consiliacion;
create database if not exists consiliacion;
use consiliacion;
create table if not exists rol
(
    id_rol  smallint(1) primary key auto_increment,
    detalle varchar(250),
    estado  smallint(1) default 1
);
create table if not exists usuario
(
    id_usuario varchar(50) primary key not null,
    nombre     varchar(250),
    fk_id_rol  smallint(1),
    pass       varchar(250),
    estado     smallint(1) default 1
);
create table if not exists cuenta_bancaria
(
    id_cuenta     varchar(50) primary key,
    banco         varchar(250),
    tipo_cuenta   smallint(1),
    saldo_inicial decimal(10, 2) default 0.00,
    estado        smallint(1)    default 1
);

create table if not exists transacciones_bancarias
(
    id_transaccion      varchar(50) not null primary key,
    fk_id_cuenta        varchar(50),
    fecha               datetime,
    monto               decimal(10, 2),
    fk_tipo_transaccion smallint(1),
    referencia          varchar(250),
    estado              smallint(1) default 1
);
create table if not exists tipo_registro_contable
(
    id_tipo_registro_contable int primary key auto_increment,
    detalle                   varchar(250),
    estado                    smallint(1) default 1
);
create table if not exists registros_contables
(
    id_registros_contables int primary key auto_increment,
    fk_id_cuenta_bancaria  varchar(50),
    fecha                  datetime,
    descripcion            varchar(250),
    monto                  decimal(10, 2) default 0.00,
    fk_id_tipo             int
);

create table if not exists conciliaciones
(
    id_conciliaciones  int primary key auto_increment,
    fk_id_cuenta       varchar(50),
    fecha_conciliacion datetime,
    saldo_banco        decimal(10, 2) default 0.00,
    saldo_contable     decimal(10, 2) default 0.00,
    fk_usuario         varchar(50),
    diferencia         decimal(10, 2) default 0.00,
    estado             smallint(1) comment '1->PENDIENTE .. 2 -> CONSOLIDADO ... 3 -> REVISADO'
);

create table if not exists detalles_conciliacion
(
    id_detalles_conciliacion   int primary key auto_increment,
    fk_id_conciliacion         int,
    fk_transacciones_bancarias varchar(50),
    fk_registros_contables     int,
    monto_discrepante          decimal(10, 2) default 0.00,
    solucion                   varchar(250),
    estado                     smallint(1)    default 1
);

create table if not exists auditorias_conciliacion
(
    id_auditorias_conciliacion int primary key auto_increment,
    fk_id_conciliacion         int,
    fecha_auditoria            datetime,
    resultado                  varchar(250),
    fk_id_usuario              varchar(50)
);

alter table registros_contables
    add column estado smallint(1) default 1;
alter table conciliaciones
    add column fechaI date not null;
alter table conciliaciones
    add column fechaF date not null;
alter table usuario
    add column cel varchar(50);
alter table conciliaciones
    add column name_conciliacion varchar(250);

alter table usuario
    add constraint rel_usuario_rol foreign key usuario (fk_id_rol) references rol (id_rol);
alter table transacciones_bancarias
    add constraint re_transacciones_bancarias_cuenta
        foreign key transacciones_bancarias (fk_id_cuenta) references cuenta_bancaria (id_cuenta);
alter table registros_contables
    add constraint rel_registros_contables_cuenta foreign key
        registros_contables (fk_id_cuenta_bancaria) references cuenta_bancaria (id_cuenta);

alter table detalles_conciliacion
    add constraint rel_detalles_conciliacion_conciliacion
        foreign key detalles_conciliacion (fk_id_conciliacion) references conciliaciones (id_conciliaciones);

alter table detalles_conciliacion
    add constraint rel_detalles_conciliacion_rc
        foreign key detalles_conciliacion (fk_registros_contables) references registros_contables (id_registros_contables);

#aqui
alter table detalles_conciliacion
    add constraint rel_detalles_conciliacion_tb
        foreign key detalles_conciliacion (fk_transacciones_bancarias) references transacciones_bancarias (id_transaccion);

alter table auditorias_conciliacion
    add constraint rel_auditorias_conciliacion_c
        foreign key auditorias_conciliacion (fk_id_conciliacion) references conciliaciones (id_conciliaciones);

alter table auditorias_conciliacion
    add constraint rel_auditorias_conciliacion_user
        foreign key auditorias_conciliacion (fk_id_usuario) references usuario (id_usuario);

create trigger update_saldo_cuenta_bancaria
    after insert
    on registros_contables
    for each row
begin
    if new.fk_id_tipo = 1 then
        update cuenta_bancaria
        set saldo_inicial = saldo_inicial + new.monto
        where id_cuenta = new.fk_id_cuenta_bancaria;
    end if;

    if new.fk_id_tipo = 2 then
        update cuenta_bancaria
        set saldo_inicial = saldo_inicial - new.monto
        where id_cuenta = new.fk_id_cuenta_bancaria;
    end if;

end;

create procedure registro_detalle_consolidado(in idConciliacion int, in fechaI date, in fechaF date)
begin

    DECLARE done INT DEFAULT 0;
    DECLARE v_id INT;


    -- Declaramos el cursor para la consulta
    DECLARE cur1 CURSOR FOR
        SELECT RC.id_registros_contables
        FROM registros_contables AS RC
        WHERE RC.estado = 1
          AND DATE(RC.fecha) BETWEEN fechaI AND fechaF;

    -- Manejador para cuando no se encuentren más registros
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    -- Abrir el cursor
    OPEN cur1;

    read_loop:
    LOOP
        FETCH cur1 INTO v_id;
        IF done THEN
            LEAVE read_loop;
        END IF;

        insert into detalles_conciliacion(fk_id_conciliacion, fk_registros_contables, fk_transacciones_bancarias,
                                          monto_discrepante, solucion, estado)
        values (idConciliacion, v_id, null, 0, '', 1);

        -- O podrías insertar el valor en una tabla temporal, etc.
    END LOOP;

    -- Cerrar el cursor
    CLOSE cur1;

end;

create trigger trigger_post_insert
    AFTER INSERT
    ON conciliaciones
    FOR EACH ROW
begin
    call registro_detalle_consolidado(NEW.id_conciliaciones, new.fechaI, new.fechaF);
end;

CREATE PROCEDURE actualizar_detalle_conciliacion(
    IN idContable INT,
    IN idConciliacion INT,
    IN id_transccion VARCHAR(50)
)
BEGIN
    DECLARE monto_bancario DECIMAL(10, 2) DEFAULT 0;
    DECLARE monto_contable DECIMAL(10, 2) DEFAULT 0;

    -- Manejador que se ejecuta ante cualquier excepción SQL
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SELECT 300 AS estado;
        END;

    START TRANSACTION;

    SET monto_bancario = (SELECT TB.monto
                          FROM transacciones_bancarias AS TB
                          WHERE TB.id_transaccion = id_transccion);

    SET monto_contable = (SELECT RC.monto
                          FROM registros_contables AS RC
                          WHERE RC.id_registros_contables = idContable);

    UPDATE detalles_conciliacion
    SET fk_transacciones_bancarias = id_transccion,
        monto_discrepante          = (monto_contable - monto_bancario)
    WHERE id_detalles_conciliacion = idConciliacion;
    COMMIT;

    SELECT 200 AS estado;
END;

create procedure deleteUsuario(IN usuario varchar(50))
begin
    declare tot_admin int default 0;
    declare is_admin smallint(1) default 0;
    declare estado smallint(3) default 200;

    set is_admin = (select count(*) tot from usuario as U where U.id_usuario = usuario and U.fk_id_rol = 1);
    set tot_admin = (select count(*) tot from usuario as U where U.fk_id_rol = 1 and U.estado = 1);

    if is_admin > 0 then
        # SI ES ADMINISTRADOR
        if tot_admin > 1 then
            update usuario set estado = 0 where id_usuario = usuario;
        else
            set estado = 500;
        end if;
    else
        update usuario set estado = 0 where id_usuario = usuario;
    end if;


    select estado as estado;

end;

create procedure actualizar_contrasena(IN usuario varchar(50))
BEGIN
    DECLARE nueva_contrasena VARCHAR(8);
    DECLARE error_ocurrio INT DEFAULT 0;
    -- Variable para manejar el error

    -- Manejo de errores: Si ocurre un error, esta variable se setea a 1
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
        BEGIN
            SET error_ocurrio = 1;
            ROLLBACK; -- Deshacer cambios si ocurre un error
        END;

    -- Iniciar una transacción
    START TRANSACTION;

    -- Generar la contraseña aleatoria
    SET nueva_contrasena = CONCAT(
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', FLOOR(1 + (RAND() * 62)), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', FLOOR(1 + (RAND() * 62)), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', FLOOR(1 + (RAND() * 62)), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', FLOOR(1 + (RAND() * 62)), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', FLOOR(1 + (RAND() * 62)), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', FLOOR(1 + (RAND() * 62)), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', FLOOR(1 + (RAND() * 62)), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', FLOOR(1 + (RAND() * 62)), 1)
                           );

    -- Actualizar según el tipo de usuario
    UPDATE usuario
    SET pass   = MD5(nueva_contrasena),
        estado = 2
    WHERE id_usuario = usuario;


    -- Verificar si ocurrió un error
    IF error_ocurrio = 0 THEN
        COMMIT; -- Confirmar los cambios si no hubo errores
        SELECT nueva_contrasena AS estado; -- Retornar estado exitoso
    ELSE
        ROLLBACK; -- Deshacer los cambios si hubo errores
        SELECT null AS estado; -- Retornar estado de error
    END IF;
END;

-- SQL INSERT --
INSERT INTO rol (id_rol, detalle, estado)
VALUES (1, 'Administrador', 1);
INSERT INTO rol (id_rol, detalle, estado)
VALUES (2, 'Contador', 1);
INSERT INTO rol (id_rol, detalle, estado)
VALUES (3, 'Auditor', 1);
INSERT INTO rol (id_rol, detalle, estado)
VALUES (4, 'Gerente', 1);

insert into usuario(id_usuario, nombre, fk_id_rol, pass, cel)
VALUES ('admin', 'Administrador', 1, MD5('12345678'), '');
insert into usuario(id_usuario, nombre, fk_id_rol, pass)
VALUES ('contador', 'Contador', 2, MD5('12345678'));
insert into usuario(id_usuario, nombre, fk_id_rol, pass)
VALUES ('auditor', 'Auditor', 3, MD5('12345678'));
insert into usuario(id_usuario, nombre, fk_id_rol, pass)
VALUES ('gerente', 'Gerente', 4, MD5('12345678'));

CREATE TRIGGER trg_after_update_detalles_conciliacion
    AFTER UPDATE
    ON detalles_conciliacion
    FOR EACH ROW
BEGIN

    declare montoBanco decimal(10, 2) default 0;
    declare montoContable decimal(10, 2) default 0;
    declare montoDif decimal(10, 2) default 0;

    if new.fk_transacciones_bancarias is not null then
        SELECT t2.monto_contable_tot,
               t2.monto_bancario_tot,
               (t2.monto_contable_tot - t2.monto_bancario_tot)
        INTO montoContable, montoBanco, montoDif
        FROM (SELECT SUM(t1.monto_contable) AS monto_contable_tot,
                     SUM(t1.monto_bancario) AS monto_bancario_tot
              FROM (SELECT DT.fk_registros_contables,
                           COALESCE(RC.monto, 0) AS monto_contable,
                           DT.fk_transacciones_bancarias,
                           COALESCE(TB.monto, 0) AS monto_bancario
                    FROM detalles_conciliacion AS DT
                             LEFT JOIN registros_contables AS RC
                                       ON DT.fk_registros_contables = RC.id_registros_contables
                             LEFT JOIN transacciones_bancarias AS TB
                                       ON DT.fk_transacciones_bancarias = TB.id_transaccion
                    WHERE DT.estado = 1
                      AND DT.fk_id_conciliacion = OLD.fk_id_conciliacion) AS t1) AS t2;

        update conciliaciones set monto_discrepante = montoDif,saldo_banco = montoBanco,saldo_contable = montoContable where id_conciliaciones = old.fk_id_conciliacion;
    end if;
END;

use consiliacion;
select * from conciliaciones;
select * from cuenta_bancaria;
SELECT * FROM registros_contables;
delete  from detalles_conciliacion;
INSERT conciliaciones(fk_id_cuenta, fecha_conciliacion, fk_usuario, estado,fechaI,fechaF)
   VALUES ('12345678',NOW(),'guaman1579@gmail.com',1,'2025-02-01','2025-02-28');
delete  from transacciones_bancarias;







