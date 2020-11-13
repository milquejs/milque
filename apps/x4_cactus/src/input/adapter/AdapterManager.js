import { InputEventCode, WILDCARD_KEY_MATCHER } from '../device/InputDevice.js';

/**
 * @typedef AdapterInput
 * @property {Function} update
 * @property {Function} poll
 * @property {Function} reset
 * 
 * @typedef Adapter
 * @property {AdapterInput} target
 * @property {Number} adapterId
 * @property {String} deviceName
 * @property {String} keyCode
 * @property {Number} scale
 * @property {Number} eventCode
 */

export const WILDCARD_DEVICE_MATCHER = '*';

export class AdapterManager
{
    /**
     * Creates a new adapter for the given values.
     * 
     * @param {AdapterInput} target The target callback to update the value.
     * @param {Number} adapterId The adapter id (unique within the target).
     * @param {String} deviceName The name of the device to listen to.
     * @param {String} keyCode The key code to listen to.
     * @param {Number} scale The input value multiplier.
     * @param {Number} eventCode The event code to listen for.
     * @returns {Adapter} The new adapter.
     */
    static createAdapter(target, adapterId, deviceName, keyCode, scale, eventCode)
    {
        return {
            target,
            adapterId,
            deviceName,
            keyCode,
            scale,
            eventCode,
        };
    }

    constructor()
    {
        /** @private */
        this.adapters = { [WILDCARD_DEVICE_MATCHER]: createKeyCodeMap() };
    }
    
    /**
     * @param {Array<Adapter>} adapters 
     */
    add(adapters)
    {
        for(let adapter of adapters)
        {
            const { deviceName, keyCode } = adapter;
            let adapterMap;
            if (!(deviceName in this.adapters))
            {
                adapterMap = createKeyCodeMap();
                this.adapters[deviceName] = adapterMap;
            }
            else
            {
                adapterMap = this.adapters[deviceName];
            }

            if (keyCode in adapterMap)
            {
                adapterMap[keyCode].push(adapter);
            }
            else
            {
                adapterMap[keyCode] = [adapter];
            }
        }
    }

    /**
     * @param {Array<Adapter>} adapters
     */
    delete(adapters)
    {
        for(let adapter of adapters)
        {
            const { deviceName, keyCode } = adapter;
            if (deviceName in this.adapters)
            {
                let adapterMap = this.adapters[deviceName];
                if (keyCode in adapterMap)
                {
                    let list = adapterMap[keyCode];
                    let index = list.indexOf(adapter);
                    if (index >= 0)
                    {
                        list.splice(index, 1);
                    }
                }
            }
        }
    }

    clear()
    {
        for(let deviceName in this.adapters)
        {
            this.adapters[deviceName] = createKeyCodeMap();
        }
    }

    poll(deviceName, keyCode, input)
    {
        const adapters = this.findAdapters(deviceName, keyCode);
        for(let adapter of adapters)
        {
            const eventCode = adapter.eventCode;
            if (eventCode === InputEventCode.NULL)
            {
                const { target, scale } = adapter;
                const nextValue = input.value * scale;
                target.poll(nextValue, adapter);
            }
            else
            {
                const { target, scale } = adapter;
                const nextValue = input.getEvent(eventCode) * scale;
                target.poll(nextValue, adapter);
            }
        }
        return adapters.length > 0;
    }

    update(deviceName, keyCode, input)
    {
        let flag = false;
        for(let adapter of this.findAdapters(deviceName, keyCode))
        {
            const eventCode = adapter.eventCode;
            if (eventCode !== InputEventCode.NULL)
            {
                const { target, scale } = adapter;
                const nextValue = input.getEvent(eventCode) * scale;
                target.update(nextValue, adapter);
                flag = true;
            }
        }
        return flag;
    }

    reset(deviceName, keyCode, input)
    {
        let flag = false;
        for(let adapter of this.findAdapters(deviceName, keyCode))
        {
            adapter.target.reset();
            flag = true;
        }
        return flag;
    }
    
    /**
     * Find all adapters for the given device and key code.
     * 
     * @param {String} deviceName The name of the target device.
     * @param {String} keyCode The target key code.
     * @returns {Array<Adapter>} The associated adapters for the device and key code.
     */
    findAdapters(deviceName, keyCode)
    {
        let result = [];
        if (deviceName in this.adapters)
        {
            let adapterMap = this.adapters[deviceName];
            if (keyCode in adapterMap) result.push(...adapterMap[keyCode]);
            result.push(...adapterMap[WILDCARD_KEY_MATCHER]);
        }
        let wildMap = this.adapters[WILDCARD_DEVICE_MATCHER];
        if (keyCode in wildMap) result.push(...wildMap[keyCode]);
        result.push(...wildMap[WILDCARD_KEY_MATCHER]);
        return result;
    }
}

function createKeyCodeMap()
{
    return { [WILDCARD_KEY_MATCHER]: [] };
}
