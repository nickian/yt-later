import * as uiElements from './uiElements.js';
import * as transitions from './transitions.js';
import * as settings from './settings.js';
import * as functions from './functions.js';
import * as youtube from './youtube/youtube.js';
import * as playlist from './playlist.js';


/**
 * Event listeners for closing the modal.
 */
export function attachListenerCloseModal() {
    /**
     * Click on the close button for the modal.
     */
    uiElements.close_modal.addEventListener('click', function(event) {
        functions.closeModal();
    });

    /**
     * Click on the modal transparent background to close it.
     */
    uiElements.video_detail.addEventListener('click', function(event) {
        if (event.target === uiElements.video_detail) {
            functions.closeModal();
        }
    });
}


/**
 * A video thumbnail link is clicked, open modal.
 */
export function attachListenerVideoClick() {
    uiElements.results.addEventListener('click', function(event) {
        // Start with the target and move up the DOM tree
        let target_element = event.target;
        do {
            if (target_element.classList.contains('video-result-preview')) {
                event.preventDefault(); 
                // The ID value in data-id
                let selected_video_id = target_element.getAttribute('data-id');
                // Request video details from the API.
                youtube.videoDetails(selected_video_id);
                // Show the modal.
                transitions.fadeIn(uiElements.video_detail);
                // Remove scrollbars from the body.
                document.body.classList.add('no-scroll');
                return; 
            }
            // Move up in the DOM tree
            target_element = target_element.parentNode;
        } while (target_element !== uiElements.results && target_element !== null && target_element !== document.body);
    });
}


/**
 * 
 */
export function attachListenerOrderChange() {
    uiElements.filter.addEventListener('change', function() {
        let current_search = settings.getSetting('current_search_term');
        settings.updateSetting('order', this.value);
        functions.doSearch(current_search, false, this.value);
    });
}


/**
 * Click sign out link.
 * 
 * Delete the settings LocalStorage object and reload the page.
 */
export function attachListenerClickSignOut() {
    uiElements.sign_out.addEventListener('click', function(event) {
        event.preventDefault();
        let sign_out = confirm('Delete API key and sign out?');
        if ( sign_out ) {
            settings.deleteSettings();
            playlist.clearWatchLater();
            location.reload();
        }
    });
}


/**
 * Submit the save API key form.
 */
export function attachListenerSubmitSettings() {
    uiElements.form_settings.addEventListener('submit', function(event) {
        // Prevent default form action.
        event.preventDefault();
        // Get the value from the form input field.
        const api_key = uiElements.input_api_key.value;
        // If the API key is not set, return false.
        if ( !api_key ) {
            alert('Enter your API key.');
            return false;
        }
        // Set API key value in the settings object.
        settings.updateSetting('api_key', api_key);
        // initialize the playlist object.
        playlist.savePlaylist();
        uiElements.section_settings.style.display = 'none';
        // Hide the sort filter
        uiElements.filter.style.display = 'none';
        uiElements.section_video_search.style.display = 'block';
        youtube.popularVideos();
        uiElements.section_settings.style.display = 'none';
        transitions.fadeIn(uiElements.nav_menu);
        transitions.fadeIn(uiElements.section_video_search);
        transitions.fadeIn(uiElements.main_content);
    });
}


/**
 * Search form submission.
 */
export function attachListenerSubmitSearch() {
    uiElements.form_video_search.addEventListener('submit', function(event) {
        // Prevent default form action.
        event.preventDefault();
        // Search query
        let query = uiElements.input_video_search.value;
        if (query) {
            // Remember the search term
            settings.updateSetting('current_search_term', query);
            // Do the search
            functions.doSearch(query);
        } else {
            alert('Enter a search query');
        }
    });
}


/**
 * KeyUp, typing The video search input.
 */
export function attachListenerSearchKeyUp() {
    let debounceTimeout;
    uiElements.input_video_search.addEventListener('keyup', function() {
        // Clear the existing timeout on every keyup.
        clearTimeout(debounceTimeout); 
        debounceTimeout = setTimeout(() => {
            const query = this.value;
            if ( !query ) {
                // Hide the sort filter
                uiElements.filter.style.display = 'none';
                youtube.popularVideos();
            } else {
                if ( query.length >= 3 ) {
                    // Remember the query
                    settings.updateSetting('current_search_term', query);
                    // Do the search
                    functions.doSearch(query);
                }
            }
        // 300 milliseconds delay
        }, 300);
    });
}


/**
 * Click the load more button
 */
export function attachListenerClickLoadMore() {
    uiElements.button_load_more.addEventListener('click', function() {
        youtube.videoSearch(
            uiElements.input_video_search.value,
            settings.settings.token_next_page,
            false
        );
    });
}


/**
 * Click the save to playlist button
 */
export function attatchListenerClickWatchLater() {
    uiElements.video_detail.addEventListener('click', function(event) {
        // Start with the target and move up the DOM tree
        let target_element = event.target;
        do {
            if (target_element.classList.contains('save-watch-later')) {
                event.preventDefault(); 
                // Save to the watch later object
                playlist.saveVideo(settings.settings.last_video);
                // Add the saved class to the button
                target_element.classList.add('saved');
                // Show playlist in console
                console.log(playlist.watch_later);
                return; 
            }
            // Move up in the DOM tree
            target_element = target_element.parentNode;
        } while (target_element !== uiElements.video_detail && target_element !== null && target_element !== document.body);
    });
}


/**
 * Click the show watch later playlist link
 */
export function attachListenerClickPlaylist() {
    uiElements.watch_later_playlist.addEventListener('click', function(event) {
        event.preventDefault(); 
        // Make sure the playlist isn't empty
        if ( !playlist.watch_later.videos || playlist.watch_later.videos.length === 0 ) {
            alert('The playlist is currently empty.');
            return;
        }
        // Hide the existing content.
        uiElements.main_content.style.display = 'none';
        // Show the loading spinner.
        uiElements.loading.style.display = 'block';
        // Show the videos
        youtube.showWatchLater();
    });
}