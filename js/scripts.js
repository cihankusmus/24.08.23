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
        <div class="col-md-10 col-lg-8 col-xl-7">
            
            <h2 class="section-heading">${post.data.attributes.title}</h2>
            <h4>${post.data.attributes.summary}</h4>
            <div class="content">
                <p>${post.data.attributes.content}<p>
            </div>
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
                        <a href="post.html#/${post.id}">
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

const commentForm = document.querySelector('.comment form');

// endpoint

// async ibaresini eklediğimizde çalışması devam eden isteklerimizin sonuçlanmasını bekleyebiliyoruz
// beklememiz gereken isteklere de await ekliyoruz
async function loadData() {
    let post = await fetch('http://localhost:1337/api/posts/1').then(x => x.json());
    let comments = await fetch('http://localhost:1337/api/comments?sort=createdAt&filters[post][id][$eq]=' + post.data.id).then(x => x.json());

    
    contentEl.innerHTML += `<hr>`; // olmasa da olur
    contentEl.innerHTML += `<h3 class="post">Yorumlar:</h3>`;

    for(const comment of comments.data) {
        contentEl.innerHTML += `<p class="post">${comment.attributes.name} ${new Date(comment.attributes.createdAt).toLocaleString('tr')} tarihinde demiş ki: <br> ${comment.attributes.comment}</p>`;
    }
}

function appendNewComment(commentData) {
    contentEl.innerHTML += `<p>${commentData.data.attributes.name} demiş ki: <br> ${commentData.data.attributes.comment}</p>`;
}

commentForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(commentForm);
    const formObj = Object.fromEntries(formData);
    formObj.post = 1;
    
    fetch('http://localhost:1337/api/comments', {
        method: 'POST',
        body: JSON.stringify({data: formObj}),
        headers: {
            "Content-Type": "application/json"
        }
    }).catch(function() {
        alert('gönderilemedi');
    }).then(function(response) {
        return response.json();
    }).then(function(responseData) {
        appendNewComment(responseData);
        commentForm.reset();
    });
});

loadData();

changeRoute();