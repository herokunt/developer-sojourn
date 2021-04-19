<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
  <!-- <body class="blog"> -->
  <header class="blog-header">
    <a class="blog-header__title" href="localhost:8080">Developer Sojourn</a>
    <svg class="blog-header__search"><use xlink:href="../assets/images/sprite.svg#icon-colours"></use></svg>
  </header>

  <aside class="search">
    <form class="search__form">
      <input class="search__input" id="search-field" name="search-field" type="text" placeholder="Looking for something?">

      <div class="control-group">
        <input class="search__filter" type="checkbox" name="html" value="html" id="html">
        <label class="search__label search__label--html" for="html">HTML</label>

        <input class="search__filter" type="checkbox" name="css" value="css" id="css">
        <label class="search__label search__label--css" for="css">CSS</label>

        <input class="search__filter" type="checkbox" name="javascript" value="javascript" id="javascript">
        <label class="search__label search__label--js" for="javascript">JS</label>

        <input class="search__filter" type="checkbox" name="node" value="node" id="node">
        <label class="search__label search__label--node" for="node">Node.js</label>

        <input class="search__filter" type="checkbox" name="react" value="react" id="react">
        <label class="search__label search__label--react" for="react">React.js</label>

        <input class="search__filter" type="checkbox" name="python" value="python" id="python">
        <label class="search__label search__label--py" for="python">Python</label>

        <input class="search__filter" type="checkbox" name="wordpress" value="wordpress" id="wordpress">
        <label class="search__label search__label--wp" for="wordpress">WordPress</label>

        <input class="search__filter" type="checkbox" name="devops" value="devops" id="devops">
        <label class="search__label search__label--lx" for="devops">SysAdmin</label>
      </div>
    </form>

    <ul class="search__results">
      <li class="search__result">
        <article>
          <h3>Title</h3>
          <p>Excerpt</p>
        </article>
      </li>
      <li class="search__result">
        <article>
          <h3>Title</h3>
          <p>Excerpt</p>
        </article>
      </li>
      <li class="search__result">
        <article>
          <h3>Title</h3>
          <p>Excerpt</p>
        </article>
      </li>
      <li class="search__result">
        <article>
          <h3>Title</h3>
          <p>Excerpt</p>
        </article>
      </li>
      <li class="search__result">
        <article>
          <h3>Title</h3>
          <p>Excerpt</p>
        </article>
      </li>
      <li class="search__result">
        <article>
          <h3>Title</h3>
          <p>Excerpt</p>
        </article>
      </li>
    </ul>

  </aside>
