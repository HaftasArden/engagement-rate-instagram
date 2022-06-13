# Author

🙆‍♂️ Haftas Arden<br>
📧 haftasarden@proton.me<br>
🐦 https://twitter.com/HaftasArden

# Requisitos
É necessário ter em seu computador:

 - Node v18 ou superior
 - Permissão de escrita e leitura na pasta onde os serão executados
 - Inscrição e chave de acesso na API https://rapidapi.com/arraybobo/api/instagram-scraper-2022/

# Configuração

Informe as variáveis de ambiente. Abra o arquivo `.env` e informe as credenciais da API *instagram-scraper-2022*

![image](https://user-images.githubusercontent.com/70228662/173392101-51b59c71-6a36-4f8f-aafd-013b86fbce7e.png)

# Executar

Primeiro, é necessário extrair os 20 primeiros. Para isso, execute o código abaixo em seu terminal:

```bash
node ./generate_json.js juliette
```

Após extração, basta executar este código para realizar o cálculo

```bash
 node ./calculate_rate.js juliette
```

A saída será semelhante a esta:

```jsonc
{
  rate: 1.0293575246948898, /** Taxa de engajamento */
  likes_per_post: 339963.25, /** Média de likes por postagem */
  comments_per_post: 8056.6 /** Média de comentários por postagem */
}
```
