import './scss/styles.scss';
import * as uiElements from './uiElements.js';
import * as transitions from './transitions.js';
import * as settings from './settings.js';
import * as eventListeners from './eventListeners.js';
import * as youtube from './youtube/youtube.js';

// The DOM content has loaded.
 document.addEventListener('DOMContentLoaded', function() {
    // Events for closing the modal
    eventListeners.attachListenerCloseModal();
    // Event for clicking a video, opening modal
    eventListeners.attachListenerVideoClick();
    // Event for changing order dropdown
    eventListeners.attachListenerOrderChange();
    // Event for clicking sign out link
    eventListeners.attachListenerClickSignOut();
    // Event for submiting the settings/API key form
    eventListeners.attachListenerSubmitSettings();
    // Event for typing in search form
    eventListeners.attachListenerSearchKeyUp();
    // Event for submitting the search form
    eventListeners.attachListenerSubmitSearch();
    // Event for clicking the load more button
    eventListeners.attachListenerClickLoadMore();
    // Event for clicking the save to watch later button
    eventListeners.attatchListenerClickWatchLater();
    // Event for clicking the Watch Later Playlist link
    eventListeners.attachListenerClickPlaylist();
}); // DOM content is loaded.

 // DOM and content has loaded.
window.onload = function() {
    // Get settings from LocalStorage if they exist.
    let api_key = settings.getSetting('api_key');
    // API Key has not been saved. Show settings form.
    if ( !api_key ) {
        transitions.fadeIn(uiElements.section_settings);
    } else {
        // Show loading element
        uiElements.loading.style.display = 'block';
        // Focus on the search bar
        uiElements.input_video_search.focus();
        // Load trending videos
        youtube.popularVideos();
        // Fade in UI elements
        transitions.fadeIn(uiElements.nav_menu);
        transitions.fadeIn(uiElements.section_video_search);
        transitions.fadeIn(uiElements.main_content);
        console.log(settings.settings);
    }
};
