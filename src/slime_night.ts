import {
    adv1,
    availableAmount,
    buy,
    cliExecute,
    drink,
    equip,
    inebrietyLimit,
    itemAmount,
    maximize,
    myAscensions,
    myInebriety,
    numericModifier,
    overdrink,
    print,
    runChoice,
    toInt,
    use,
    useFamiliar,
    useSkill,
    visitUrl,
} from "kolmafia";
import { have, property } from "libram";
import { get, set } from "libram/dist/property";
import {
    $coinmaster,
    $effect,
    $familiar,
    $item,
    $items,
    $location,
    $skill,
    $slot,
} from "libram/dist/template-string";
import { getRandFromArray, funBuddyNames } from "./phlib";

const volcanoItemPriority = $items`new age healing crystal, smooch bottlecap, gooey lava globs, fused fuse, smooth velvet bra, smooch bracers`;
if (!get("_volcanoItemRedeemed")) {
    print("Let's see if we can redeem that volcano item", "blue");
    const volcanoItems: Map<Item, number> = new Map<Item, number>([
        [property.getItem("_volcanoItem1") || $item`none`, 1],
        [property.getItem("_volcanoItem2") || $item`none`, 2],
        [property.getItem("_volcanoItem3") || $item`none`, 3],
    ]);
    for (const volcanoItem of volcanoItemPriority.filter((element) =>
        Array.from(volcanoItems.keys()).includes(element)
    )) {
        print(`trying ${volcanoItem.plural}`, "blue");
        if (volcanoItem === $item`fused fuse` && !get("_claraBellUsed")) {
            print("Let's grab a fused fuse", "blue");
            use(1, $item`clara's bell`);
            set("choiceAdventure1091", "7");
            do {
                adv1($location`LavaCo™ Lamp Factory`, -1, () => "");
            } while (get("lastEncounter") === "LavaCo™ Welcomes You");
        }
        if (
            availableAmount(volcanoItem) >=
            property.getNumber(`_volcanoItemCount${volcanoItems.get(volcanoItem)}`)
        ) {
            print("Aces! Let's turn it in, buddy", "blue");
            const choice = volcanoItems.get(volcanoItem) || 4;
            visitUrl("place.php?whichplace=airport_hot&action=airport4_questhub");
            runChoice(choice);
            break;
        }
    }
}

const dmtChoice = myAscensions() === get("lastDMTDuplication") ? 1 : 4;

if (get("encountersUntilDMTChoice") === 0) {
    useFamiliar($familiar`Machine Elf`);
    set("choiceAdventure1119", dmtChoice.toString());
    set("choiceAdventure1125", "1&iid=7050");
    adv1($location`the deep machine tunnels`, -1, () => "");
}

if (itemAmount($item`map to safety shelter grimace prime`) >= 2) {
    if (!have($effect`transpondent`)) {
        if (itemAmount($item`transporter transponder`) === 0) {
            buy(1, $item`transporter transponder`);
        }
        use(1, $item`transporter transponder`);
    }
    set("choiceAdventure536", 1);
    use(1, $item`map to safety shelter grimace prime`);
    set("choiceAdventure536", 2);
    use(1, $item`map to safety shelter grimace prime`);
}

if (availableAmount($item`packet of thanksgarden seeds`) > 0) {
    use(1, $item`packet of thanksgarden seeds`);
}

cliExecute("/shrug ur-");
useSkill(2, $skill`The Ode to Booze`);
equip($slot`shirt`, $item`tuxedo shirt`);
useFamiliar($familiar`Stooper`);
if (myInebriety() + 2 < inebrietyLimit()) {
    drink(1, $item`eldritch elixir`);
} else if (myInebriety() < inebrietyLimit()) {
    drink(1, $item`eye and a twist`);
}
if (get("_unaccompaniedMinerUsed") < 5) {
    cliExecute("minevolcano.ash " + (5 - get("_unaccompaniedMinerUsed")).toString());
}

drink(1, $item`Frosty's Frosty Mug`);
overdrink(1, $item`Vintage Smart Drink`);
if (availableAmount($item`burning cape`) === 0) {
    if (availableAmount($item`burning newspaper`) === 0) {
        buy(1, $item`burning newspaper`);
    }
    cliExecute("make burning cape");
}
useFamiliar($familiar`Trick-or-Treating Tot`);
cliExecute("/whitelist aftercorers");
maximize("adventures", false);
if (!get("_internetViralVideoBought")) {
    cliExecute("/buy viral video");
}

const barrels = $items`little firkin, normal barrel, big tun, weathered barrel, dusty barrel, disintegrating barrel, moist barrel, rotting barrel, mouldering barrel, barnacled barrel`;

barrels.forEach((barrel) => {
    if (itemAmount(barrel) > 0) {
        let page = visitUrl("inv_use.php?pwd&whichitem=" + toInt(barrel).toString() + "&choice=1");
        while (page.includes("Click a barrel to smash it!")) {
            page = visitUrl("choice.php?pwd&whichchoice=1101&option=2");
        }
    }
});

while (itemAmount($item`volcoino`) >= 3) {
    buy($coinmaster`Disco GiftCo`, 1, $item`one-day ticket to That 70s Volcano`);
}
while (itemAmount($item`coinspiracy`) >= 7) {
    buy($coinmaster`The SHAWARMA Initiativ`, 1, $item`karma shawarma`);
}
while (itemAmount($item`Wal-Mart gift certificate`) >= 50) {
    buy($coinmaster`Wal-Mart`, 1, $item`one-day ticket to The Glaciest`);
}

const potions = $items`Cologne of Contempt, Greek Fire, the most dangerous bait, Potion of punctual companionship, Red letter, Daily Affirmation: Keep Free Hate In Your Heart, Bitter pill, turtle pheromones, slimy alveolus`;

potions.forEach((potion) => {
    const effectTurns = numericModifier(potion, "Effect Duration");
    const potionDays = Math.floor((effectTurns * itemAmount(potion)) / 820).toString();
    print(
        "You have " +
            potionDays +
            " days of " +
            potion.plural +
            " right now, " +
            getRandFromArray(funBuddyNames) +
            ".",
        "blue"
    );
});
