class PostLoader {
  constructor() {
    this.menu = document.querySelector('.search');
    this.form = document.querySelector('.search__form');
    this.searchField = this.form.querySelector('.search__input');
    this.searchFilters = Array.from(this.form.querySelectorAll('.search__filter'));

    this.toggler = document.querySelector('.blog-header__search');
    this.closeBtn = document.querySelector('.search__close');
    this.searchResults = document.querySelector('.search__results');
    // this.articleModal = document.querySelector('.article-modal');
    // this.articleModalClose = document.querySelector('.article-modal__close');
    // this.articleModalOverlay = document.querySelector('.article-modal__overlay');
    this.resultTitle = document.querySelector('.result__title');
    this.resultContent = document.querySelector('.result__content');
    this.postPreviousId = 0;

    this.currentFilters = [];
    this.prevQuery = '';

    // this.observer = undefined;
    this.posts_per_page = 6;
    this.posts = [];
    this.timer = 0;

    // this.createObserver();
    this.events();
  }

  events(){
    this.form.addEventListener('change', (e) => this.handleFilterUpdate(e));
    this.form.addEventListener('submit', (e) => e.preventDefault());
    this.searchField.addEventListener('keyup', () => this.handleKeyPress());
    this.toggler.addEventListener('click', () => this.openModal());
    this.closeBtn.addEventListener('click', () => this.closeModal());
    document.addEventListener('keydown', (e) => this.handleKeyEscape(e));
  }

  toggleVisibility() {
    this.menu.classList.toggle('search__show');
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
      return this.toggleVisibility();
    }

    const { title, content } = this.posts.find(post => post.id === id);

    this.resultTitle.textContent = title;
    this.resultContent.innerHTML = '';
    this.resultContent.insertAdjacentHTML('beforeend', content);
    this.previousId = id;

    // this.openModal();
    this.toggleVisibility();
  }

  openModal() {
    this.menu.classList.add('search__show');
    this.searchField.focus();
  }

  closeModal() {
    this.menu.classList.remove('search__show');
    this.searchField.blur();
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

    this.searchResults.innerHTML = '';
    posts.forEach(post => {
      const li = document.createElement('li');
      li.className = 'search__result';
      li.postId = post.id;

      const article = document.createElement('article');

      const h3 = document.createElement('h3');
      h3.className = 'result__title';
      h3.innerText = post.title;

      article.appendChild(h3);
      li.appendChild(article);
      this.searchResults.appendChild(li);
    });
  }
}

export default PostLoader;
