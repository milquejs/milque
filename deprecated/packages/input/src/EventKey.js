const ANY = Symbol('any');

export class EventKey
{
    static parse(eventKeyString)
    {
        let startCodeIndex = eventKeyString.indexOf('[');
        let endCodeIndex = eventKeyString.indexOf(']');
        let modeIndex = eventKeyString.indexOf('.');
    
        let source = null;
        let code = null;
        let mode = null;
    
        // For ANY source, use `[code].mode` or `.mode`
        // For ONLY codes and modes from source, use `source`
        if (startCodeIndex <= 0 || modeIndex === 0) source = ANY;
        else source = eventKeyString.substring(0, startCodeIndex);
    
        // For ANY code, use `source.mode` or `source[].mode`
        // For ONLY sources and modes for code, use `[code]`
        if (startCodeIndex < 0 || endCodeIndex < 0 || startCodeIndex + 1 === endCodeIndex) code = ANY;
        else code = eventKeyString.substring(startCodeIndex + 1, endCodeIndex);
    
        // For ANY mode, use `source[code]` or `source[code].`
        // For ONLY sources and codes for mode, use `.mode`
        if (modeIndex < 0 || eventKeyString.trim().endsWith('.')) mode = ANY;
        else mode = eventKeyString.substring(modeIndex + 1);
    
        return new EventKey(
            source,
            code,
            mode
        );
    }

    constructor(source, code, mode)
    {
        this.source = source;
        this.code = code;
        this.mode = mode;

        this.string = `${this.source.toString()}[${this.code.toString()}].${this.mode.toString()}`;
    }

    matches(eventKey)
    {
        if (this.source === ANY || eventKey.source === ANY || this.source === eventKey.source)
        {
            if (this.code === ANY || eventKey.code === ANY || this.code === eventKey.code)
            {
                if (this.mode === ANY || eventKey.mode === ANY || this.mode === eventKey.mode)
                {
                    return true;
                }
            }
        }
        return false;
    }

    /** @override */
    toString() { return this.string; }
};

// NOTE: Exported as a static variable of EventKey
EventKey.ANY = ANY;
