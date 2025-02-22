create database if not exists consiliacion;
use consiliacion;
create table if not exists rol(id_rol smallint(1) primary key auto_increment,detalle varchar(250),estado smallint(1) default 1);
create table if not exists usuario(id_usuario varchar(50) primary key not null,nombre varchar(250),
                     fk_id_rol smallint(1),
                     pass varchar(250),estado smallint(1) default 1);
create table if not exists cuenta_bancaria(id_cuenta varchar(50) primary key,banco varchar(250),
                             tipo_cuenta smallint(1),saldo_inicial decimal(10,2) default 0.00,
                             estado smallint(1) default 1);
create table if not exists tipo_transaccion(id_tipo_transaccion smallint(1) primary key auto_increment,detalle varchar(250),estado smallint(1) default 1);
create table if not exists transacciones_bancarias(id_transaccion int primary key auto_increment,
                           fk_id_cuenta varchar(50),fecha datetime,monto decimal(10,2),
                           fk_tipo_transaccion smallint(1),
                           referencia varchar(250),estado smallint(1) default 1);
create table if not exists tipo_registro_contable(id_tipo_registro_contable int primary key auto_increment,detalle varchar(250),
                                    estado smallint(1) default 1);
create table if not exists registros_contables(id_registros_contables int primary key auto_increment,
                           fk_id_cuenta_bancaria varchar(50),fecha datetime,descripcion varchar(250),
                           monto decimal(10,2) default 0.00,fk_id_tipo int);

create table if not exists tipo_discrepancia(id_tipo_discrepancia int primary key auto_increment,
                                             detalle varchar(250),estado smallint(1) default 1);

create table if not exists conciliaciones(id_conciliaciones int primary key auto_increment,
                           fk_id_cuenta varchar(50),fecha_conciliacion datetime,
                           saldo_banco decimal(10,2) default 0.00,saldo_contable decimal(10,2) default 0.00,
                           fk_usuario varchar(50),diferencia decimal(10,2) default 0.00,
                           estado smallint(1) comment '1->PENDIENTE .. 2 -> CONSOLIDADO ... 3 -> REVISADO');

create table if not exists detalles_conciliacion(id_detalles_conciliacion int primary key auto_increment,
                           fk_id_conciliacion int,fk_transacciones_bancarias int,fk_registros_contables int,
                           fk_tipo_discrepancia int,monto_discrepante decimal(10,2) default 0.00,
                           solucion varchar(250),estado smallint(1) default 1);

create table if not exists auditorias_conciliacion(id_auditorias_conciliacion int primary key auto_increment,
                           fk_id_conciliacion int,fecha_auditoria datetime,resultado varchar(250),
                           fk_id_usuario varchar(50));

create trigger update_saldo_cuenta_bancaria after insert on transacciones_bancarias for each row
    begin
        if new.fk_tipo_transaccion = 1 then
            update cuenta_bancaria set saldo_inicial = saldo_inicial - new.monto where id_cuenta = new.fk_id_cuenta;
        end if;

        if new.fk_tipo_transaccion = 2 then
            update cuenta_bancaria set saldo_inicial = saldo_inicial + new.monto where id_cuenta = new.fk_id_cuenta;
        end if;

    end;

alter table usuario add constraint rel_usuario_rol foreign key usuario(fk_id_rol) references rol(id_rol);
alter table transacciones_bancarias add constraint re_transacciones_bancarias_tipo
    foreign key transacciones_bancarias(fk_tipo_transaccion) references tipo_transaccion(id_tipo_transaccion);
alter table transacciones_bancarias add constraint re_transacciones_bancarias_cuenta
    foreign key transacciones_bancarias(fk_id_cuenta) references cuenta_bancaria(id_cuenta);
alter table registros_contables add constraint rel_registros_contables_tipo foreign key
    registros_contables(fk_id_tipo) references tipo_registro_contable(id_tipo_registro_contable);
alter table registros_contables add constraint rel_registros_contables_cuenta foreign key
    registros_contables(fk_id_cuenta_bancaria) references cuenta_bancaria(id_cuenta);

alter table detalles_conciliacion add constraint rel_detalles_conciliacion_conciliacion
    foreign key detalles_conciliacion(fk_id_conciliacion) references conciliaciones(id_conciliaciones);

alter table detalles_conciliacion add constraint rel_detalles_conciliacion_rc
    foreign key detalles_conciliacion(fk_registros_contables) references registros_contables(id_registros_contables);

alter table detalles_conciliacion add constraint rel_detalles_conciliacion_td
    foreign key detalles_conciliacion(fk_tipo_discrepancia) references tipo_discrepancia(id_tipo_discrepancia);

alter table detalles_conciliacion add constraint rel_detalles_conciliacion_tb
    foreign key detalles_conciliacion(fk_transacciones_bancarias) references transacciones_bancarias(id_transaccion);

alter table auditorias_conciliacion add constraint rel_auditorias_conciliacion_c
    foreign key auditorias_conciliacion(fk_id_conciliacion) references conciliaciones(id_conciliaciones);

alter table auditorias_conciliacion add constraint rel_auditorias_conciliacion_user
    foreign key auditorias_conciliacion(fk_id_usuario) references usuario(id_usuario);

create trigger update_saldo_cuenta_bancaria
    after insert
    on transacciones_bancarias
    for each row
begin
        if new.fk_tipo_transaccion = 1 then
            update cuenta_bancaria set saldo_inicial = saldo_inicial - new.monto where id_cuenta = new.fk_id_cuenta;
        end if;

        if new.fk_tipo_transaccion = 2 then
            update cuenta_bancaria set saldo_inicial = saldo_inicial + new.monto where id_cuenta = new.fk_id_cuenta;
        end if;

    end;



select * from tipo_discrepancia;





