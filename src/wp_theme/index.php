<script type="text/javascript">
  if (!window.location.pathname.startsWith('/blog')) {
    window.location = 'https://developersojourn.site';
  }
</script>

<?php get_header(); ?>

<main>
  <ul>
    <?php
    while(have_posts()){
      the_post();?>
      <li class="post__item">
        <article class="post">
          <h3>
            <a href="<?php the_permalink(); ?>"> <?php the_title(); ?></a>
          </h3>
          <div>
            <?php the_field('date_picker'); ?>
          </div>
          <time>the_time?</time>
          <p class="post__excerpt"><?php the_excerpt(); ?></p>
        </article>
      </li>
    <?php } ?>
  </ul>
</main>


<?php get_footer(); ?>
