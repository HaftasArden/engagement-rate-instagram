require('dotenv').config();

const fs = require('fs/promises');
const { default: axios } = require('axios');

const [_, __, instagram_user] = process.argv;

/**
 * Captura o total de seguidores do usuário
 * 
 * @returns {number} Total de seguidores
 */
async function getTotalFollowers() {
    const { data } = await axios.get(
        'https://instagram-scraper-2022.p.rapidapi.com/ig/info_username/',
        {
            params: {
                user: instagram_user
            },
            headers: {
                'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
                'X-RapidAPI-Host': process.env.X_RAPIDAPI_HOST,
            }
        }
    );

    return parseInt(data.user.follower_count);
}

/**
 * Ler o arquivo gerado por "./generate_json" e realiza o cálculo
 */
fs.readFile(`${instagram_user}/posts.json`)
    .then(async (content) => {
        const data = JSON.parse(content);

        const total_followers = await getTotalFollowers();

        /**
         * Realiza uma média da taxa de enjamento das 20 postagens mais recentes
         * 
         * ((total de comentários + total de likes) / número de seguidores * 100) / 20)
         * 
         * Se o usuário tiver menos de 20 postagens, realiza o cálculo o total capturada
         * */
        return {
            rate: data.reduce((a, b) => a + ((b.totals.comments + b.totals.likes) / total_followers * 100), 0) / data.length,
            likes_per_post: data.reduce((a, b) => a + b.totals.likes, 0) / data.length,
            comments_per_post: data.reduce((a, b) => a + b.totals.comments, 0) / data.length,
        };
    })
    .then((result) => {
        console.log(result)
    })