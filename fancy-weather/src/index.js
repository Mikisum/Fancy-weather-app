
const elementToTranslate = document.querySelectorAll('[data-i18n]');
const search = document.getElementById('search');
const changeLanguageButton = document.getElementById('languageButton');
const languageButton = document.querySelectorAll('.dropdown-item');

const languages = {
    EN : "en.json",
    RU : "ru.json",
    BE : "be.json",
}
function translate(lang) {
    return fetch(languages[lang])
            .then(res => res.json())
            .then(langFile => {
                elementToTranslate.forEach(element => {
                element.textContent = langFile[element.dataset.i18n];
                });
                search.setAttribute("placeholder", langFile['search']);
            });
}

document.addEventListener('click', (event) => {
    if (event.target.closest('.dropdown-item')) {
        languageButton.forEach(el => el.classList.remove('active'));
            event.target.classList.add('active');
            changeLanguageButton.innerText = event.target.innerText;
            translate(changeLanguageButton.innerText);
    }
});

