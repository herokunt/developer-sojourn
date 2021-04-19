<?php get_header();

while(have_posts()){
  the_post();
?>
  <main class="section">
    <div class="container">
      <div class="columns">
        <aside class="column">
          <div class="menu is-hidden-mobile">
            <?php get_template_part('sidemenu'); ?>
          </div>
        </aside> <!-- Sidebar menu -->

        <div class="column is-three-quarters-desktop is-three-quarters-widescreen is-12-tablet"> <!-- Main content -->
          <div><?php if(current_user_can('edit_post')) edit_post_link('Edit This Note'); ?></div>
          <section class="box">
            <article class="content is-size-6">
              <?php the_content(); ?>
            </article>
          </section>
        </div>
      </div>
    </div>
  </main>
<?php } ?>

<?php get_footer(); ?>
