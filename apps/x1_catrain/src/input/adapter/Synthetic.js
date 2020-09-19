import { InputEventCode } from '../device/InputDevice.js';
import { Input } from '../source/Input.js';

import { AdapterManager } from './AdapterManager.js';

export const KEY_STRING_DEVICE_SEPARATOR = ':';

export class Synthetic extends Input
{
    constructor(adapterOptions)
    {
        super();

        this.update = this.update.bind(this);

        if (!Array.isArray(adapterOptions))
        {
            adapterOptions = [adapterOptions];
        }
        let adapterList = [];
        let adapterId = 0;
        for(let adapterOption of adapterOptions)
        {
            if (typeof adapterOption === 'string')
            {
                adapterOption = { key: adapterOption };
            }
            const { key, scale = 1, event = 'null' } = adapterOption;
            const { deviceName, keyCode } = parseKeyString(key);
            const eventCode = InputEventCode.parse(event);
            const scaleValue = Number(scale);
            let adapter = AdapterManager.createAdapter(
                this, adapterId,
                deviceName, keyCode,
                scaleValue, eventCode);
            adapterList.push(adapter);
            ++adapterId;
        }

        /** @private */
        this.adapters = adapterList;
        /** @private */
        this.values = new Array(adapterList.length).fill(0);
        /** @private */
        this.next = {
            values: new Array(adapterList.length).fill(0),
            value: 0,
        };
    }

    /** @override */
    poll(value, adapter)
    {
        const adapterId = adapter.adapterId;
        let prevValue = this.values[adapterId];
        this.values[adapterId] = value;
        this.value = this.value - prevValue + value;

        this.next.values[adapterId] = 0;
        this.next.value += value - prevValue;
    }

    /** @override */
    update(value, adapter)
    {
        const adapterId = adapter.adapterId;
        let prevValue = this.next.values[adapterId];
        this.next.values[adapterId] = value;
        this.next.value += value - prevValue;
    }

    reset()
    {
        this.values.fill(0);
        this.value = 0;
        this.next.values.fill(0);
        this.next.value = 0;
    }
}

export function parseKeyString(keyString)
{
    let i = keyString.indexOf(KEY_STRING_DEVICE_SEPARATOR);
    if (i >= 0)
    {
        return {
            deviceName: keyString.substring(0, i),
            keyCode: keyString.substring(i + 1),
        };
    }
    else
    {
        throw new Error(`Invalid key string - missing device separator '${KEY_STRING_DEVICE_SEPARATOR}'.`);
    }
}
