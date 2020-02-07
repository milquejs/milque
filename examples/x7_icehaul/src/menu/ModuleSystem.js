class ModuleSystem
{
    constructor()
    {
        this.name = null;
    }

    setName(name)
    {
        this.name = name;
        return this;
    }

    /** @abstract */
    onAttach(commandCenter) {}

    /** @abstract */
    onDetach(commandCenter) {}

    /** @abstract */
    async onBanner(world) {}
}

module.exports = { ModuleSystem };
