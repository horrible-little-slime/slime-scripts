import {
    itemAmount,
    eat,
    drink,
    chew,
    buy,
    cliExecute,
    getCampground,
    print,
    useSkill,
    myClass,
    use,
    useFamiliar,
    maximize,
    myMp,
    getPlayerId,
    toInt,
    visitUrl,
    myInebriety,
    myFullness,
    runChoice,
    takeCloset,
    myAdventures,
    haveEffect,
    effectModifier,
    numericModifier,
    availableAmount,
} from "kolmafia";
import { $class, $effect, $familiar, $item, $items, $skill } from "libram";
import { get } from "libram/dist/property";

const mpa = 8000;

function libramCost() {
    let n = get("libramSummons") + 1;
    return 1 + (n * (n - 1)) / 2;
}

function eatSafe(amount: number, food: Item) {
    print("Eating " + amount.toString() + " " + food.name, "blue");
    if (itemAmount(food) >= amount) {
        if (!eat(amount, food)) {
            throw "Unsuccessfully ate";
        }
    } else {
        throw "Not enough to eat!";
    }
}

function drinkSafe(amount: number, beverage: Item) {
    print("Drinking " + amount.toString() + " " + beverage.name, "blue");
    if (itemAmount(beverage) >= amount) {
        if (!drink(amount, beverage)) {
            throw "Unsuccessfully drank";
        }
    } else {
        throw "Not enough to drink!";
    }
}

function chewSafe(amount: number, chewable: Item) {
    print("Chewing " + amount.toString() + " " + chewable.name, "blue");
    if (itemAmount(chewable) >= amount) {
        if (!chew(amount, chewable)) {
            throw "Unsuccessfully chewed";
        }
    } else {
        throw "Not enough to chew!";
    }
}

function getIfMeatPositive(item: Item, amount: number, turns: number) {
    if (itemAmount(item) >= amount) {
        print("You have enough " + item.name, "blue");
        return true;
    } else {
        print("Need more " + item.name, "blue");
        buy(amount - itemAmount(item), item, turns * mpa);
        if (itemAmount(item) >= amount) {
            return true;
        } else {
            return false;
        }
    }
}

cliExecute("briefcase collect");

if (!get("_borrowedTimeUsed")) {
    if (getIfMeatPositive($item`Resolution: Be More Adventurous`, 5, 2)) {
        use(5, $item`Resolution: Be More Adventurous`);
        if (itemAmount($item`borrowed time`) === 0) {
            cliExecute("make borrowed time");
        }
        use(1, $item`borrowed time`);
    }
}

const eating = Object.getOwnPropertyNames(getCampground()).includes("portable Mayo Clinic");
if (eating && !get("_mayoDeviceRented")) {
    buy(1, $item`Sphygmayomanometer`);
}

if (get("_ancestralRecallCasts") < 10) {
    if (getIfMeatPositive($item`blue mana`, 10, 3)) {
        while (get("_ancestralRecallCasts") < 10 && itemAmount($item`blue mana`) > 0) {
            useSkill(1, Skill.get("Ancestral Recall"));
        }
    }
}

const chocolates = new Map([
    [$class`Turtle Tamer`, $item`chocolate turtle totem`],
    [$class`Seal Clubber`, $item`chocolate seal-clubbing club`],
    [$class`Sauceror`, $item`chocolate saucepan`],
    [$class`Disco Bandit`, $item`chocolate disco ball`],
    [$class`Accordion Thief`, $item`chocolate stolen accordion`],
    [$class`Pastamancer`, $item`chocolate pasta spoon`],
]);

if (get("_chocolatesUsed") === 0) {
    const chocolate = chocolates.get(myClass());
    if (chocolate) {
        if (getIfMeatPositive(chocolate, 3, 2)) {
            use(3, chocolate);
        }
    }
}

if (get("_sausagesEaten") < 23) {
    useFamiliar($familiar`left-hand man`);
    maximize("mp, +equip kremlin", false);
    const sausagesToMake = Math.min(
        23 - get("_sausagesEaten") - itemAmount($item`magical sausage`),
        itemAmount($item`magical sausage casing`)
    );
    cliExecute("make " + sausagesToMake.toString() + " magical sausage");
    eat(
        Math.min(23 - get("_sausagesEaten"), itemAmount($item`magical sausage`)),
        $item`magical sausage`
    );
}

while (myMp() > libramCost() - 3) {
    if (get("_brickoEyeSummons") < 3) {
        useSkill(1, $skill`Summon BRICKOs`);
    } else {
        useSkill(1, $skill`Summon Love Song`);
    }
}

if (!get("_essentialTofuUsed")) {
    if (getIfMeatPositive($item`Essential Tofu`, 1, 5)) {
        use(1, $item`Essential Tofu`);
    }
    if (getIfMeatPositive($item`Time's Arrow`, 1, 5)) {
        visitUrl(
            "sendmessage.php?action=send&towho=" +
                getPlayerId("botticelli") +
                "&whichitem1=" +
                toInt($item`Time's Arrow`).toString() +
                "&howmany1=1",
            true
        );
    }
}

