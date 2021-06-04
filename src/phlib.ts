import { canAdv } from "canadv.ash";
import {
    mallPrice,
    equip,
    bjornifyFamiliar,
    cliExecute,
    itemAmount,
    print,
    runChoice,
    use,
    visitUrl,
    haveEffect,
    availableAmount,
    buy,
    myFamiliar,
    adv1,
    setAutoAttack,
} from "kolmafia";
import {
    $familiar,
    $item,
    get,
    $slot,
    $location,
    set,
    $items,
    $effect,
    have,
    Macro,
    $skill,
    $monster,
    $familiars,
} from "libram";
import { getString, getItem } from "libram/dist/property";
import { stasisKill } from "./macros";

interface famPick {
    familiar: Familiar;
    meatVal: number;
    probability: () => number;
}

const bjornFams = [
    {
        familiar: $familiar`puck man`,
        meatVal: mallPrice($item`yellow pixel`),
        probability: () => (get("_yellowPixelDropsCrown") < 25 ? 0.25 : 0),
    },
    {
        familiar: $familiar`grimstone golem`,
        meatVal: mallPrice($item`grimstone mask`),
        probability: () => (get("_grimstoneMaskDropsCrown") === 0 ? 0.5 : 0),
    },
    { familiar: $familiar`Knob Goblin Organ Grinder`, meatVal: 30, probability: () => 1 },
    {
        familiar: $familiar`garbage fire`,
        meatVal: mallPrice($item`burning newspaper`),
        probability: () => (get("_garbageFireDropsCrown") < 3 ? 0.5 : 0),
    },
    {
        familiar: $familiar`machine elf`,
        meatVal:
            (1 / 6) *
            (mallPrice($item`abstraction: sensation`) +
                mallPrice($item`abstraction: thought`) +
                mallPrice($item`abstraction: action`) +
                mallPrice($item`abstraction: category`) +
                mallPrice($item`abstraction: perception`) +
                mallPrice($item`abstraction: purpose`)),
        probability: () => (get("_abstractionDropsCrown") < 25 ? 0.2 : 0),
    },
    {
        familiar: $familiar`trick-or-treating tot`,
        meatVal: mallPrice($item`hoarded candy wad`),
        probability: () => (get("_hoardedCandyDropsCrown") < 3 ? 0.5 : 0),
    },
    {
        familiar: $familiar`warbear drone`,
        meatVal: mallPrice($item`warbear whosit`),
        probability: () => 1 / 4.5,
    },
    {
        familiar: $familiar`li'l xenomorph`,
        meatVal: mallPrice($item`lunar isotope`),
        probability: () => 0.05,
    },
    {
        familiar: $familiar`pottery barn owl`,
        meatVal: mallPrice($item`volcanic ash`),
        probability: () => 0.1,
    },
];

/*const dropFams = [
    {
        familiar: $familiar`unconscious collective`,
        meatVal: mallPrice($item`unconscious collective dream jar`),
        probability: () =>
            get("_dreamJarDrops") < 5
                ? 5 * (5 - get("_dreamJarDrops")) + 5 * get("_unconsciousCollectiveCharge")
                : 0,
    },
    {
        familiar: $familiar`rogue program`,
        meatVal: mallPrice($item`game grid token`),
        probability: () =>
            get("_tokenDrops") < 5
                ? 5 * (5 - get("_tokenDrops")) + 5 * get("_rogueProgramCharge")
                : 0,
    },
    {
        familiar: $familiar`obtuse angel`,
        meatVal: mallPrice($item`time's arrow`),
        probability: () => 0.02,
    },
    {
        familiar: $familiar`llama lama`,
        meatVal: mallPrice($item`llama lama gong`),
        probability: () =>
            get("_gongDrops") < 5
                ? (availableAmount($item`zen motorcycle`) > 0
                      ? (5 * (5 - Math.min(get("_gongDrops"), 3))) / 100
                      : (5 * (4 - Math.min(get("_gongDrops"), 3))) / 100) +
                  5 * get("_llamaCharge")
                : 0,
    },
    {
        familiar: $familiar`puck man`,
        meatVal: 1, //Combining yellow pixels AND power pills doesn't work with the flow, so I'm doing it all in the probability
        probability: () =>
            mallPrice($item`yellow pixel`) +
            (get("_powerPillDrops") < Math.min(11, myDaycount())
                ? (1 / 15) * mallPrice($item`power pill`)
                : 0),
    },
    {
        familiar: $familiar`grimstone golem`,
        meatVal: mallPrice($item`grimstone mask`),
        probability: () => (get("_grimstoneMaskDrops") === 0 ? 1 / 45 : 0),
    },
    {
        familiar: $familiar`fist turkey`,
        meatVal: mallPrice($item`ambitious turkey`),
        probability: () => get('_turkeyBooze') < 5 ? 5 * (get('_charge'))
    },
    {
        familiar: $familiar`rockin' robin`,
        meatVal: mallPrice($item`robin's egg`),
        probability: () => 1 / 30,
    },
    {
        familiar: $familiar`intergnat`,
        meatVal: 2 * mallPrice($item`BACON`),
        probability: () => 1,
    },
    {
        familiar: $familiar`baby sandworm`,
        meatVal: mallPrice($item`agua de vida`),
        probability: () => 
    }
];*/

