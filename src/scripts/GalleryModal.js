class GalleryModal {
  constructor() {
    this.galleryList = document.querySelector('.gallery');
    this.galleryModal = document.querySelector('.gallery-modal');
    this.galleryModalClose = document.querySelector('.gallery-modal__close');
    this.galleryModalTitle = document.querySelector('.gallery-modal__title');
    this.galleryModalContent = document.querySelector('.gallery-modal__content');
    this.galleryModalOverlay = document.querySelector('.gallery-modal__overlay');
    this.events();
  }

  events(){
    document.addEventListener('click', (e) => this.handleClick(e));
    document.addEventListener('keydown', (e) => this.handleKeyEscape(e));
    this.galleryList.addEventListener('click', e => this.loadProjectData(e));
  }

  loadProjectData(e) {
    if (!e.target.className.includes('card__title')) return;

    this.galleryModalTitle.textContent = e.target.textContent;
    this.openModal();

    // fetch(url)
    //   .then(res => res.json())
    //   .then((content) => {
    //     this.galleryModalTitle.textContent = e.target.textContent;
    //     this.galleryModalContent.innerHTML = content;
    //     this.openModal();
    //   })
    //   .catch(console.error);

    // const previewThumbnail = e
    //   .target
    //   .parentElement
    //   .parentElement
    //   .querySelector('#preview')
    //   .src;
  }

  handleKeyEscape(e) {
    if (e.keyCode === 27) {
      this.closeModal();
    }
  }

  handleClick(e) {
    if (
      e.target.className.includes('gallery-modal__close') ||
      e.target.className.includes('gallery-modal__overlay')
    ) {
      return this.closeModal();
    }
  }

  openModal() {
    this.galleryModal.classList.add('gallery-modal--active');
    this.galleryModalClose.classList.add('gallery-modal__close--active');
    this.galleryModalOverlay.classList.add('gallery-modal__overlay--active');
    document.body.classList.add('no-overflow');
  }

  closeModal() {
    this.galleryModal.classList.remove('gallery-modal--active');
    this.galleryModalClose.classList.remove('gallery-modal__close--active');
    this.galleryModalOverlay.classList.remove('gallery-modal__overlay--active');
    document.body.classList.remove('no-overflow');
  }
}

export default GalleryModal;
