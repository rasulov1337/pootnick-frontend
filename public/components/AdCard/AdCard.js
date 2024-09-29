'use strict';

class AdCard {
    constructor(data, parent) {
        this.data = data
        this.parent = parent;

        this.data.mainPicture = data.pictures[0]
        this.currentImgIndex = 0
        this.circles = []

        if (parent === undefined || parent === null) {
            console.log("Wrong parent!")
        }
    }

    render() {
        const template = Handlebars.templates['AdCard.hbs']
        this.parent.innerHTML += template(this.data)

        this.parent.querySelector('.fav-btn').addEventListener('click', this.addToFavorite)

        setTimeout(() => {
            this.addImageScrolling()
        }, 0)  // setTimeout ensures the code will be called AFTER browser finished rendering innerHTML new content
    }

    addImageScrolling() {
        const thisElement = this.parent.querySelector(`#card-${this.data.id}`)
        const imageContainer = thisElement.querySelector('.ad-images-container');
        const imagePaginationDiv = thisElement.querySelector('.image-pagination-div');
        const imgElem = imageContainer.firstElementChild;

        const imagesAmount = Math.min(this.data.pictures.length, 7)  // We must only show max amount of 7!
        const areaFraction = imageContainer.getBoundingClientRect().width / imagesAmount

        for (let i = 0; i < imagesAmount; i++) {
            const circle = document.createElement('div');
            circle.classList.add('circle')
            this.circles.push(circle)
            imagePaginationDiv.appendChild(circle)
        }

        imageContainer.addEventListener('mousemove', (e) => this.onMouseMove(e, areaFraction, imgElem))
        imageContainer.addEventListener('mouseout', () => this.onMouseOut(imgElem))

        this.makeCircleActive(0)
    }

    onMouseMove(e, areaFraction, imgElem) {
        const rect = e.target.getBoundingClientRect()
        const x = e.clientX - rect.left
        if (x < 0)
            return

        const toShowIndex = Math.floor(x / areaFraction)
        if (toShowIndex === this.currentImgIndex) {
            return
        }

        this.makeCircleActive(toShowIndex)
        this.currentImgIndex = toShowIndex
        imgElem.src = this.data.pictures[toShowIndex]
    }

    onMouseOut(imgElem) {
        this.makeCircleActive(0)
        this.currentImgIndex = 0
        imgElem.src = this.data.pictures[0]
    }

    makeCircleActive(index) {
        this.circles[this.currentImgIndex].classList.remove('circle-fill')
        this.circles[index].classList.add('circle-fill')
    }

    addToFavorite() {
        console.log("fav btn was clicked!")
    }
}

export default AdCard;