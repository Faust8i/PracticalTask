# PracticalTask

Решение по реализации задачи: https://github.com/kisilya/test-tasks/tree/main/nodeJS


Установка на свой VDS (я использовал timeweb.com).

Требования:

0. Ubuntu (в моем случае v.22)
1. Node.JS + NPM
2. PostgreSQL
3. Git
4. nginx
5. Домен

Проверка и установка.

0. Ubuntu
  - можно поставить при инициализации VDS.
1. Node.JS
  - проверка:  node -v  
  - установка: curl -sL https://deb.nodesourse.com/setup_12.x | sudo -E bash -
               sudo apt install nodejs
1а. NPM
  - проверка:  npm -- version
  - установка: apt install npm
2. PostgreSQL
  - установка: sudo apt install postgresql postgresql-contrib
    (https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-22-04)
3. Git
  - проверка:  git --version
  - установка: sudo apt-get install git
4. nginx
  - проверка:  systemctl status nginx
  - установка: sudo apt install nginx
5. Домен
  - В контрольной панели VDS посмотрите адрес (в моем случае было 1004371-ct64575.tmweb.ru). После запуска приложения это будет сайт.
  Можно создать поддомен, тогда нужна будет и А-запись DNS на переадресацию с него на IP сервера. Плюс скорректировать конфиг nginx.

Копирование пакета разработки.

1. Перейти в нужную для хранения приложения директорию с помощью команды cd и там выполнить
  - mkdir apps, перейти в нее
  - git clone https://github.com/Faust8i/PracticalTask.git
2. Перейти в папку PracticalTask и установить зависимости
  - npm i

Подготовка БД.
  
Перейти в папку проекта и выполнить 
  * db-migrate up initialize

Подготовка БД (план Б), если БД не создалась миграцией.

  * sudo -i -u postgres
  * psql

  * CREATE ROLE user1 WITH LOGIN PASSWORD '1Qwerty!';
  * ALTER ROLE user1 CREATEDB;
  * ALTER ROLE user1 Superuser;
  * CREATE DATABASE NodeJsExam;
  * \c nodejsexam
  * CREATE TABLE users (uid UUID PRIMARY KEY DEFAULT gen_random_uuid(), email VARCHAR(100), password VARCHAR(100), nickname VARCHAR(30));
  * CREATE TABLE tags (id SERIAL PRIMARY KEY, creator UUID, name VARCHAR(40), sortOrder INT);
  * CREATE TABLE usertag (id SERIAL PRIMARY KEY, user_uid UUID, tag_id INT);
  
  * \q
  * su root

Запуск приложения (закроется при выходе из терминала).

Перейдите в директорию PracticalTask и запустите
  - node index.js

Видео инструкция: https://www.youtube.com/watch?v=Qu-oyzWIpjI&t=838s