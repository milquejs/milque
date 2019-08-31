class TweenManager
{
    constructor()
    {
        this.tweens = new Map();
        this.cachedTweens = new Set();
        this.useCache = false;
    }

    add(tween)
    {
        if (this.useCache)
        {
            this.cachedTweens.add(tween);
        }
        else
        {
            this.tweens.set(tween.id, tween);
        }
    }

    remove(tween)
    {
        if (this.cachedTweens.has(tween))
        {
            this.cachedTweens.delete(tween);
        }
        else
        {
            this.tweens.delete(tween.id);
        }
    }

    clear()
    {
        this.tweens.clear();
        this.cachedTweens.clear();
    }

    update(time, preserve = false)
    {
        do
        {
            for(const tween of this.cachedTweens.values())
            {
                this.add(tween);
            }
            this.cachedTweens.clear();
            
            this.useCache = true;
            for(const tweenID of this.tweens.keys())
            {
                const tween = this.tweens.get(tweenID);
                if (!tween.update(time))
                {
                    if (!preserve)
                    {
                        this.tweens.delete(tweenID);
                    } 
                }
            }
            this.useCache = false;
        }
        while(this.cachedTweens.size > 0);
    }
}

export default TweenManager;