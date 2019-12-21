export class InputEventHandler
{
    constructor()
    {
        this.keys = new Set();

        this.prevState = {};
        this.state = {};
        this.nextState = {};

        this.devices = new Map();

        this.handleEvent = this.handleEvent.bind(this);
    }

    destroy()
    {
        this.devices.clear();
        this.keys.clear();
        this.clearEvents();
    }

    poll()
    {
        let cachedState = this.prevState;
        this.prevState = this.state;
        this.state = this.nextState;
        this.nextState = undefined;

        for(let key of Object.keys(cachedState))
        {
            cachedState[key] = undefined;
        }
        
        this.nextState = cachedState;
        
        return this.state;
    }

    /**
     * Registers a device with the id to listen for events from.
     * 
     * @param {string} deviceId The device id.
     * @param {object} device The device instance.
     * @return {InputEventHandler} Self for method-chaining.
     */
    registerDevice(deviceId, device)
    {
        this.devices.set(deviceId, device);
        device.setEventHandler(this.handleEvent);
        return this;
    }

    /**
     * Unregisters a device with the id to stop listening for events from.
     * 
     * @param {string} deviceId The device id.
     * @return {InputEventHandler} Self for method-chaining.
     */
    unregisterDevice(deviceId)
    {
        let device = this.devices.get(deviceId);
        device.destroy();
        this.devices.delete(deviceId);
        return this;
    }

    /**
     * Activates an event key for listening.
     * 
     * @param {string} eventKey The event key.
     * @return {InputEventHandler} Self for method-chaining.
     */
    registerEvent(eventKey)
    {
        this.keys.add(eventKey);

        // Initialize the entry
        this.nextState[eventKey] = undefined;
        return this;
    }

    /**
     * Deactivates an event key from listening.
     * 
     * @param {string} eventKey The event key.
     * @return {InputEventHandler} Self for method-chaining.
     */
    unregisterEvent(eventKey)
    {
        this.keys.delete(eventKey);
        return this;
    }

    clearEvents()
    {
        this.prevState = {};
        this.state = {};
        this.nextState = {};
    }

    handleEvent(eventKey, value)
    {
        if (this.keys.has(eventKey))
        {
            this.nextState[eventKey] = value;
        }
    }
}
