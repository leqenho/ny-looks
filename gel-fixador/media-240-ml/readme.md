# Enviroment para Tailwind

## Este é o env disponibilizado pela Coty para o desenvolvimento das LPS com Tailwind. 

### Como usar:
- Rode o comando "npm i -D" para instalar as dependências nececessárias
- Rode o comando "npm start" para iniciar o monitoramento na alteração de arquivos (e suas respectivas compilações). 
- O comando acima também abre uma aba no navegador com "hot reload" (atualiza sozinho).
- Sempre antes de fazer um push pro branch, rode o comando "npm run deploy" para criar a pasta dist (produção).
- OBS: Pode dar uns erros em vermelho, mas se funcionar tá tudo ok, já veio assim.

### Para criar seus própios estilos:
- Use o arquivo "styles.css" presente na pasta "css_src/"
- Esse arquivo é compilado minificado e purificado (com as classes não usadas removidas) no arquivo "styles.min.css" presente na pasta "css/"
- Embora seja possível criar seus própios estilos, isso é em ultimo caso, tenha sempre preferências pelas classes do tailwind.


### Sobre o Tailwind:
- Segundo eles, foi escolhido pela agilidade no desenvolvimento.
- A forma mais fácil para aprender sobre ele é consultar o site que tem uma vasta documentação. [Você encontra o site aqui!](https://tailwindcss.com/)


### Para trabalhar com o repositório (independente de Tailwind):
- Verifique se já existe um branch para a marca da Matriz (exemplo: brand_bozzano, brand_monange, brand_risque, ...)
- Se não existir, crie um no formato: brand_nomedamarca (onde brand_ é um prefixo), caso houver, pule essa etapa.
- Crie uma pasta com uma palavra key para a matriz utilizada. Dentro dessa pasta, crie uma pasta para cada desdobramento (exemplo: matriz: produtos-barbear -> desdobramentos: creme-barbear e espuma-barbear)
- Dentro das pastas de desdobramento, deve estar contido todo o código source das lps, com o comando de produção já rodado.
- Quando a LP for aprovada, faça um merge no branch all( git checkout all -> git merge brand_nomedamarca -> git push -u origin all -> git checkout branch_nomedamarca (pra voltar pro seu branch) )

### Outras instruções:
- Mantenha o arquivo .editorconfig. Foi solicitado por eles para alinhar a identação de código, entre outras coisas, com os projetos deles.