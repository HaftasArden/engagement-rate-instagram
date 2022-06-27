require('dotenv').config({ path: `${__dirname}/.env` });

const fs = require('fs/promises');
const path = require('path');

const [_, __, instagram_user] = process.argv;
const pathUser = path.resolve(__dirname, 'data', instagram_user)


/**
 * Captura o total de seguidores do usuário
 * 
 * @param {string} date 
 * 
 * @returns {Promise<number>} Total de seguidores
 */
async function getTotalFollowers(date) {
    const content = await fs.readFile(path.resolve(pathUser, date, 'user.json'), 'utf-8');
    const data = JSON.parse(content);

    return data.follower_count;
}

/**
 * Ler o arquivo gerado por "./generate_json" e realiza o cálculo
 * 
 * @param {string} date 
 * 
 * @returns {Promise<Object>}
 */
async function calculeRateByDate(date) {
    const filePosts = path.resolve(pathUser, date, 'posts.json');
    const fileUser = path.resolve(pathUser, date, 'user.json');

    const fp = [
        fs.readFile(filePosts),
        fs.readFile(fileUser)
    ];

    return Promise.all(fp)
        .then(async (result) => {
            const dataPosts = JSON.parse(result[0]);
            const dataUser = JSON.parse(result[1]);

            const total_followers = await getTotalFollowers(date);



            /**
             * Realiza uma média da taxa de enjamento das 20 postagens mais recentes
             * 
             * ((total de comentários + total de likes) / número de seguidores * 100) / 20)
             * 
             * Se o usuário tiver menos de 20 postagens, realiza o cálculo o total capturada
             * */
            return {
                rate: dataPosts.reduce((a, b) => a + ((b.totals.comments + b.totals.likes) / total_followers * 100), 0) / dataPosts.length,
                likes_per_post: dataPosts.reduce((a, b) => a + b.totals.likes, 0) / dataPosts.length,
                comments_per_post: dataPosts.reduce((a, b) => a + b.totals.comments, 0) / dataPosts.length,

                followers: dataUser.follower_count,

                most: {
                    liked: dataPosts.sort((a, b) => a.totals.likes < b.totals.likes ? 1 : -1).at(0),
                    commented: dataPosts.sort((a, b) => a.totals.comments < b.totals.comments ? 1 : -1).at(0)
                },
                
                less: {
                    liked: dataPosts.sort((a, b) => a.totals.likes > b.totals.likes ? 1 : -1).at(0),
                    commented: dataPosts.sort((a, b) => a.totals.comments > b.totals.comments ? 1 : -1).at(0)
                }
            };
        })
        .then((result) => {
            result.rate = Number.parseFloat(result.rate.toFixed(2));
            result.likes_per_post = Math.floor(result.likes_per_post);
            result.comments_per_post = Math.floor(result.comments_per_post);

            return result;
        })
}

function getMostLikesAndComments(posts) {
    let likes = { shortcode: '', total: 0 };
    let comments = { shortcode: '', total: 0 };

    for (const post of posts) {
        const shortcode = post['most'].liked.shortcode;

        if (likes.total < post['most'].liked.totals.likes) {
            likes = { shortcode, total: post['most'].liked.totals.likes };
        }

        if (comments.total < post['most'].liked.totals.comments) {
            comments = { shortcode, total: post['most'].liked.totals.comments };
        }
    }

    return {
        likes,
        comments
    }
}

async function getLessLikesAndComments(posts) {
    const likes = {};
    const comments = {};

    for (const post of posts) {
        likes[post.less.liked.shortcode] = {
            shortcode: post.less.liked.shortcode,
            total: Math.max(post.less.liked.totals.likes, likes[post.less.liked.shortcode]?.total ?? 0)
        };

        if (post.less.liked.shortcode === 'CeycJCHuQ8e') console.log( { a: post.less.liked.totals.likes, b: likes[post.less.liked.shortcode]?.total ?? 0 } )
    }

    const lessLike = Object.values(likes).sort((prev, cur) => prev.total < cur.total ? -1 : 1).at(0)
    const lessCommented = Object.values(comments).sort((prev, cur) => prev.total < cur.total ? -1 : 1).at(0)

    return {
        likes: lessLike,
        comments: lessCommented
    }
}

(async () => {
    const dates = await fs.readdir(pathUser);
    const by_date = {};

    for (const date of dates) {
        if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            by_date[date] = await calculeRateByDate(date);
        }
    }

    let avgRate = 0;
    let avgLikesPerPost = 0;
    let avgCommentsPerPost = 0;

    const by_date_values = Object.values(by_date);

    for (const date of by_date_values) {
        avgRate += date.rate;
        avgLikesPerPost += date.likes_per_post;
        avgCommentsPerPost += date.comments_per_post;
    }

    const avgLength = by_date_values.length;

    const most = await getMostLikesAndComments(by_date_values);
    const less = await getLessLikesAndComments(by_date_values);

    const general = {
        rate: (avgRate / avgLength).toFixed(2),
        likes_per_post: (avgLikesPerPost / avgLength).toFixed(2),
        comments_per_post: (avgCommentsPerPost / avgLength).toFixed(2),
        followers: by_date_values.sort((prev, cur) => prev.followers < cur.followers ? -1 : 1).at(0).followers
    }

    console.log(JSON.stringify({
        general,
        most,
        less,
        by_date
    }, null, 4))
})();

/**
 * Nota
 * 
 * O código do cálculo pode ser otimizado para melhor entendimento; no entanto,
 * há uma perda de aprox. 3,89%.
 * 
 * console.log({
 *  rate: Object.values(values).reduce((prev, cur) => prev + cur.rate, 0) / valuesLength,
 *  likes_per_post: Object.values(values).reduce((prev, cur) => prev + cur.likes_per_post, 0) / valuesLength,
 *  comments_per_post: Object.values(values).reduce((prev, cur) => prev + cur.comments_per_post, 0) / valuesLength,
 * })
 * 
 * 126803.71 ops/ ± 0,49%
 * 3,89% slower
 */