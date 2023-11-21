// Object to store settings.
let settings = {
    api_key: '',
    current_search_term: '',
    token_next_page: '',
    token_prev_page: '',
    request_count: '',
    order: 'relevance',
    last_video: {}
};
export { settings };

/**
 * Render the search results area with populated items.
 *
 * @returns {Object} The settings object.
 */
export function getSettings() {
    settings = JSON.parse(localStorage.getItem('settings'));
    return settings;
}


/**
 * Render the search results area with populated items.
 *
 * @param {string} setting - The key of the setting we are updating.
 * @returns {*} The value of the requested setting.
 */
export function getSetting(setting) {
    if ( localStorage.getItem('settings') ) {
        settings = JSON.parse(localStorage.getItem('settings'));
        setting = settings[setting];
        return setting;
    } else {
        return false;
    }
}


/**
 * Save settings object to local storage.
 *
 * @param {Object} settings - The settings object.
 * @returns {Object} The saved settings object.
 */
export function saveSettings(settings) {
    localStorage.setItem('settings', JSON.stringify(settings));
    return getSettings();
}


/**
 * Update a setting value by its key.
 *
 * @param {string} setting - The name of the key.
 * @param {*} value - The setting value.
 * @returns {Object} The updated settings object.
 */
export function updateSetting(setting, value) {
    settings[setting] = value;
    localStorage.setItem('settings', JSON.stringify(settings));
    return getSettings();
}


/**
 * Delete the settings from local storage and reset object.
 *
 */
export function deleteSettings() {
    localStorage.removeItem('settings');
    settings = {
        api_key: '',
        current_search_term: '',
        token_next_page: '',
        token_prev_page: '',
        request_count: '',
        order: 'relevance',
        last_video: {}
    };
}