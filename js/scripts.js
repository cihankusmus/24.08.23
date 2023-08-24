/*!
* Start Bootstrap - Clean Blog v6.0.9 (https://startbootstrap.com/theme/clean-blog)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-clean-blog/blob/master/LICENSE)
*/
window.addEventListener('DOMContentLoaded', () => {
    let scrollPos = 0;
    const mainNav = document.getElementById('mainNav');
    const headerHeight = mainNav.clientHeight;
    window.addEventListener('scroll', function() {
        const currentTop = document.body.getBoundingClientRect().top * -1;
        if ( currentTop < scrollPos) {
            // Scrolling Up
            if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-visible');
            } else {
                console.log(123);
                mainNav.classList.remove('is-visible', 'is-fixed');
            }
        } else {
            // Scrolling Down
            mainNav.classList.remove(['is-visible']);
            if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-fixed');
            }
        }
        scrollPos = currentTop;
    });
})
const servicePrefix = 'http://localhost:1337/api/posts/';

const contentEl = document.querySelector('.content');

window.addEventListener('hashchange', changeRoute);

function changeRoute() {
    const pageUrl = location.hash.substring(2);
    loadPage(pageUrl);
}

async function loadPage(url) {
    contentEl.innerHTML = 'Yükleniyor';
    if (url === '') {
        loadHomePage();
    } else {
        loadSubPage(servicePrefix + url);
    }
}

async function loadSubPage(url) {
    const post = await fetch(url).then(r => r.json());
    
    contentEl.innerHTML = `
        <div class="post">
            <h3>${post.data.attributes.title}</h3>
            <h4>${post.data.attributes.summary}</h4>
            <div class="content">
                ${post.data.attributes.content}
            </div>
        </div>
        `;
        
}

async function loadHomePage() {
    const posts = await fetch(servicePrefix).then(r => r.json());
    contentEl.innerHTML = '';
    for(const post of posts.data) {
        contentEl.innerHTML += `
        
        <hr class="my-4" />
                    
                    <div class="post-preview">
                        <a href="#/${post.id}" target="_blank">
                            <h2 class="post-title">${post.attributes.title}</h2>
                            <h3 class="post-subtitle">${post.attributes.summary}</h3>
                        </a>
                        <p class="post-meta">
                            Posted by
                            <a href="#!">Start Bootstrap</a>
                            on July 8, 2023
                        </p>
                    </div>
        `;
        document.querySelector(`.post-preview a`).addEventListener('click', () => {
            loadSubPage(servicePrefix + post.id);
        });
    }
    bindPostsClicks();

}

function bindPostsClicks() {
    document.querySelectorAll('.post a').forEach(x => x.addEventListener('click', handleHomepageClicks));
        
}

changeRoute();