import * as uiElements from './uiElements.js';
import * as transitions from './transitions.js';
import * as settings from './settings.js';
import * as youtube from './youtube/youtube.js';

/**
 * Search YouTube API and render search results in the content area.
 * 
 * @param {string} query - The search query
 * @param {string} page - The token for the page request
 * @param {string} order - The results sort order
 */
export function doSearch(query, page = false, order = false) {
    // Save the current search term in the settings object.
    settings.updateSetting('current_search_term', query);

    // Hide the existing content.
    uiElements.main_content.style.display = 'none';

    // Show the loading spinner.
    uiElements.loading.style.display = 'block';

    // Update the H1 search results title.
    uiElements.title_search.textContent = 'Search Results: ' + uiElements.input_video_search.value;

    // Show the sort filter
    uiElements.filter.style.display = 'block';

    // Show the load more button
    uiElements.button_load_more.style.display = 'block';

    // Make the request to the YouTube API.
    youtube.videoSearch(query, page, order);
}


/**
 * Close/hide the video detail modal and make body scrollable again.
 */
export function closeModal() {
    // Make sure the video stops playing
    stopVideo();
    // Close the modal
    transitions.fadeOut(uiElements.video_detail);
    // Make the body scrollable again.
    document.body.classList.remove('no-scroll');
}


/**
 * Format the description string, convert new lines into <p> tags.
 *
 * @param {string} str - The description string.
 * @returns {string} The input string with new lines wrapped in paragraph tags.
 */
export function formatDescription(str) {
    return str.split('\n').map(line => `<p>${line}</p>`).join('');
}


/**
 * Stop the video by remove the iframe src
 */
export function stopVideo() {
    let iframe = document.querySelector('iframe');
    iframe.src = iframe.src;
}


/**
 * Format the date string provided from the API.
 * 
 * @param {string} date_string - The input string to convert 
 * @returns {string} Date in the updated format.
 */
export function formatDate(dateString) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date(dateString);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${months[monthIndex]} ${day}, ${year}`;
}