import * as nanostores from "nanostores";
import { $name } from "./name.js";
import { $users } from "./users.js";

/**
 * Returns a list of users that are alive, and is not itself
 * @type {nanostores.ReadableAtom<Array<import("./pick.js").User>>}
 */

export const $otherUsers = nanostores.computed([$users, $name], (users, name) => 
    users.filter((u) => u.alive && u.name !== name.name)
);
