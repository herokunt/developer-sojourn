class Modal {
  constructor() {
    this.projectList = document.querySelector('.projects');
    this.modal = document.querySelector('.project-modal');
    this.modalClose = document.querySelector('.project-modal__close');
    this.modalTitle = document.querySelector('.project-modal__title');
    this.modalPreview = document.querySelector('.project-modal__preview');
    this.modalContent = document.querySelector('.project-modal__content');
    this.modalOverlay = document.querySelector('.project-modal__overlay');
    this.isOpen = false;
    this.events();
  }

  events(){
    this.projectList.addEventListener('click', e => this.loadModal(e));
    this.modal.addEventListener('click', e => this.handleClick(e));
    document.addEventListener('keydown', e => this.handleKeyEscape(e));
  }

  loadModal(e){
    if (e.target.className === 'project__title') {
      fetch('project_data3.json')
        .then(response => response.json())
        .then(data => {
          const project = e.target.dataset.project;
          this.modalTitle.innerHTML = data[project].title;
          this.modalPreview.innerHTML = data[project].preview;
          this.modalContent.innerHTML = data[project].content;
          this.openModal();
        })
        .catch(console.error);
    }
  }

  handleKeyEscape(e) {
    if (this.isOpen && e.keyCode === 27) {
      this.closeModal();
    }
  }

  handleClick(e) {
    if (
      e.target.className.includes('project-modal__close') ||
      e.target.className.includes('project-modal__overlay')
    ) {
      return this.closeModal();
    }
  }

  openModal() {
    this.isOpen = true;
    this.modal.classList.add('project-modal--active');
    this.modalClose.classList.add('project-modal__close--active');
    this.modalOverlay.classList.add('project-modal__overlay--active');
    document.body.classList.add('no-overflow');
  }

  closeModal() {
    this.isOpen = false;
    this.modal.classList.remove('project-modal--active');
    this.modalClose.classList.remove('project-modal__close--active');
    this.modalOverlay.classList.remove('project-modal__overlay--active');
    this.modalTitle.innerHTML = '';
    this.modalContent.innerHTML = '';
    document.body.classList.remove('no-overflow');
  }
}

export default Modal;
