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

function pcq_settings_page_html()
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
        <?php settings_errors(); ?>
        <form method="POST" action="options.php">
        <?php settings_fields( 'pcq-settings' ); ?>
        <?php do_settings_sections( 'pcq-settings' ) ?>
        <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

function pcq_settings_page()
{
    add_submenu_page(
        'tools.php',
        'WP Chart Questionnaire Options',
        'WP Chart Questionnaire',
        'manage_options',
        'pcq-settings',
        'pcq_settings_page_html');

    add_action('admin_init', 'pcq_settings_init');
}
add_action('admin_menu', 'pcq_settings_page');

function pcq_settings_init()
{
    register_setting( 'pcq-settings', 'pcq_heading_text' );
    register_setting( 'pcq-settings', 'pcq_ending_text' );

    add_settings_section( 'pcq-heading-section', 'Heading Options', 'pcq_heading_section_cb', 'pcq-settings' );

    add_settings_field( 'pcq-heading-text', 'Heading Text', 'pcq_heading_text_cb', 'pcq-settings', 'pcq-heading-section');
    add_settings_field( 'pcq-ending-text', 'Ending Text', 'pcq_ending_text_cb', 'pcq-settings', 'pcq-heading-section');
}

function pcq_heading_section_cb()
{
    echo '<p>Change your setttings</p>';
}

function pcq_heading_text_cb() {
    $heading_text = esc_attr( get_option( 'pcq_heading_text', '' ) );
    ?>
    <div id="titlediv">
        <input id="title" type="text" name="pcq_heading_text" value="<?php echo $heading_text; ?>">
    </div>
    <?php
}

function pcq_ending_text_cb() {
    $ending_text = esc_attr( get_option( 'pcq_ending_text', '' ) );
    ?>
    <div id="titlediv">
        <input id="title" type="text" name="pcq_ending_text" value="<?php echo $ending_text; ?>">
    </div>
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