interface zonePotion {
    zone: String;
    effect: Effect;
    potion: Item;
}

const zonePotions = [
    {
        zone: "Spaaace",
        effect: $effect`Transpondent`,
        potion: $item`transporter transponder`,
    },
    {
        zone: "Wormwood",
        effect: $effect`absinthe-minded`,
        potion: $item`tiny bottle of absinthe`,
    },
];

function testBjornFamiliar(fam: famPick) {
    return myFamiliar() === fam.familiar ? 0 : fam.meatVal * fam.probability();
}

export function pickBjorn() {
    let familiarChoice = $familiar`pair of ragged claws`;
    let meatExpected =
        haveEffect($effect`shortly stacked`) +
            haveEffect($effect`shortly buttered`) +
            haveEffect($effect`shortly hydrated`) ===
        0
            ? 11.67 * 5
            : 13.2 * 5;
    bjornFams.forEach((fam) => {
        if (testBjornFamiliar(fam) > meatExpected) {
            familiarChoice = fam.familiar;
            meatExpected = testBjornFamiliar(fam);
        }
    });
    equip($slot`back`, $item`buddy bjorn`);
    bjornifyFamiliar(familiarChoice);
}

function guzzlrCheck() {
    const guzzlZone = get("guzzlrQuestLocation") || $location`the deep dark jungle`;
    const forbiddenZones = ["Dinseylandfill", "The Rabbit Hole", "Spring Break Beach"];
    zonePotions.forEach((place) => {
        if (guzzlZone.zone === place.zone && haveEffect(place.effect) === 0) {
            if (availableAmount(place.potion) === 0) {
                buy(1, place.potion, 10000);
            }
            use(1, place.potion);
        }
    });
    if (
        forbiddenZones.includes(guzzlZone.zone) ||
        !guzzlZone.wanderers ||
        guzzlZone === $location`The Oasis` ||
        guzzlZone === $location`The Bubblin' Caldera` ||
        guzzlZone.environment === "underwater" ||
        (guzzlZone === $location`Barrrney's Barrr` && !have($item`pirate fledges`)) ||
        guzzlZone.zone === "BatHole" ||
        !canAdv(guzzlZone, false)
    ) {
        return false;
    } else {
        return true;
    }
}

function dropGuzzlrQuest() {
    print("We hate this guzzlr quest!", "blue");
    set("choiceAdventure1412", "");
    visitUrl("inventory.php?tap=guzzlr", false);
    runChoice(1);
    runChoice(5);
}

