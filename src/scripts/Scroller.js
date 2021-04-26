class Scroller {
  constructor(isMobileDevice) {
    this.banner = document.getElementById('banner');
    this.navbar = document.getElementById('nav');
    this.menu   = document.getElementById('nav__menu');

    // this.isMobileDevice = true;
    if (isMobileDevice) {
      this.listen();
      return;
    }

    this.sectionCoords = [];
    this.sectionTitles = ['About', 'WebApps', 'Games & Graphics', 'Scripting', 'System Administration', 'Blog'];
    this.sections = [
      document.getElementById('about'),
      document.getElementById('webapps'),
      document.getElementById('gamesgraphics'),
      document.getElementById('scripts'),
      document.getElementById('sysadmin'),
      document.getElementById('blog')
    ];

    this.windowHeight = window.innerHeight;
    this.threshold = 100;
    this.timer;
    this.timer2;
    this.getSectionCoords();
    this.listen();
  }

  listen() {
    this.navbar.addEventListener('click', () => this.updateMenu());
    window.addEventListener('resize', () => this.getSectionCoords());
    window.addEventListener('scroll', () => {
      this.updateNavbar();
      this.updateBanner();
    });
  }

  listenToMobile() {
    // listen only for navbar effects
  }

  getSectionCoords() {

    clearTimeout(this.timer2);
    this.timer2 = setTimeout(_getSectionCoords.bind(this), 50);

    // Recalculate every time because window size and display orientation can change
    function _getSectionCoords() {
      this.sections.forEach((section, idx) => {
        this.sectionCoords[idx] = section.offsetTop;
      });

      this.updateBanner();
    }
  }

  updateBanner() {
    clearTimeout(this.timer);
    this.timer = setTimeout(_updateBanner.bind(this), 100);

    function _updateBanner() {
      const scrolledFromTop = this.windowHeight + window.scrollY;

      for (let i = this.sectionCoords.length; i >= 0; i--) {
        if (scrolledFromTop > this.sectionCoords[i] + this.threshold) {
          this.banner.textContent = this.sectionTitles[i];
          break;
        }
      }
    }
  }

  updateNavbar() {
    // At the top, navbar and menu are visible
    if (window.scrollY === 0 && !this.isMobileDevice) {
      this.navbar.className = 'nav';
      this.menu.className = 'nav__menu';
    } else {
      // Hidden elsewhere...
      this.navbar.className = 'nav nav--hide';
      this.menu.className = 'nav__menu nav__menu--hide';
    }
  }

  updateMenu() {
    // ...until they are clicked
    if (this.menu.className === 'nav__menu nav__menu--hide') {
      this.navbar.className = 'nav nav--small';
      this.menu.classList.remove('nav__menu--hide');
    }
  }
}

export default Scroller;
