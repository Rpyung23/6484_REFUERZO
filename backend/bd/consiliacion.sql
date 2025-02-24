drop database if exists consiliacion;
create database if not exists consiliacion;
use consiliacion;
create table if not exists rol(id_rol smallint(1) primary key auto_increment,detalle varchar(250),estado smallint(1) default 1);
create table if not exists usuario(id_usuario varchar(50) primary key not null,nombre varchar(250),
                     fk_id_rol smallint(1),
                     pass varchar(250),estado smallint(1) default 1);
create table if not exists cuenta_bancaria(id_cuenta varchar(50) primary key,banco varchar(250),
                             tipo_cuenta smallint(1),saldo_inicial decimal(10,2) default 0.00,
                             estado smallint(1) default 1);

create table if not exists transacciones_bancarias(id_transaccion varchar(50) not null primary key,
                           fk_id_cuenta varchar(50),fecha datetime,monto decimal(10,2),
                           fk_tipo_transaccion smallint(1),
                           referencia varchar(250),estado smallint(1) default 1);
create table if not exists tipo_registro_contable(id_tipo_registro_contable int primary key auto_increment,detalle varchar(250),
                                    estado smallint(1) default 1);
create table if not exists registros_contables(id_registros_contables int primary key auto_increment,
                           fk_id_cuenta_bancaria varchar(50),fecha datetime,descripcion varchar(250),
                           monto decimal(10,2) default 0.00,fk_id_tipo int);

create table if not exists conciliaciones(id_conciliaciones int primary key auto_increment,
                           fk_id_cuenta varchar(50),fecha_conciliacion datetime,
                           saldo_banco decimal(10,2) default 0.00,saldo_contable decimal(10,2) default 0.00,
                           fk_usuario varchar(50),diferencia decimal(10,2) default 0.00,
                           estado smallint(1) comment '1->PENDIENTE .. 2 -> CONSOLIDADO ... 3 -> REVISADO');

create table if not exists detalles_conciliacion(id_detalles_conciliacion int primary key auto_increment,
                           fk_id_conciliacion int,fk_transacciones_bancarias varchar(50),fk_registros_contables int,
                           monto_discrepante decimal(10,2) default 0.00,
                           solucion varchar(250),estado smallint(1) default 1);

create table if not exists auditorias_conciliacion(id_auditorias_conciliacion int primary key auto_increment,
                           fk_id_conciliacion int,fecha_auditoria datetime,resultado varchar(250),
                           fk_id_usuario varchar(50));

alter table registros_contables add column estado smallint(1) default 1;
alter table conciliaciones add column fechaI date not null ;
alter table conciliaciones add column fechaF date not null ;
alter table usuario add column cel varchar(50);
alter table conciliaciones add column name_conciliacion varchar(250);

alter table usuario add constraint rel_usuario_rol foreign key usuario(fk_id_rol) references rol(id_rol);
alter table transacciones_bancarias add constraint re_transacciones_bancarias_cuenta
    foreign key transacciones_bancarias(fk_id_cuenta) references cuenta_bancaria(id_cuenta);
alter table registros_contables add constraint rel_registros_contables_cuenta foreign key
    registros_contables(fk_id_cuenta_bancaria) references cuenta_bancaria(id_cuenta);

alter table detalles_conciliacion add constraint rel_detalles_conciliacion_conciliacion
    foreign key detalles_conciliacion(fk_id_conciliacion) references conciliaciones(id_conciliaciones);

alter table detalles_conciliacion add constraint rel_detalles_conciliacion_rc
    foreign key detalles_conciliacion(fk_registros_contables) references registros_contables(id_registros_contables);

#aqui
alter table detalles_conciliacion add constraint rel_detalles_conciliacion_tb
    foreign key detalles_conciliacion(fk_transacciones_bancarias) references transacciones_bancarias(id_transaccion);

alter table auditorias_conciliacion add constraint rel_auditorias_conciliacion_c
    foreign key auditorias_conciliacion(fk_id_conciliacion) references conciliaciones(id_conciliaciones);

