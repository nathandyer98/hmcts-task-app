/**
 * A function that returns a date in the format "dd/mm/yyyy"
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

/**
 * A function that returns the time in the format "hh:mm"
 * @param date 
 * @returns 
 */
export function formatDateTime(date: Date) {
    return new Date(date).toLocaleString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}