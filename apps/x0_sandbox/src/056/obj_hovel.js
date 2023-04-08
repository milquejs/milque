/*

use sprite 'sp_hovel'
export function setup(m) {
    let sittable = install(m, Sittable);
    scopedInstall(m, NewSittable, Sittable, BunnySystem);

    let sprite = useSprite(m, 'sp_hovel');
    let occupant = useState(m, null);
    return {
        sprite,
        occupant,
    };
}

let spawn me anywhere positionally (differnet owners?)
export function spawn(objectName, x, y) {
}

make me interactible
- I can only be interacted with one bunny at a time.
- A bunny can take a lock from me.
export function Sittable(m) {
    return {
        sit(instanceId, x, y) {

        },
        unsit(instanceId, x, y) {

        },
    }
}

export function useSittable() {
    return using(Sittable);
}

// This should go in bunny
when bunny interacts with me:
- change bunny to sit.

 */

/*

// Family Hovel

use sprite 'sp_hovel_family'

export function setup() {
    let sprite = useSprite('sp_hovel_family');
    let occupants = useStateArray(m, []);
    return {
        state,
        occupants,
    };
}

spawn anywhere
export function spawn(x, y) {

}

 */