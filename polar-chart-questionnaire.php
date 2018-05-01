<?php
/*
Plugin Name:  Polar Chart Questionnaire
Plugin URI:   https://developer.wordpress.org/plugins/the-basics/
Description:  Creates a live updating polar chart with a questionnaire
Version:      1.0.0
Author:       Muhammad Osama Arshad
Author URI:   https://alazierplace.com/
License:      GPL2
License URI:  https://www.gnu.org/licenses/gpl-2.0.html
Text Domain:  polar, chart, questionnaire
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

function pcq_options_page_html()
{
    // check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }
    ?>
    <div class="wrap">
        <h1><?=esc_html(get_admin_page_title());?></h1>
        <div class="card">
            <h2>Simply add the following shortcode to render your questionnaire</h2>
            <p><b>[polar-survey]</b></p>
        </div>
    </div>.

    <div class="wrap">
        <form action="options.php">
            <?php settings_fields('pcq_options');?>
            <label for="pcq_heading_text">Heading Text</label>

            <input type="text" id="pcq_heading_text" name="pcq_heading_text" value="<?php echo get_option('pcq_heading_text'); ?>">

            <?php submit_button();?>
        </form>
    </div>
    <?php
}

function pcq_options_page()
{
    add_submenu_page(
        'tools.php',
        'Polar Chart Questionnaire Options',
        'Polar Chart Questionnaire',
        'manage_options',
        'pcq_options',
        'pcq_options_page_html');
}
add_action('admin_menu', 'pcq_options_page');

function pcq_settings_init()
{
    register_setting('pcq_options', 'pcq_heading_text');

    add_settings_section('pcq_settings_section', 'Heading Text', 'pcq_settings_section_cb', 'pcq_options');

    add_settings_field('pcq_heading_text', 'heading_text', 'pcq_settings_field_cb', 'pcq_options', 'pcq_settings_section');
}
add_action('admin_init', 'pcq_settings_init');

function pcq_settings_section_cb()
{

}

function pcq_settings_field_cb()
{
    $heading_text = get_option('pcq_heading_text');

    ?>
    <input type="text" name="pcq_heading_text" value="<?php echo isset($heading_text) ? esc_attr($heading_text) : ''; ?>">
    <?php
}

function pcq_shortcodes_init()
{
    function pcq_survey_shortcode()
    {
        echo '<style>';
        include plugin_dir_path(__FILE__) . 'style.min.css';
        echo '</style>';

        include plugin_dir_path(__FILE__) . 'public/partials/polar-chart-partial.php';
        do_action('pcq_add_js');
    }
    add_shortcode('polar-survey', 'pcq_survey_shortcode');
}
add_action('init', 'pcq_shortcodes_init');

function pcq_enqueue_scripts()
{
    wp_register_script('pcq_vendors', plugins_url('/public/js/vendors.min.js', __FILE__));
    wp_register_script('pcq_custom', plugins_url('/public/js/custom.min.js', __FILE__));

    wp_enqueue_script('pcq_vendors');
    wp_enqueue_script('pcq_custom');
}
add_action('pcq_add_js', 'pcq_enqueue_scripts');
