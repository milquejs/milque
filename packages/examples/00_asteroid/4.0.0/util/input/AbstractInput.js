export class AbstractInput
{
    constructor(defaultValue)
    {
        this.prev = defaultValue;
        this.value = defaultValue;
        this.next = defaultValue;
    }

    update(eventKey, value)
    {
        return false;
    }

    consume()
    {
        return this.next;
    }

    poll()
    {
        this.prev = this.value;
        this.value = this.next;
        this.next = this.consume();
        return this;
    }
}
