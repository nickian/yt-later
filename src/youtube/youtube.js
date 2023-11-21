import * as uiElements from '../uiElements.js';
import * as settings from '../settings.js';
import * as transitions from '../transitions.js';
import * as functions from '../functions.js';
import * as playlist from '../playlist.js';
import axios from 'axios';


/* Variables **************************************************************************/

// The API Endpoint for Searching
const api_search = 'https://www.googleapis.com/youtube/v3/search';

// API Endpoint for Popular Videos
const api_videos = 'https://www.googleapis.com/youtube/v3/videos';

/* YouTube-Related Functions **********************************************************/


/**
 * Create and populate an HTML component to use in the video detail modal.
 *
 * @param {Object} video - The resulting video object from the YouTube API.
 * @returns {string} An HTML component with API data filled in.
 */
function createVideoDetail(video) {
    let video_detail = `
        <div class="iframe-container">
            ${video.player.embedHtml}
        </div>
        <div class="buttons">
            <button class="save-watch-later">Watch Later</button>
        </div>
        <h3>${video.snippet.title}</h3>
        <div class="description">
            <div class="stats">
                <p>
                    <strong>Views:</strong> ${parseInt(video.statistics.viewCount,10).toLocaleString()} 
                    <strong>Likes:</strong> ${parseInt(video.statistics.likeCount, 10).toLocaleString()}
                    <strong>Comments:</strong> ${parseInt(video.statistics.commentCount, 10).toLocaleString()}
                </p>
            </div>
            ${functions.formatDescription(video.snippet.description)}
        </div>`;
        return video_detail;
}


/**
 * Create and populate an HTML component item to use in the serch results.
 * 
 * @param {Object} video - A video object from the YouTube API.
 * @returns An HTML component to render in the results.
 */
function createVideoThumbnailElement(video) {

    // Check if video.id is a string or not.
    let video_id = typeof video.id === 'string' ? video.id : video.id.videoId;

    let video_thumbnail = 
        `<a href="https://youtube.com/watch?v=${video_id}" target="_blank" class="video-result-preview" data-id="${video_id}">
            <div class="video-thumbnail-container">
                <div class="video-thumbnail" style="background: url('${video.snippet.thumbnails.medium.url}');"></div>
            </div>
            <p>${video.snippet.channelTitle}</p>
            <h3>${video.snippet.title}</h3>
            <p class="video-date">${functions.formatDate(video.snippet.publishedAt)}</p>
        </a>`;
    return video_thumbnail;
}


/**
 * Render the search results area with populated items.
 *
 * @param {Array} videos - An array of video objects from the API.
 * @param {boolean|string} load_more - Whether or not to append vs create new results.
 * @returns {string} The input string with new lines wrapped in paragraph tags.
 */
function renderSearchResults(videos, load_more=false) {

    if ( !load_more ) {
        uiElements.results.innerHTML = '';
    }

    // For each search result item, build an HTML element and append it to the content area.
    videos.forEach(video => {
        let video_preview = createVideoThumbnailElement(video);
        // Append the new element to the container.
        uiElements.results.innerHTML += video_preview;
    });

    transitions.fadeIn(uiElements.results);
    uiElements.button_load_more.style.display = 'block';

}


/**
 * Request a video's detail from the API and add the HTML component to the modal.
 *
 * @param {string} selected_video_id - The ID of the video to get info for.
 */
export function videoDetails(selected_video_id) {
    axios.get(api_videos, {
        params: {
            part: 'snippet,player,statistics',
            key: settings.getSetting('api_key'),
            id: selected_video_id
        }
    })
    // Handle the response.
    .then(response => {
        console.log(response);
        let video_content = createVideoDetail(response.data.items[0]);
        // Remember this video object in settings
        settings.settings.last_video = response.data.items[0];
        // Add video content to the modal.
        uiElements.video_detail_container.innerHTML = video_content;
    })
    // Handle any errors with the response.
    .catch(error => {
        console.log(error);
        uiElements.video_detail_container.innerHTML = error.message;
    });
}


/**
 * Display the local watch later playlist.
 */
export function showWatchLater() {

    // Get the local object
    let watch_later = playlist.getWatchLater();

    console.log(watch_later);

    // Show the object in the console
    console.log(watch_later.videos);

    // Update the results title
    uiElements.title_search.textContent = 'Watch Later';

    // Add video previews to the content area
    renderSearchResults(watch_later.videos);

    // Hide the loading element
    uiElements.loading.style.display = 'none';

    // Hide the order filter
    uiElements.filter.style.display = 'none';

    // Hide the load more button
    uiElements.button_load_more.style.display = 'none';

    // Show the content
    transitions.fadeIn(uiElements.main_content);
    
}

/**
 * Request trending videos from API, render previews in results area.
 */
export function popularVideos() {
    // Get the the most popular videos right now.
    axios.get(api_videos, {
        params: {
            part: 'snippet,contentDetails,statistics',
            key: settings.getSetting('api_key'),
            maxResults: 20,
            chart: 'mostPopular',
            regionCode: 'US'
        }
    })
    // Handle the response.
    .then(response => {

        // Show the object in the console
        console.log(response.data);

        // Remember the next/previous page tokens, if they exist
        response.data.nextPageToken && (settings.settings.token_next_page = response.data.nextPageToken);
        response.data.prevPageToken && (settings.settings.token_prev_page = response.data.prevPageToken);

        // Update the results title
        uiElements.title_search.textContent = 'Trending Videos';

        // Clear the last remembered search term
        settings.updateSetting('current_search_term', '');

        // Add video previews to the content area
        renderSearchResults(response.data.items);

        // Hide the loading element
        uiElements.loading.style.display = 'none';

    })
    // Handle any errors with the response.
    .catch(error => {
        console.log(error);
        uiElements.errors.innerText = error.message;
        // Hide the loading element
        uiElements.loading.style.display = 'none';
        // Show error messages
        transitions.fadeIn(uiElements.errors);
    });
}


/**
 * Search the API for videos, parse and return results.
 * 
 * @param {string} query - The search query.
 * @param {boolean|string} page - The page request token.
 * @param {boolean|string} order - The order to display results.
 */
export function videoSearch(query, page = false, order = false) {

    // Set the default sort order.
    if (order == false ) {
        order = settings.getSetting('order');
    }

    // Make sure the API key is set, or return false.
    if ( !settings.settings.api_key ) {
        alert('No API key saved.');
        return false;
    }

    let params = {};

    if ( page ) {
        params = {
            part: 'snippet',
            type: 'video',
            q: query,
            key: settings.settings.api_key,
            maxResults: 20,
            order: order,
            pageToken: page
        };
    } else {
        params = {
            part: 'snippet',
            type: 'video',
            q: query,
            key: settings.settings.api_key,
            maxResults: 20,
            order: order
        };
    }

    // Make the request to the API.
    axios.get(api_search, {
        params: params
    })
    // Handle the response.
    .then(response => {

        console.log(response.data);

        // Remember the next/previous page tokens, if they exist.
        response.data.nextPageToken && (settings.settings.token_next_page = response.data.nextPageToken);
        response.data.prevPageToken && (settings.settings.token_prev_page = response.data.nextPageToken);

        // Add video previews to the content area.
        renderSearchResults(response.data.items, page);

        loading.style.display = 'none';
        transitions.fadeIn(uiElements.main_content);

    })
    // Handle any errors with the response.
    .catch(error => {
        console.log(error);
        uiElements.errors.innerText = error.message;
        // Hide the loading element
        uiElements.loading.style.display = 'none';
        // Show error messages
        transitions.fadeIn(uiElements.errors);
    });

}