<?php

add_action('rest_api_init', 'custom_get_posts');

// Sets up event a custom endpoint: /content/posts
function custom_get_posts() {
  register_rest_route('content', 'posts', array(
    'methods'   => WP_REST_SERVER::READABLE,
    'callback'  => 'load_post_data'
  ));
}

// Returns trimmed down post data that's relevant to the front-end
function load_post_data() {
  $post_data = new WP_Query(array(
    'post_type' => 'post'
  ));

  $result = array();

  while($post_data->have_posts()) {
    $post_data->the_post();

    array_push($result, array(
      'id'      => get_the_ID(),
      'title'   => get_the_title(),
      'excerpt' => get_the_excerpt(),
      'content' => get_the_content(),
      'tags'    => get_tag_names(get_the_ID())
    ));
  }

  return $result;
}

// Return an array with the tag names for a provided post id
function get_tag_names($id) {
  $post_tags = get_the_tags($id);
  $tags = array();

  if ($post_tags) {
    foreach($post_tags as $tag) {
      array_push($tags, $tag->name);
    }
  }

  return $tags;
}

?>
