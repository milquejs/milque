export function createContext(inputSource)
{
    return {
        inputSource,
        actions: new Map(),
        ranges: new Map(),
        states: new Map(),
        registerAction(name, eventKeyString)
        {
            let result = this.inputSource.createAction(eventKeyString);
            this.actions.set(name, result);
            return result;
        },
        registerRange(name, eventKeyString)
        {
            let result = this.inputSource.createRange(eventKeyString);
            this.ranges.set(name, result);
            return result;
        },
        registerState(name, eventKeyMap)
        {
            let result = this.inputSource.createState(eventKeyMap);
            this.states.set(name, result);
            return result;
        }
    };
}