alter table auditorias_conciliacion add constraint rel_auditorias_conciliacion_user
    foreign key auditorias_conciliacion(fk_id_usuario) references usuario(id_usuario);

create trigger update_saldo_cuenta_bancaria
    after insert
    on registros_contables
    for each row
begin
        if new.fk_id_tipo = 1 then
            update cuenta_bancaria set saldo_inicial = saldo_inicial + new.monto where id_cuenta = new.fk_id_cuenta_bancaria;
        end if;

        if new.fk_id_tipo = 2 then
            update cuenta_bancaria set saldo_inicial = saldo_inicial - new.monto where id_cuenta = new.fk_id_cuenta_bancaria;
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

        insert into detalles_conciliacion(fk_id_conciliacion,fk_registros_contables,fk_transacciones_bancarias,
                                  monto_discrepante, solucion, estado)
        values (idConciliacion,v_id,null,0,'',1);

        -- O podrías insertar el valor en una tabla temporal, etc.
    END LOOP;

    -- Cerrar el cursor
    CLOSE cur1;

end;

create trigger trigger_post_insert AFTER INSERT ON conciliaciones FOR EACH ROW
    begin
        call registro_detalle_consolidado(NEW.id_conciliaciones,new.fechaI,new.fechaF);
    end;

CREATE PROCEDURE actualizar_detalle_conciliacion(
    IN idContable INT,
    IN idConciliacion INT,
    IN id_transccion VARCHAR(50)
)
BEGIN
    DECLARE monto_bancario DECIMAL(10,2) DEFAULT 0;
    DECLARE monto_contable DECIMAL(10,2) DEFAULT 0;

    -- Manejador que se ejecuta ante cualquier excepción SQL
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 300 AS estado;
    END;

    START TRANSACTION;

    SET monto_bancario = (
      SELECT TB.monto
      FROM transacciones_bancarias AS TB
      WHERE TB.id_transaccion = id_transccion
    );

    SET monto_contable = (
      SELECT RC.monto
      FROM registros_contables AS RC
      WHERE RC.id_registros_contables = idContable
    );

    UPDATE detalles_conciliacion
    SET fk_transacciones_bancarias = id_transccion,
        monto_discrepante = (monto_contable - monto_bancario)
    WHERE id_detalles_conciliacion = idConciliacion;

    COMMIT;

    SELECT 200 AS estado;
END;


-- SQL INSERT --
INSERT INTO rol (id_rol, detalle, estado) VALUES (1, 'Administrador', 1);
INSERT INTO rol (id_rol, detalle, estado) VALUES (2, 'Contador', 1);
INSERT INTO rol (id_rol, detalle, estado) VALUES (3, 'Auditor', 1);
INSERT INTO rol (id_rol, detalle, estado) VALUES (4, 'Gerente', 1);

insert into usuario(id_usuario, nombre, fk_id_rol, pass) VALUES ('admin','Administrador',1,MD5('12345678'));
insert into usuario(id_usuario, nombre, fk_id_rol, pass) VALUES ('contador','Contador',2,MD5('12345678'));
insert into usuario(id_usuario, nombre, fk_id_rol, pass) VALUES ('auditor','Auditor',3,MD5('12345678'));
insert into usuario(id_usuario, nombre, fk_id_rol, pass) VALUES ('gerente','Gerente',4,MD5('12345678'));

select * from conciliaciones where estado = 1;

select DC.fk_id_conciliacion,TB.id_transaccion,RC.monto monto_contable,TB.monto as monto_bancario,DC.monto_discrepante,RC.estado
       from detalles_conciliacion as DC inner join registros_contables as RC
       on RC.id_registros_contables = DC.fk_registros_contables
       left join transacciones_bancarias as TB on DC.fk_transacciones_bancarias
       = TB.id_transaccion where DC.estado = 1 and DC.fk_id_conciliacion = 9;

call actualizar_detalle_conciliacion(0,0,'');
update conciliaciones set estado = 2 where id_conciliaciones = 100;














