/**
 * Himalayan Prefab Solutions ERP
 * Reactive Event Bus (Pub/Sub)
 */

class EventEmitter {
  constructor() {
    this.events = {};
  }

  /**
   * Subscribe to an event
   * @param {string} eventName
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
    return () => this.off(eventName, callback);
  }

  /**
   * Unsubscribe from an event
   */
  off(eventName, callback) {
    if (!this.events[eventName]) return;
    this.events[eventName] = this.events[eventName].filter((cb) => cb !== callback);
  }

  /**
   * Emit an event with data
   */
  emit(eventName, data = {}) {
    if (!this.events[eventName]) return;
    this.events[eventName].forEach((callback) => {
      try {
        callback(data);
      } catch (err) {
        console.error(`Error in event listener for ${eventName}:`, err);
      }
    });
  }
}

var AppEvents = (window.AppEvents = new EventEmitter());

