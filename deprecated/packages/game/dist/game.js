(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.Game = {}));
}(this, (function (exports) { 'use strict';

    const DELTA_TIME_FACTOR = 1 / 1000;
    const MAX_FIXED_UPDATES = 250;

    /**
     * @version 1.4.0
     * @description
     * Handles a steady update loop.
     * 
     * # Changelog
     * ## 1.5.0
     * - Renamed to ApplicationLoop
     * ## 1.4.0
     * - Removed Eventable in favor of addEventListener()
     * - Changed GameLoop into a web component
     * ## 1.3.0
     * - Removed frameTime in favor of deltaTimeFactor
     * - Moved static start()/stop() for game loop to modules
     * ## 1.2.0
     * - Fixed incrementing dt on window blur
     * - Fixed large dt on first frame
     * ## 1.1.0
     * - Added pause and resume
     * ## 1.0.0
     * - Create GameLoop
     * 
     * @fires start
     * @fires stop
     * @fires pause
     * @fires resume
     * @fires update
     * @fires preupdate
     * @fires postupdate
     * @fires fixedupdate
     */
    class ApplicationLoop extends HTMLElement
    {
        static currentTime() { return performance.now(); }

        /** @override */
        static get observedAttributes()
        {
            return [
                // Event handlers...
                'onstart',
                'onstop',
                'onpreupdate',
                'onupdate',
                'onfixedupdate',
                'onpostupdate',
                'onpause',
                'onresume',
            ];
        }

        constructor(startImmediately = true, controlled = false)
        {
            super();

            this._controlled = controlled;
            this._connectedStart = startImmediately;
            this._animationFrameHandle = null;

            this.prevFrameTime = 0;
            this.started = false;
            this.paused = false;
            this.fixedTimeStep = 1 / 60;
            this.prevAccumulatedTime = 0;

            this._onstart = null;
            this._onstop = null;
            this._onpreupdate = null;
            this._onupdate = null;
            this._onfixedupdate = null;
            this._onpostupdate = null;
            this._onpause = null;
            this._onresume = null;

            this.onAnimationFrame = this.onAnimationFrame.bind(this);
            this.onWindowFocus = this.onWindowFocus.bind(this);
            this.onWindowBlur = this.onWindowBlur.bind(this);
        }

        setFixedUpdatesPerSecond(count)
        {
            this.fixedTimeStep = 1 / count;
            return this;
        } 

        /** @override */
        connectedCallback()
        {
            // If the window is out of focus, just ignore the time.
            window.addEventListener('focus', this.onWindowFocus);
            window.addEventListener('blur', this.onWindowBlur);

            if (this._connectedStart) this.start();
        }

        /** @override */
        disconnectedCallback()
        {
            // If the window is out of focus, just ignore the time.
            window.removeEventListener('focus', this.onWindowFocus);
            window.removeEventListener('blur', this.onWindowBlur);

            this.stop();
        }

        /** @override */
        attributeChangedCallback(attribute, prev, value)
        {
            switch(attribute)
            {
                // Event handlers...
                case 'onstart':
                    this._onstart = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                    break;
                case 'onstop':
                    this._onstop = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                    break;
                case 'onpreupdate':
                    this._onpreupdate = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                    break;
                case 'onupdate':
                    this._onupdate = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                    break;
                case 'onfixedupdate':
                    this._onfixedupdate = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                    break;
                case 'onpostupdate':
                    this._onpostupdate = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                    break;
                case 'onpause':
                    this._onpause = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                    break;
                case 'onresume':
                    this._onresume = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                    break;
            }
        }

        onWindowFocus()
        {
            if (!this.started) return;
            this.resume();
        }

        onWindowBlur()
        {
            if (!this.started) return;
            this.pause();
        }

        /**
         * Runs the game loop. If this is a controlled game loop, it will call itself
         * continuously until stop() or pause().
         */
        onAnimationFrame(now)
        {
            if (this._controlled) throw new Error('Cannot run controlled game loop; call step() instead.');
            if (!this.started) throw new Error('Must be called after start().');

            this.animationFrameHandle = requestAnimationFrame(this.onAnimationFrame);
            this.step(now);
        }

        /** Runs one update step for the game loop. This is usually called 60 times a second. */
        step(now = ApplicationLoop.currentTime())
        {
            if (!this.started) return false;

            const delta = (now - this.prevFrameTime) * DELTA_TIME_FACTOR;
            this.prevFrameTime = now;
            
            if (this.paused) return false;

            this.dispatchEvent(new CustomEvent('preupdate', {
                detail: { delta },
                bubbles: false,
                composed: true
            }));

            this.dispatchEvent(new CustomEvent('update', {
                detail: { delta },
                bubbles: false,
                composed: true
            }));

            this.prevAccumulatedTime += delta;
            if (this.prevAccumulatedTime > MAX_FIXED_UPDATES * this.fixedTimeStep)
            {
                let max = MAX_FIXED_UPDATES * this.fixedTimeStep;
                let count = (this.prevAccumulatedTime - max) / this.fixedTimeStep;
                this.prevAccumulatedTime = max;
                console.error(`[ApplicationLoop] Too many updates! Skipped ${count} fixed updates.`);
            }

            while(this.prevAccumulatedTime >= this.fixedTimeStep)
            {
                this.prevAccumulatedTime -= this.fixedTimeStep;
                this.dispatchEvent(new CustomEvent('fixedupdate', {
                    bubbles: false,
                    composed: true
                }));
            }

            this.dispatchEvent(new CustomEvent('postupdate', {
                detail: { delta },
                bubbles: false,
                composed: true
            }));
        }

        /** Starts the game loop. Calls run(), unless recursive is set to false. */
        start()
        {
            if (this.started) throw new Error('Loop already started.');

            this.started = true;
            this.prevFrameTime = ApplicationLoop.currentTime();

            this.dispatchEvent(new CustomEvent('start', {
                bubbles: false,
                composed: true
            }));
            
            if (!this.controlled)
            {
                this.onAnimationFrame(this.prevFrameTime);
            }
        }

        /** Stops the game loop. */
        stop()
        {
            if (!this.started) throw new Error('Loop not yet started.');

            this.started = false;

            this.dispatchEvent(new CustomEvent('stop', {
                bubbles: false,
                composed: true
            }));

            if (!this._controlled)
            {
                if (this.animationFrameHandle)
                {
                    cancelAnimationFrame(this.animationFrameHandle);
                    this.animationFrameHandle = null;
                }
            }
        }

        /** Pauses the game loop. */
        pause()
        {
            if (this.paused) return;

            this.paused = true;
            
            this.dispatchEvent(new CustomEvent('pause', {
                bubbles: false,
                composed: true
            }));
        }

        /** Resumes the game loop. */
        resume()
        {
            if (!this.pause) return;

            this.paused = false;

            this.dispatchEvent(new CustomEvent('resume', {
                bubbles: false,
                composed: true
            }));
        }

        get onstart() { return this._onstart; }
        set onstart(value)
        {
            if (this._onstart) this.removeEventListener('start', this._onstart);
            this._onstart = value;
            if (this._onstart) this.addEventListener('start', value);
        }

        get onstop() { return this._onstop; }
        set onstop(value)
        {
            if (this._onstop) this.removeEventListener('stop', this._onstop);
            this._onstop = value;
            if (this._onstop) this.addEventListener('stop', value);
        }

        get onpreupdate() { return this._onpreupdate; }
        set onpreupdate(value)
        {
            if (this._onpreupdate) this.removeEventListener('preupdate', this._onpreupdate);
            this._onpreupdate = value;
            if (this._onpreupdate) this.addEventListener('preupdate', value);
        }

        get onupdate() { return this._onupdate; }
        set onupdate(value)
        {
            if (this._onupdate) this.removeEventListener('update', this._onupdate);
            this._onupdate = value;
            if (this._onupdate) this.addEventListener('update', value);
        }

        get onfixedupdate() { return this._onfixedupdate; }
        set onfixedupdate(value)
        {
            if (this._onfixedupdate) this.removeEventListener('fixedupdate', this._onfixedupdate);
            this._onfixedupdate = value;
            if (this._onfixedupdate) this.addEventListener('fixedupdate', value);
        }

        get onpostupdate() { return this._onpostupdate; }
        set onpostupdate(value)
        {
            if (this._onpostupdate) this.removeEventListener('postupdate', this._onpostupdate);
            this._onpostupdate = value;
            if (this._onpostupdate) this.addEventListener('postupdate', value);
        }

        get onpause() { return this._onpause; }
        set onpause(value)
        {
            if (this._onpause) this.removeEventListener('pause', this._onpause);
            this._onpause = value;
            if (this._onpause) this.addEventListener('pause', value);
        }

        get onresume() { return this._onresume; }
        set onresume(value)
        {
            if (this._onresume) this.removeEventListener('resume', this._onresume);
            this._onresume = value;
            if (this._onresume) this.addEventListener('resume', value);
        }
    }
    window.customElements.define('application-loop', ApplicationLoop);

    exports.ApplicationLoop = ApplicationLoop;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
