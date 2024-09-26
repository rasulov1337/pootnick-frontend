'use strict';

export class Header {
    constructor(headerCallbacks){
        this.menuContainer = document.createElement('header');

        this.iconContainer = document.createElement('div');
        this.hrefs = document.createElement('div');
        this.nameContainer = document.createElement('div');
        this.signsContainer = document.createElement('div');
        this. buttonContainer = document.createElement('div');

        this.iconContainer.classList.add('icon');
        this.hrefs.classList.add('header-hrefs');
        this.nameContainer.classList.add('name');
        this.signsContainer.classList.add('signs');
        this.buttonContainer.classList.add('entry-button');

        this.menuContainer.appendChild(this.iconContainer);
        this.menuContainer.appendChild(this.hrefs);
        this.menuContainer.appendChild(this.nameContainer);
        this.menuContainer.appendChild(this.signsContainer);
        this.menuContainer.appendChild(this.buttonContainer);

        this.config = {
            menu: {
                Main : {
                    'href': '/dashboard',
                    'text': 'Главная',
                    'callback': headerCallbacks.mainPage
                },
                Map : {
                    'href': '/map',
                    'text': 'Карта',
                    'callback': headerCallbacks.mapPage
                },
                Articles : {
                    'href': '/articles',
                    'text': 'Статьи',
                    'callback': headerCallbacks.articlesPage
                }
            },

            signs: {
                Messages: {
                    'src': './images/svg/messages.svg',
                    'href': '/messages',
                },
                Favorites: {
                    'src': './images/svg/favorites.svg',
                    'href': '/favorites'
                },
                Notifications: {
                    'src': './images/svg/notifications.svg',
                    'href': '/notifications'
                }
            }
        }

        this.headerState = {
            activePageLink: null,
            headerElements: {}
        }

        this.render()
    }

    renderIcon() {
        const imgElement = document.createElement('img');
        imgElement.src="./images/icon.jpg"
        imgElement.width = 100;
        imgElement.height = 100;
        this.iconContainer.appendChild(imgElement);
    }

    renderMainText() {
        const imgElement = document.createElement('img');
        imgElement.src = './images/name.png';
        imgElement.width = 200;
        imgElement.height = 60;
        this.nameContainer.appendChild(imgElement);
    }

    renderHrefs() {
        Object.entries(this.config.menu).forEach(([key, {href, text, callback}], index)=>{
            const menuElement = document.createElement('a');
            menuElement.href = href;
            menuElement.text = text;
            menuElement.addEventListener('click', (e) => {
                e.preventDefault()
                callback()
            })
            menuElement.classList.add('hrefs')

            if (index === 0) {
                menuElement.classList.add('active-href');
                this.headerState.activePageLink = menuElement;
            }

            this.headerState.headerElements[key] = menuElement;
            this.hrefs.appendChild(menuElement);
        });
    }

    renderSigns() {
        Object.entries(this.config.signs).forEach(([_, {href, src}])=>{
            const signElement = document.createElement('a');
            signElement.href = href;
            signElement.innerHTML = `<img src="${src}" width="30" height="30">`;

            this.signsContainer.appendChild(signElement);
        })
    }

    renderButton() {
        const button = document.createElement('button');
        button.textContent = "Войти!";
        this.buttonContainer.appendChild(button);
    }

    render() {
        this.renderIcon();
        this.renderHrefs();
        this.renderMainText();
        this.renderSigns();
        this.renderButton();
    }

    getMainContainer() {
        return this.menuContainer
    }

}
