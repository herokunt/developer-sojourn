class PostLoader {
  constructor() {
    this.form = document.querySelector('.search');
    this.searchField = this.form.querySelector('.search__input');
    this.searchFilters = Array.from(this.form.querySelectorAll('.search__filter'));
    this.articles = document.querySelector('.articles');

    this.postModal      = document.getElementById('post');
    this.postModalClose = document.getElementById('post__close');
    this.postModalTitle = document.getElementById('post__title');
    this.postModalContent = document.getElementById('post__content');
    this.postPreviousId = 0;

    this.currentFilters = [];
    this.prevQuery = '';

    this.observer = undefined;
    this.posts = [];
    this.timer = 0;

    this.createObserver();
    this.events();
  }

  /**
  * Sets up event listeners to update filters
  * @return {}
  */
  events(){
    this.form.addEventListener('change', (e) => this.handleFilterUpdate(e));
    this.form.addEventListener('submit', (e) => e.preventDefault());
    this.searchField.addEventListener('keyup', () => this.handleKeyPress());
    this.articles.addEventListener('click', (e) => this.handleRenderPost(e));
    this.postModalClose.addEventListener('click', () => this.closeModal());
  }

  /**
  * Creates an observer to lazy load post section data
  * @return {}
  */
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

  /**
  * Checks if target node is intersecting with viewport and loads post data
  * @param  {array} entries Observer's list of observed entries
  * @param  {node}  target  Observer's target node
  * @return {}
  */
  handleLoadData(entries, target) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadData();
        this.observer.disconnect();
      }
    });
  }

  /**
  * Hits an endpoint containing all the posts and assigns it to this.posts
  * @return {}
  */
  loadData(){
    fetch('https://developersojourn.site/wp-json/content/posts')
      .then(res => res.json())
      .then(posts => {
        const firstLoadPosts = posts.slice(0, 6);
        this.renderPosts(firstLoadPosts);
        this.posts = posts;
      })
      .catch(console.error);
  }

  /**
  * Updates text filter and calls the render function. Uses a debounce function.
  * @return {}
  */
  handleKeyPress(){
    // Prevent unnecessary queries if input value hasn't changed
    if (this.previousSearchTerm !== this.searchField.value){
      clearTimeout(this.timer);

      // if search field is empty no results should show at all
      if (!this.searchField.value) return;

      // Fail-safe in case data wasn't loaded earlier for some reason.
      if (!this.posts) this.loadData();

      this.previousSearchTerm = this.searchField.value;
      this.timer = setTimeout(() => {
        const filtered = this.filterPosts();
        this.renderPosts(filtered);
      }, 500);
    }
  }

  /**
  * Updates tag filter and calls the render function.
  * @return {}
  */
  handleFilterUpdate(e) {
    if (e.target.type === 'checkbox') {

      this.currentFilters = this.searchFilters.reduce((acc, val) => {
        return val.checked ? [...acc, val.id] : acc;
      }, []);
    }

    const filtered = this.filterPosts();
    this.renderPosts(filtered);
  }

  handleRenderPost(e) {
    const id = e.target.postId;
    if (!id) return;

    if (id === this.postPreviousId) {
      return this.openModal();
    }

    const { title, content } = this.posts.find(post => post.id === id);
    console.log(this.postModal.lastChild)
    this.postModalTitle.textContent = title;
    this.postModalContent.innerHTML = '';
    this.postModalContent.insertAdjacentHTML('beforeend', content);
    this.previousId = id;

    this.openModal();
  }

  openModal() {
    this.postModal.classList.add('post--active');
    this.postModalClose.classList.add('post__close--active');
    document.body.classList.add('no-overflow');
  }

  closeModal() {
    this.postModal.classList.remove('post--active');
    this.postModalClose.classList.remove('post__close--active');
    document.body.classList.remove('no-overflow');
  }

  /**
  * Uses the text and tags filter to return a filtered array of posts.
  * @return {array} An array of posts that match the filters criteria
  */
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

  /**
  * Renders a list of posts provided as a paremeter
  * @param  {array} posts An array of posts to be rendered to the DOM
  * @return {}
  */
  renderPosts(posts) {
    if (!posts) {
      this.articles.innerHTML = '<p>There are no results</p>';
      return;
    }

    this.articles.innerHTML = '';
    posts.forEach(post => {
      const article = document.createElement('article');
      article.className = 'articles__card';
      article.postId = post.id;
      article.insertAdjacentHTML('beforeend', post.title);
      article.insertAdjacentHTML('beforeend', post.excerpt);
      this.articles.appendChild(article);
    });
  }
}

export default PostLoader;
