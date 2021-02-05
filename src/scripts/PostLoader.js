class PostLoader {
  constructor() {
    this.form = document.querySelector('.search');
    this.searchField = this.form.querySelector('.search__input');
    this.searchFilters = Array.from(this.form.querySelectorAll('.search__filter'));
    this.articles = document.querySelector('.articles');

    this.currentFilters = [];
    this.prevQuery = '';

    this.observer = undefined;
    this.posts = [];
    this.timer = 0;

    this.createObserver();
    this.events();
  }

  events(){
    this.form.addEventListener('change', (e) => this.handleFilterUpdate(e));
    this.form.addEventListener('submit', (e) => e.preventDefault());
    this.searchField.addEventListener('keyup', () => this.handleKeyPress());
  }

  createObserver() {
    const target = document.getElementById('section-notes');

    const options = {
      root: null,
      rootMargin: '200px',
      threshold: 0.0
    };

    this.observer = new IntersectionObserver(this.handleLoadData.bind(this), options);
    this.observer.observe(target);
  };

  // createListener() {
  //   const target = document.getElementById('mutationTarget');
  //
  //   const options = {
  //     characterData: true,
  //     subtree: true,
  //     childList: true
  //   };
  //
  //   this.mutationObserver = new MutationObserver(console.log);
  //   this.mutationObserver.observe(target, options);
  // }

  handleLoadData(entries, target) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadData();
        this.observer.disconnect();
      }
    });
  }

  loadData(){
    fetch('https://www.developersojourn.site/wp-json/wp/v2/posts')
      .then(res => res.json())
      .then(posts => {
        const firstLoadPosts = posts.slice(0, 6);
        this.renderPosts(firstLoadPosts);
        this.posts = posts;
      })
      .catch(console.error);
  }

  renderPosts(posts) {

    if (!posts) {
      this.articles.innerHTML = '<p>There are no results</p>';
      return;
    }

    this.articles.innerHTML = '';
    posts.forEach(post => {
      const article = document.createElement('article');
      article.className = 'articles__card';
      article.insertAdjacentHTML('beforeend', post.title.rendered);
      article.insertAdjacentHTML('beforeend', post.excerpt.rendered);
      this.articles.appendChild(article);
    });
  }

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

  handleFilterUpdate(e) {
    if (e.target.type === 'checkbox') {

      this.currentFilters = this.searchFilters.reduce((acc, val) => {
        return val.checked ? [...acc, val.id] : acc;
      }, []);
    }

    console.log(this.currentFilters);
    const filtered = this.filterPosts();
    this.renderPosts(filtered);
  }

  filterPosts() {
    const query   = this.searchField.value.trim().toLowerCase();
    const filters = this.currentFilters;

    return this.posts.filter(({ title, excerpt, tags }) => {
      const queryMatch = (
        title.rendered.toLowerCase().includes(query) ||
        excerpt.rendered.toLowerCase().includes(query)
      );
      const filterMatch = filters.length ? filters.some(f => tags.includes(f)) : true;

      return queryMatch && filterMatch;
    });
  }
}

export default PostLoader;


// const matches = this.posts.filter(post => {
//   return post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query)
// })
