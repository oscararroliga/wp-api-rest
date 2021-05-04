    const d = document,
    $site = d.getElementById("site"),
    $posts = d.getElementById("posts"),
    $loader = d.querySelector(".loader"),
    $template = d.getElementById("post-template").content,
    $fragment = d.createDocumentFragment(),
    DOMAIN = "https://dietadelhuevo.com",
    SITE = `${DOMAIN}/wp-json`,
    API_WP = `${SITE}/wp/v2`,
    POSTS = `${API_WP}/posts?_embed`,
    PAGES =  `${API_WP}/pages`,
    CATEGORIES = `${API_WP}/categories`;

    function getSiteData(){
        fetch(SITE)
        .then(res=>res.ok ? res.json() : Promise.reject(res))
        .then(json=>{
            console.log(json);
            $site.innerHTML= `
            <div class= col-12 container bg-warning text-light text-center p-3 fs-6 >
            <div class="container text-center text-light">
            <h2>
            <a style="color:white; text-decoration:none;" href="${json.url}" target="_blank">${json.name}</a>
            </h2>
            </div>
            <p>${json.description}</p>
            <p>${json.timezone_string}</p>
            </div>`;
        })
        .catch(err=>{
            console.log(err);
            let message = err.statusText || "Chanfle, al parecer este sitio tiene bloqueada la API REST de WordPress";
            $site.innerHTML = `<p>Error ${err.status}: ${message} </p>`;
        })
    }
    function getPosts(){
        fetch(POSTS)
        .then(res=>res.ok ? res.json() : Promise.reject(res))
        .then(json=>{
            console.log(json);

            json.forEach(el => {
                let categories="";

                el._embedded["wp:term"][0].forEach(el=>categories+=`<li>${el.name}</li>`);

                $template.querySelector(".post-image").src = el._embedded["wp:featuredmedia"][0].source_url;
                $template.querySelector(".post-title").innerHTML = el.title.rendered;
                $template.querySelector(".post-date").innerHTML = new Date(el.date).toLocaleString();
                $template.querySelector(".post-link").href=el.link;
                $template.querySelector(".post-excerpt").innerHTML=el.excerpt.rendered;
                $template.querySelector(".post-categories").innerHTML=`
                <p>Categorias:</p>
                ${categories}
                `;
                $template.querySelector(".post-content>article").innerHTML = el.content.rendered;

                let $clone = d.importNode($template, true);
                $fragment.appendChild($clone);
            });

            $posts.appendChild($fragment);
            $loader.style.display ="none";
        })
        .catch(err=>{
            console.log(err);
            let message = err.statusText || "Chanfle, al parecer este sitio tiene bloqueada la API REST de WordPress";
            $posts.innerHTML = `<p>Error ${err.status}: ${message} </p>`;
        })
    }

    d.addEventListener("DOMContentLoaded", e=>{
        getSiteData();
        getPosts();
    });