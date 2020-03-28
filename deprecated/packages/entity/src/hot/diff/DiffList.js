export class DiffList extends Array
{
    static createRecord(type, key, value = undefined, path = [])
    {
        return {
            type,
            path,
            key,
            value,
        };
    }

    addRecord(type, key, value = undefined, path = [])
    {
        let result = DiffList.createRecord(type, key, value, path);
        this.push(result);
        return result;
    }

    addRecords(records)
    {
        this.push(...records);
    }
}
