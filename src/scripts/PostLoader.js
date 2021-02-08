class PostLoader {
  constructor() {
    this.form = document.querySelector('.search');
    this.searchField = this.form.querySelector('.search__input');
    this.searchFilters = Array.from(this.form.querySelectorAll('.search__filter'));

    this.articleList = document.querySelector('.article-list');
    this.articleModal = document.querySelector('.article-modal');
    this.articleModalClose = document.querySelector('.article-modal__close');
    this.articleModalTitle = document.querySelector('.article-modal__title');
    this.articleModalContent = document.querySelector('.article-modal__content');
    this.articleModalOverlay = document.querySelector('.article-modal__overlay');
    this.postPreviousId = 0;

    this.currentFilters = [];
    this.prevQuery = '';

    this.observer = undefined;
    this.posts_per_page = 6;
    this.posts = [];
    this.timer = 0;

    this.createObserver();
    this.events();
  }

  events(){
    this.form.addEventListener('change', (e) => this.handleFilterUpdate(e));
    this.form.addEventListener('submit', (e) => e.preventDefault());
    this.searchField.addEventListener('keyup', () => this.handleKeyPress());
    document.addEventListener('click', (e) => this.handleClick(e));
    document.addEventListener('keydown', (e) => this.handleKeyEscape(e));
  }

  createObserver() {
    const target = document.getElementById('section-notes');

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.0
    };

    this.observer = new IntersectionObserver(this.handleLoadData.bind(this), options);
    this.observer.observe(target);
  };

  handleLoadData(entries, target) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadData();
        this.observer.disconnect();
      }
    });
  }

  loadData(){
    fetch('https://developersojourn.site/wp-json/content/posts')
      .then(res => res.json())
      .then(posts => {
        const firstLoadPosts = posts.slice(0, this.posts_per_page);
        this.renderPosts(firstLoadPosts);
        this.posts = posts;
      })
      .catch(console.error);
  }

  handleKeyPress(){
    // Prevent unnecessary queries if input value hasn't changed
    if (this.previousSearchTerm !== this.searchField.value){
      clearTimeout(this.timer);

      // if search field is empty no results should show at all
      // if (!this.searchField.value) return;

      // Fail-safe in case data wasn't loaded earlier for some reason.
      if (!this.posts) this.loadData();

      this.previousSearchTerm = this.searchField.value;
      this.timer = setTimeout(() => {
        const filtered = this.filterPosts();
        this.renderPosts(filtered);
      }, 500);
    }
  }

  handleKeyEscape(e) {
    if (e.keyCode === 27) {
      this.closeModal();
    }
  }

  handleClick(e) {

    if (e.target.postId) {
      return this.handleRenderPost(e.target.postId);
    }

    if (
      e.target.className.includes('article-modal__close') ||
      e.target.className.includes('article-modal__overlay')
    ) {
      return this.closeModal();
    }

  }

  handleFilterUpdate(e) {
    if (e.target.type === 'checkbox') {

      this.currentFilters = this.searchFilters.reduce((acc, val) => {
        return val.checked ? [...acc, val.id] : acc;
      }, []);
    }

    const filtered = this.filterPosts();
    this.renderPosts(filtered);
  }

  handleRenderPost(id) {

    if (id === this.postPreviousId) {
      return this.openModal();
    }

    const { title, content } = this.posts.find(post => post.id === id);

    this.articleModalTitle.textContent = title;
    this.articleModalContent.innerHTML = '';
    this.articleModalContent.insertAdjacentHTML('beforeend', content);
    this.previousId = id;

    this.openModal();
  }

  openModal() {
    this.articleModal.classList.add('article-modal--active');
    this.articleModalClose.classList.add('article-modal__close--active');
    this.articleModalOverlay.classList.add('article-modal__overlay--active');
    document.body.classList.add('no-overflow');
  }

  closeModal() {
    this.articleModal.classList.remove('article-modal--active');
    this.articleModalClose.classList.remove('article-modal__close--active');
    this.articleModalOverlay.classList.remove('article-modal__overlay--active');
    document.body.classList.remove('no-overflow');
  }

  filterPosts() {
    const query   = this.searchField.value.trim().toLowerCase();
    const filters = this.currentFilters;

    return this.posts.filter(({ title, excerpt, tags }) => {
      const queryMatch = (
        title.toLowerCase().includes(query) ||
        excerpt.toLowerCase().includes(query)
      );
      const filterMatch = filters.length ? filters.some(f => tags.includes(f)) : true;

      return queryMatch && filterMatch;
    });
  }

  renderPosts(posts) {
    if (!posts) {
      posts = this.posts.slice(0, this.posts_per_page);
      return;
    }

    this.articleList.innerHTML = '';
    posts.forEach(post => {
      const article = document.createElement('article');
      article.className = 'article-list__item';
      article.postId = post.id;

      const h3 = document.createElement('h3');
      h3.className = 'article-list__title';
      h3.innerText = post.title;

      article.appendChild(h3);
      this.articleList.appendChild(article);
    });
  }
}

export default PostLoader;
