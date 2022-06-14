require('dotenv').config({ path: `${__dirname}/.env` });
const fs = require('fs/promises');
const path = require('path');
const Axios = require('axios').default;

const [_, __, instagram_user] = process.argv;
const [ curDate ] = new Date().toISOString().split('T');

const axios = Axios.create({
    baseURL: 'https://instagram-scraper-2022.p.rapidapi.com',
    headers: {
        'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.X_RAPIDAPI_HOST,
    },
    params: {
        user: instagram_user
    }
})

/**
 * Lista 10 postagens do instagram
 * 
 * @param {string} page Token da página
 * 
 * @returns {Promise<array>}
 */
async function listPosts(pageToken = null) {
    if (pageToken === undefined) return [];

    const params = {
        user: instagram_user
    }

    if (pageToken) {
        params.end_cursor = pageToken;
    }

    const { data } = await axios.get(
        'https://instagram-scraper-2022.p.rapidapi.com/ig/posts_username/',
        {
            params,
            headers: {
                'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
                'X-RapidAPI-Host': process.env.X_RAPIDAPI_HOST,
            }
        }
    );

    return data;
}

/**
 * Extraí das informações das postagens
 * 
 * @param  {...array} pages Páginas capturadas na função listPosts
 * 
 * @returns  {array}
 */
async function extractEdges(...pages) {
    const result = [];

    for (const page of pages) {
        result.push(...page.data.user.edge_owner_to_timeline_media.edges)
    }

    return result;
}

(async () => {
    await fs.stat(instagram_user).catch(() => fs.mkdir(instagram_user))

    /** Captura as 10 primeiras postagens */
    const page1 = await listPosts();

    /** Captura as postagens entre 10 e 21 */
    const page2 = await listPosts(page1.data.user.edge_owner_to_timeline_media.page_info?.end_cursor);

    /** Extrai as informações dos posts, retornando os dados das 20 postagens mais recentes */
    const edges = await extractEdges(page1, page2);

    const result = [];

    /** Formata as informações para melhor legibilidade */
    for (const edge of edges) {
        result.push({
            "id": edge.node.id,
            "display_url": edge.node.display_url,
            "shortcode": edge.node.shortcode,
            "totals": {
                "comments": edge.node.edge_media_to_comment.count,
                "likes": edge.node.edge_media_preview_like.count,
                "views": edge.node?.video_view_count ?? 0           /** O número de visualizações dos vídeos é ignorado do cálculo */
            }
        });
    }

    fs.exi

    /** Salva as informações */
    fs.writeFile(`${instagram_user}/posts_original.json`, JSON.stringify(edges));
    fs.writeFile(`${instagram_user}/posts.json`, JSON.stringify(result));
})();