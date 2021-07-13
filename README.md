Este é um servidor nodejs express back-end do projeto investfy cujo o frontend está em
https://github.com/Gilson401/investify

Como usar:

É necessário ter um servidor postgre à disposição para efetuar os registros do usuário
Crie um bd com o nome postgre , user postgre e senha conforme escolha. Ou pode escolher outras definições de nome de usuário e de banco
registrando no arquivo app\config\db.config.js

Faça o dowmload deste projeto
Rode npm install
execute o script server

O servidor estará disponível em localhost porta 3005

As rotas para este servidor são
/auth para fazer o login
/user para cadastro de usuário e get usuário
/piada para obter as piadas a serem exibidas no front end

