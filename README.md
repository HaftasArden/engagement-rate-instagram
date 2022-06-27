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
  "general": {
    "rate": "0.54",                   /** Taxa de engajamento em % */
    "likes_per_post": "66191.00",     /** Média de likes por postagem */
    "comments_per_post": "1722.00",   /** Média de comentários por postagem */
    "followers": 12499409             /** Número de seguidores */
  },
  "by_date": {
    "2022-06-27": {
      "rate": 0.54,
      "likes_per_post": 66191,
      "comments_per_post": 1722,
      "followers": 12499409,
      "most": {
        "liked": {
          "id": "0123456789",
          "display_url": "https://example.com/cover.jpg",
          "shortcode": "HaftasArden",
          "is_video": false,
          "totals": {
            "comments": 0,
            "likes": 392762,
            "views": 0
          }
        },
        "commented": {
          "id": "0123456789",
          "display_url": "https://example.com/cover.jpg",
          "shortcode": "HaftasArden",
          "is_video": true,
          "totals": {
            "comments": 8968,
            "likes": 64477,
            "views": 2887544
          }
        }
      },
      "less": {
        "liked": {
          "id": "0123456789",
          "display_url": "https://example.com/cover.jpg",
          "shortcode": "HaftasArden",
          "is_video": false,
          "totals": {
            "comments": 0,
            "likes": 392762,
            "views": 0
          }
        },
        "commented": {
          "id": "0123456789",
          "display_url": "https://example.com/cover.jpg",
          "shortcode": "HaftasArden",
          "is_video": true,
          "totals": {
            "comments": 8968,
            "likes": 64477,
            "views": 2887544
          }
        }
      }
    }
  }
}
```
