const apiKey = 'vJfMj2OXvh_uUuwC6SOFlqXifjTxkvhl6OVishubNUw';
const maxImages = 12;
let currentPage = 1;
let lastPage = 0;
const searchBtn = document.getElementById('searchBtn');

searchBtn.onclick = makeSearch;

async function searchUnsplash(searchQuery) {
    const endpoint = `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=${maxImages}&page=${currentPage}&client_id=${apiKey}`;
    const resp = await fetch(endpoint);
    if (!resp.ok) {
        console.log('an error occured');
        return;
    }
    const json = await resp.json();
    return json;
}
async function makeSearch() {
    const searchText = document.getElementById('searchInput').value;
    const response= await searchUnsplash(searchText);
    let htmlContent = '';
    response.results.forEach(eResp => {
        const url = eResp.urls.small;
        const unsplashLink = eResp.links.html;
        const photographer = eResp.user.name;
        const photographerPage = eResp.user.links.html;

        htmlContent += `
        <div>
            <a href='${unsplashLink}' targer="_blank">
            <div class='result-item' style='background-image: url(${url})'></div>
            </a>
            <p class= 'photographer-name'>
            <a href='${photographerPage}' target='_blank'>Photo by ${photographer}</a>
            </p>
        </div>`
    });
    lastPage = response.total_pages;
    const imageContainer= document.getElementById('imageContainer');
    imageContainer.innerHTML = htmlContent;
    
    const infoPara = document.getElementById('infoPara');
    infoPara.innerText = `About ${response.total} results found`;

    const countInfoPara = document.getElementById('countInfoPara');
    let startPoint = ((currentPage - 1) * maxImages)+1;
    let endPoint = maxImages * currentPage;

    countInfoPara.innerText = `${startPoint}-${endPoint} of page ${currentPage}`;
    updateBtnState();
}
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

nextBtn.onclick = nextPage;
prevBtn.onclick = prevPage;

function updateBtnState() {
    nextBtn.classList.remove('hidden');
    if (currentPage >= lastPage) {
        nextBtn.classList.add('hidden');
    }
    prevBtn.classList.remove('hidden');
    if (currentPage == 1) {
        prevBtn.classList.add('hidden');
    }
}

function nextPage() {
    if (lastPage < currentPage) return;
    currentPage++;
    makeSearch();
}
function prevPage() {
    if (currentPage == 1) return;
    currentPage--;
    makeSearch();
}