if (myInebriety() === 0) {
    print("Let's get to drinkin'", "blue");
    useFamiliar($familiar`Trick-or-Treating Tot`);
    maximize("cold res, +equip tuxedo shirt", false);
    cliExecute("uneffect Ur-Kel's Aria of Annoyance");
    useSkill(3, $skill`The Ode to Booze`);
    drinkSafe(2, $item`Splendid Martini`);
    use(1, $item`synthetic dog hair pill`);
    chewSafe(15, $item`slimy alveolus`);
    drinkSafe(3, $item`Frosty's Frosty Mug`);
    drinkSafe(3, $item`Jar of Fermented Pickle Juice`);
    chewSafe(5, $item`voodoo snuff`);
    drinkSafe(1, $item`Frosty's Frosty Mug`);
    drinkSafe(1, $item`Jar of Fermented Pickle Juice`);
    use(3, $item`mojo filter`);
    chewSafe(2, $item`voodoo snuff`);
}

if (myFullness() === 0 && eating) {
    print("I'm a hungry little boy!", "blue");
    useFamiliar($familiar`Trick-or-Treating Tot`);
    if (getIfMeatPositive($item`Milk of Magnesium`, 1, 5) && !get("_milkOfMagnesiumUsed")) {
        use(1, $item`Milk of Magnesium`);
    }
    if (!get("_barrelPrayer")) {
        cliExecute("barrelprayer buff");
    }
    maximize("hot res", false);
    visitUrl("inv_use.php?which=3&whichitem=8285");
    runChoice(2);
    if (itemAmount($item`mayodiol`) < 2) {
        buy(2 - itemAmount($item`mayodiol`), $item`mayodiol`);
    }
    if (get("mayoMinderSetting") !== "Mayodiol") {
        throw "I'm so sorry, but your mayo minder code is broken.";
    }
    eatSafe(1, $item`Ol' Scratch's Salad Fork`);
    eatSafe(1, $item`Extra-Greasy Slider`);
    if (!takeCloset(1, $item`Spice Melange`)) {
        throw "I'm out of melange!";
    }
    use(1, $item`Spice Melange`);
    use(1, $item`distention pill`);
    eatSafe(1, $item`Ol' Scratch's Salad Fork`);
    eatSafe(1, $item`Extra-Greasy Slider`);
    chewSafe(4, $item`Voodoo Snuff`);
    visitUrl("inv_use.php?which=3&whichitem=8285");
    runChoice(5);
    if (itemAmount($item`mayoflex`) < 3) {
        buy(3 - itemAmount($item`mayoflex`), $item`mayoflex`);
    }
    if (get("mayoMinderSetting") !== "Mayoflex") {
        throw "I'm so sorry, but your mayo minder code is broken.";
    }
    eatSafe(1, $item`fudge spork`);
    if (getIfMeatPositive($item`munchies pill`, 1, 3)) {
        use(1, $item`munchies pill`);
    }
    eatSafe(1, $item`Affirmation Cookie`);
    eatSafe(2, $item`Ol' Scratch's Salad Fork`);
    eatSafe(2, $item`Extra-Greasy Slider`);
    const thesisAdjustment = get("_thesisDelivered") ? 0 : 11;
    const chocolateAdjustment = get("_loveChocolatesUsed") > 0 ? 0 : 3;
    const chillAdjustment = get("_licenseToChillUsed") ? 0 : 5;
    if (
        myAdventures() + thesisAdjustment + chocolateAdjustment + chillAdjustment + 9 <
        haveEffect($effect`slimebreath`) + 50
    ) {
        chewSafe(3, $item`Voodoo Snuff`);
        chewSafe(1, $item`slimy alveolus`);
    } else {
        chewSafe(2, $item`Voodoo Snuff`);
        chewSafe(4, $item`slimy alveolus`);
    }
}

if (!get("_freePillKeeperUsed")) {
    cliExecute("pillkeeper extend");
    use(1, $item`bitter pill`);
}

const potions = $items`Cologne of Contempt, Greek Fire, the most dangerous bait, Potion of punctual companionship, Red letter, Daily Affirmation: Keep Free Hate In Your Heart, Bitter pill, turtle pheromones`;

potions.forEach((potion) => {
    const effect = effectModifier(potion, "Effect");
    const turnGap = myAdventures() - haveEffect(effect);
    if (turnGap > 0) {
        const potionsNeeded = Math.ceil(turnGap / numericModifier(potion, "Effect Duration"));
        if (availableAmount(potion) <= potionsNeeded) {
            print("Looks like you need more " + potion.plural + ", cowboy.", "blue");
        } else {
            use(potionsNeeded + 1, potion);
        }
    }
});
