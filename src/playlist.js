// Watch later playlist object
let watch_later = {
    videos: []
};
export { watch_later };

/**
 * Save the current playlist object to local storage.
 */
export function savePlaylist() {
    // Turn into a string and save to local storage
    localStorage.setItem('watch_later', JSON.stringify(watch_later));
    return getWatchLater();
}

/**
 * Retrieve the watch later playlist from local storage.
 *
 * @returns {Object} The current playlist.
 */
export function getWatchLater() {
    // Parse into an object
    watch_later = JSON.parse(localStorage.getItem('watch_later'));
    return watch_later;
}

/**
 * Save a video object to the playlist.
 *
 * @param {Object} video - The video object to save.
 * @returns {Object} The current playlist.
 */
export function saveVideo(video) {
    watch_later.videos.push(video);
    // Turn into a string and save to local storage
    savePlaylist();
    return getWatchLater();
}


/**
 * Remove the playlist from local storage and reset the object.
 */
export function clearWatchLater() {
    localStorage.removeItem('watch_later');
    watch_later = { videos: [] };
}