export function prepWandererZone() {
    if (get("questGuzzlr") === "unstarted") {
        if (
            get("_guzzlrPlatinumDeliveries") === 0 &&
            get("guzzlrGoldDeliveries") >= 5 &&
            (get("guzzlrPlatinumDeliveries") < 30 ||
                (get("guzzlrGoldDeliveries") >= 150 && get("guzzlrBronzeDeliveries") >= 196))
        ) {
            set("choiceAdventure1412", 4);
            use(1, $item`guzzlr tablet`);
        } else if (
            get("_guzzlrGoldDeliveries") < 3 &&
            get("guzzlrBronzeDeliveries") >= 5 &&
            (get("guzzlrGoldDeliveries") < 150 || get("guzzlrBronzeDeliveries") >= 196)
        ) {
            set("choiceAdventure1412", 3);
            use(1, $item`guzzlr tablet`);
        } else {
            set("choiceAdventure1412", 2);
            use(1, $item`guzzlr tablet`);
        }
    }

    if (get("questGuzzlr") !== "unstarted") {
        if (!guzzlrCheck() && !get("_guzzlrQuestAbandoned")) {
            dropGuzzlrQuest();
        }
    }

    if (get("questGuzzlr") === "unstarted") {
        if (
            get("_guzzlrPlatinumDeliveries") === 0 &&
            get("guzzlrGoldDeliveries") >= 5 &&
            (get("guzzlrPlatinumDeliveries") < 30 ||
                (get("guzzlrGoldDeliveries") >= 150 && get("guzzlrBronzeDeliveries") >= 196))
        ) {
            set("choiceAdventure1412", 4);
            use(1, $item`guzzlr tablet`);
        } else if (
            get("_guzzlrGoldDeliveries") < 3 &&
            get("guzzlrBronzeDeliveries") >= 5 &&
            (get("guzzlrGoldDeliveries") < 150 || get("guzzlrBronzeDeliveries") >= 196)
        ) {
            set("choiceAdventure1412", 3);
            use(1, $item`guzzlr tablet`);
        } else {
            set("choiceAdventure1412", 2);
            use(1, $item`guzzlr tablet`);
        }
    }

    let freeFightZone = $location`the deep dark jungle`;
    if (guzzlrCheck()) {
        freeFightZone = get("guzzlrQuestLocation") || $location`the deep dark jungle`;
        if (get("guzzlrQuestTier") === "platinum") {
            zonePotions.forEach((place) => {
                if (freeFightZone.zone === place.zone && haveEffect(place.effect) === 0) {
                    if (availableAmount(place.potion) === 0) {
                        buy(1, place.potion, 10000);
                    }
                    use(1, place.potion);
                }
            });
        }
    }
    if (freeFightZone === get("guzzlrQuestLocation")) {
        if (getString("guzzlrQuestBooze") === "Guzzlr cocktail set") {
            if (
                !$items`buttery boy, steamboat, ghiaccio colada, nog-on-the-cob, sourfinger`.some(
                    (drink) => have(drink)
                )
            ) {
                cliExecute("make buttery boy");
            }
        } else {
            let guzzlrBooze = getItem("guzzlrQuestBooze");
            if (!guzzlrBooze) {
                freeFightZone = $location`The Deep Dark Jungle`;
            } else if (itemAmount(guzzlrBooze) === 0) {
                print(`just picking up some booze before we roll`, "blue");
                cliExecute("acquire " + get("guzzlrQuestBooze"));
            }
        }
    }
    return freeFightZone;
}

export function advMacroAA(
    location: Location,
    macro: Macro,
    parameter: number | (() => boolean) = 1,
    afterCombatAction?: () => void
) {
    let n = 0;
    const condition = () => {
        return typeof parameter === "number" ? n < parameter : parameter();
    };
    while (condition()) {
        macro.setAutoAttack();
        const macroText = macro.toString();
        adv1(location, -1, (round: number, foe: Monster, text: string) => {
            return macroText;
        });
        if (afterCombatAction) afterCombatAction();
        n++;
    }
}

export function advMacro(
    location: Location,
    macro: Macro,
    parameter: number | (() => boolean) = 1,
    afterCombatAction?: () => void
) {
    setAutoAttack(0);
    let n = 0;
    const condition = () => {
        return typeof parameter === "number" ? n < parameter : parameter();
    };
    while (condition()) {
        const macroText = macro.toString();
        adv1(location, -1, () => {
            return macroText;
        });
        if (afterCombatAction) afterCombatAction();
        n++;
    }
}

export function macroByCases(heDidTheMonsterMap: Map<Monster, Macro>, elseCase?: Macro) {
    const macro = new Macro();
    heDidTheMonsterMap.forEach((action, foe) => {
        macro.if_(`monsterid ${foe.id.toString()}`, Macro.step(action));
    });
    if (elseCase) {
        macro.step(elseCase);
    }
    return macro;
}

const stasisFamiliars = $familiars`stocking mimic, ninja pirate zombie robot, comma chameleon, feather boa constrictor`;

export function tentacleTimespinnerMacro(macro?: Macro) {
    const stasisOrDont = Macro.externalIf(
        stasisFamiliars.includes(myFamiliar()),
        stasisKill
    ).externalIf(
        !stasisFamiliars.includes(myFamiliar()),
        Macro.skill($skill`curse of weaksauce`)
            .skill($skill`extract`)
            .skill($skill`sing along`)
            .attack()
            .repeat()
    );
    return macroByCases(
        new Map<Monster, Macro>([
            [$monster`eldritch tentacle`, stasisOrDont],
            [$monster`time-spinner prank`, stasisOrDont],
        ]),
        macro
    );
}

export const funBuddyNames = [
    "cowboy",
    "pardner",
    "friend",
    "friend-o",
    "pal",
    "buddy",
    "guy",
    "dude",
    "comrade",
    "heart of my heart",
    "matey",
    "daddy",
    "Mr. Anderson",
    "Shrek, the ogre from the Shrek franchise",
    "bad boy",
    "stretchy little man",
    "coward",
    "you block, you stone, you worse than senseless thing",
    "nerd",
    "you handsome, handsome man",
    "sport",
];

export function getRandFromArray(messages: Array<string>) {
    return messages[Math.floor(Math.random() * messages.length)];
}
