const fs = require('fs/promises');
const path = require('path');
const markdownTable = require('text-table')

const [_, __, instagram_user] = process.argv;
const pathUser = path.resolve(__dirname, 'data', instagram_user)

/**
 * Ler todos os posts e captura o número de likes e comentários de cada um deles
 * substituindo o menor pelo maior
 * 
 * @returns {Promise<array>}
 */
async function readPosts() {
    const posts = {};

    const dates = await fs.readdir(pathUser)
        .then((value) => value.filter((date) => date.match(/\d{4}-\d{2}-\d{2}/)))
    
    for (const date of dates) {
        const posts_by_date = await fs.readFile(
            path.resolve('data', instagram_user, date, 'posts.json'),
            'utf-8'
        );

        const posts_parsed = JSON.parse(posts_by_date);

        for (const post of posts_parsed) {
            posts[post.shortcode] = {
                shortcode: post.shortcode,
                total_likes: Math.max(post.totals.likes, posts[post.shortcode]?.total_likes ?? 0),
                total_comments: Math.max(post.totals.comments, posts[post.shortcode]?.total_comments ?? 0),
            }
        }
    }

    return Object.values(posts);
}

/**
 * Gera uma tabela com o ranking dos posts mais curtidos
 * 
 * @param {array} posts Posts lidos por `readPosts`
 * 
 * @returns {string}
 */
function generateRankingLikes(posts) {
    const posts_order_by_likes = posts.sort((prev, cur) => prev.total_likes < cur.total_likes ? 1 : -1)
        .map((value) => ([
            value.shortcode,
            value.total_likes.toLocaleString('pt-br'),
            `[https://instagram.com/p/${value.shortcode}](https://instagram.com/p/${value.shortcode}0)`,
        ]));

    posts_order_by_likes.unshift(['Shortcode', 'Likes', 'Link'], ['----', '----', '----']);

    return markdownTable(posts_order_by_likes, { hsep: ' | ' })
        .split(/\n/)
        .map((line) => `| ${line} |`)
        .join('\n');
}

/**
 * Gera uma tabela com o ranking dos posts mais comentados
 * 
 * @param {array} posts Posts lidos por `readPosts`
 * 
 * @returns {string}
 */
 function generateRankingComments(posts) {
    const posts_order_by_comments = posts.sort((prev, cur) => prev.total_comments < cur.total_comments ? 1 : -1)
        .map((value) => ([
            value.shortcode,
            value.total_comments.toLocaleString('pt-br'),
            `[https://instagram.com/p/${value.shortcode}](https://instagram.com/p/${value.shortcode}0)`,
        ]));

    posts_order_by_comments.unshift(['Shortcode', 'Comments', 'Link'], ['----', '----', '----']);

    return markdownTable(posts_order_by_comments, { hsep: ' | ' })
        .split(/\n/)
        .map((line) => `| ${line} |`)
        .join('\n');
}

(async () => {
    const posts = await readPosts();

    const likes = generateRankingLikes(posts);
    const comments = generateRankingComments(posts);

    console.log('# Ranking by Likes\n')
    console.log(likes)
    console.log('\n')
    console.log('# Ranking by Comments\n')
    console.log(comments)
})();