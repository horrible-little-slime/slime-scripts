import {
    adv1,
    bjornifyFamiliar,
    cliExecute,
    equip,
    familiarWeight,
    gametimeToInt,
    getCampground,
    getClanId,
    getCounters,
    getFuel,
    haveEffect,
    itemAmount,
    myAdventures,
    myFullness,
    myMaxhp,
    outfit,
    print,
    restoreHp,
    totalTurnsPlayed,
    use,
    useFamiliar,
    useSkill,
    visitUrl,
    weightAdjustment,
} from "kolmafia";
import { $location, $item, $slot, $effect, $skill, $familiar, have, Macro } from "libram";
import { get, set } from "libram/dist/property";
import { banderRun, ghostStasis, reDigitize, runAway, stasisKill } from "./macros";
import { advMacroAA, pickBjorn, prepWandererZone } from "./phlib";

const freeFightOutfit = "freefight stasis"; //get('freeFightOutfit');
const slimeOutfit = "slimeml"; //get('slimeOutfit');
const wipeOutfit = "slimefree"; //get('slimeFreeOutfit');
const wipeClan = 2047008512; //get('wipeClanId');
const momCcs = "mom";

const tubeClan = getClanId();

const momSlainMessages = [
    `Congrats on finishing your performance of the Oresteia!`,
    `Ding dong. The witch (mom) is dead (hopefully).`,
    `Mama, just killed a slime (you).`,
    `Yo mama's so slimy you killed her!`,
    `Every mother's day needs a mother's night. If killing the mother slime is wrong, you don't wanna be right.`,
    `If I'm reading this correctly, you just killed a bed. What else could 'matricide' mean?`,
    `And that, kids, is how I killed your mother (slime).`,
    `You brought the mother slime into this world, and now you've taken her out. What a cruel, senseless adventurer you are.`,
    `If this was Binding of Isaac, you'd be taking full heart damage from everything now.`,
    `Remarkably, there isn't an Oedipus joke to make about what you just did, because Jocasta killed herself but you killed the mother slime.`,
    `Looks like you can use wire hangers now.`,
    `Uh oh, you may have just accidentally created a slimebatman.`,
    `The mother slime is dead. Probably shouldn't have had a disney protagonist for a child.`,
    `According to Slime Norman Bates, Mother slime is actually still alive.`,
    `She slimed me (and then I killed her).`,
    `Mama was a mother slime/it's really hard to make this li-ine rhyme/and when she died all she left us was a slime skill gland.`,
    `What's the difference between a huge, hideous mass of tentacles and slime at the bottom of an enormous, disgusting underground hole and yo mama? Yo mama wouldn't fit in the hole.`,
];

function printRandFromArray(messages: Array<string>, color: string) {
    let msg = Math.floor(Math.random() * messages.length);
    print(messages[msg], color);
}

function hopAndWipe() {
    visitUrl(`showclan.php?whichclan=` + wipeClan.toString() + `&action=joinclan&confirm=on&pwd`);
    if (get("_hotTubSoaks") < 5) {
        visitUrl("clan_viplounge.php?action=hottub");
    } else if (
        Object.getOwnPropertyNames(getCampground()).includes("portable Mayo Clinic") &&
        !get("_mayoTankSoaked")
    ) {
        cliExecute("mayosoak");
    } else {
        visitUrl("clan_slimetube.php?action=chamois");
    }
    if (haveEffect($effect`Coated in Slime`) !== 0) {
        throw "I'm still too slimy! You need to get more chamoix, babe";
    }
}

function hopBack() {
    visitUrl(`showclan.php?whichclan=` + tubeClan.toString() + `&action=joinclan&confirm=on&pwd`);
}

/* function planPotions() {
    const effects = Object.getOwnPropertyNames(myEffects());
    let endangeredMLEffects = [];
    let marginalML = numericModifier("Monster Level");
    let endangeredML = 0;
    effects.forEach((effectString) => {
        const effect = $effect`${effectString}`;
        if (haveEffect(effect) < 224 && numericModifier(effect, "Monster Level") > 0) {
            endangeredMLEffects.push(effect);
            marginalML -= numericModifier(effect, "Monster Level");
            endangeredML += numericModifier(effect, "Monster Level") * haveEffect(effect);
        }
    })
    const predictedTurns = Math.ceil((400000 - endangeredML)/(marginalML + 420));
    const x = (400000 - endangeredML) - (predictedTurns - 1) * (marginalML + 420);
    const potions = $items`chocolate filthy lucre, patent sallowness tonic, cologne of contempt, perfume of prejudice, hoarded candy wad`;

    potions.forEach((potion) => {
        
    });
} */

export function main(target: string) {
    const startTime = gametimeToInt();
    const saveTurns = myFullness() === 0 ? 0 : 4;
    use(itemAmount($item`mocking turtle`), $item`mocking turtle`);
    let kramcoNumber =
        5 + 3 * get("_sausageFights") + Math.pow(Math.max(0, get("_sausageFights") - 5), 3);
    useFamiliar($familiar`Left-Hand Man`);
    equip($slot`familiar`, $item`HOA regulation book`);
    useFamiliar($familiar`Stocking Mimic`);
    if (haveEffect($effect`Ode to Booze`) !== 0) {
        cliExecute("shrug ode to booze");
    }
    useSkill(1, $skill`Ur-Kel's Aria of Annoyance`);
    cliExecute("mcd 11");

    const originalFixed = get("stopForFixedWanderer");
    set("stopForFixedWanderer", false);

    const originalSaber = get("choiceAdventure1387") || 0;
    set("choiceAdventure326", 2);

    const originalAbort = get("autoAbortThreshold");
    set("autoAbortThreshold", 0);

    outfit(slimeOutfit);

    let ghostLocation = $location`none`;

    cliExecute("ccs use a macro");
    stasisKill.setAutoAttack();

    set("choiceAdventure1412", "0");

    while (myAdventures() > saveTurns) {
        if (
            haveEffect($effect`Coated in Slime`) < 6 &&
            haveEffect($effect`Coated in Slime`) !== 0
        ) {
            print(`You are too slimy! Let me fix that.`, "green");
            hopAndWipe();
        }

        if (get("questPAGhost") !== "unstarted") {
            ghostLocation = get("ghostLocation") || $location`none`;
            if (ghostLocation === $location`none`) {
                throw `Something went wrong with my ghosts. Dammit, Walter Peck!`;
            }
            print(`Lonely rivers flow to the sea, to the sea. Time to wrastle a ghost.`, "blue");
            outfit(freeFightOutfit);
            ghostStasis.setAutoAttack();
            equip($slot`back`, $item`protonic accelerator pack`);
            restoreHp(myMaxhp());
            adv1(ghostLocation, -1, () => {
                return "";
            });
            outfit(slimeOutfit);
            stasisKill.setAutoAttack();
        }
        if (getCounters("Digitize", -11, 0) !== "") {
            print(
                `Remember the totem Elliot Page uses in Inception? Time to fight one of those`,
                "blue"
            );
            outfit(freeFightOutfit);
            pickBjorn();
            if (
                get("questPAGhost") === "unstarted" &&
                get("nextParanormalActivity") <= totalTurnsPlayed()
            ) {
                print(
                    'I can feel it coming in the air tonight, oh lord. And by "it" I mean "an upcoming ghost quest."',
                    "grey"
                );
                equip($slot`back`, $item`protonic accelerator pack`);
            }
            restoreHp(myMaxhp());
            advMacroAA(
                prepWandererZone(),
                Macro.externalIf(
                    get("_sourceTerminalDigitizeMonsterCount") >= 6 &&
                        get("_sourceTerminalDigitizeUses") < 3,
                    reDigitize
                ).step(stasisKill),
                () => {
                    return (
                        getCounters("Digitize", -11, 0) !== "" &&
                        (haveEffect($effect`Coated in Slime`) >= 6 ||
                            !have($effect`coated in slime`))
                    );
                },
                () => {
                    restoreHp(myMaxhp());
                }
            );
            outfit(slimeOutfit);
        }
        if (getCounters("Vote", 0, 0) !== "" && get("_voteFreeFights") < 3) {
            print(`The first tuesday in November approaches`, "blue");
            outfit(freeFightOutfit);
            pickBjorn();
            if (
                get("questPAGhost") === "unstarted" &&
                get("nextParanormalActivity") <= totalTurnsPlayed()
            ) {
                print(
                    'I can feel it coming in the air tonight, oh lord. And by "it" I mean "an upcoming ghost quest."',
                    "grey"
                );
                equip($slot`back`, $item`protonic accelerator pack`);
            }
            equip($slot`acc3`, $item`"I Voted!" sticker`);
            restoreHp(myMaxhp());
            advMacroAA(
                prepWandererZone(),
                stasisKill,
                () => {
                    return (
                        getCounters("Vote", 0, 0) !== "" &&
                        get("_voteFreeFights") < 3 &&
                        (haveEffect($effect`Coated in Slime`) >= 6 ||
                            !have($effect`coated in slime`))
                    );
                },
                () => {
                    restoreHp(myMaxhp());
                }
            );
            outfit(slimeOutfit);
        }
        if (totalTurnsPlayed() - get("_lastSausageMonsterTurn") + 1 >= kramcoNumber) {
            print(`It's kramco time!`, "purple");
            const sausageFights = get("_sausageFights");
            outfit(freeFightOutfit);
            pickBjorn();
            if (
                get("questPAGhost") === "unstarted" &&
                get("nextParanormalActivity") <= totalTurnsPlayed()
            ) {
                print(
                    'I can feel it coming in the air tonight, oh lord. And by "it" I mean "an upcoming ghost quest."',
                    "grey"
                );
                equip($slot`back`, $item`protonic accelerator pack`);
            }
            equip($slot`off-hand`, $item`Kramco Sausage-o-Matic™`);
            restoreHp(myMaxhp());
            advMacroAA(
                prepWandererZone(),
                stasisKill,
                () => {
                    return (
                        get("_sausageFights") === sausageFights &&
                        (haveEffect($effect`Coated in Slime`) >= 6 ||
                            !have($effect`coated in slime`))
                    );
                },
                () => {
                    restoreHp(myMaxhp());
                }
            );
            outfit(slimeOutfit);
            kramcoNumber =
                5 + 3 * get("_sausageFights") + Math.pow(Math.max(0, get("_sausageFights") - 5), 3);
        }
        if (haveEffect($effect`Coated in Slime`) === 0) {
            print(`Much like your stomach, I require a protective layer of slime`, "green");

            if (getClanId() !== wipeClan) {
                visitUrl(
                    `showclan.php?whichclan=` +
                        wipeClan.toString() +
                        `&action=joinclan&confirm=on&pwd`
                );
            }

            outfit(wipeOutfit);
            bjornifyFamiliar($familiar`pair of ragged claws`);
            cliExecute("mcd 0");

            if (haveEffect($effect`Ur-Kel's Aria of Annoyance`) > 0) {
                cliExecute("uneffect Ur-Kel");
            }
            if (
                Object.getOwnPropertyNames(getCampground()).includes("Asdon Martin keyfob") &&
                getFuel() > 50 &&
                !get("banishedMonsters").includes("Spring-Loaded Front Bumper")
            ) {
                useFamiliar($familiar`Left-Hand Man`);
                runAway.setAutoAttack();
            } else if (
                (familiarWeight($familiar`Frumious Bandersnatch`) + weightAdjustment()) / 5 >
                get("_banderRunaways")
            ) {
                useSkill(1, $skill`The Ode to Booze`);
                useFamiliar($familiar`frumious bandersnatch`);
                banderRun.setAutoAttack();
            } else if (get("_kgbTranquilizerDartUses") < 3) {
                useFamiliar($familiar`Left-Hand Man`);
                runAway.setAutoAttack();
                print(`GRU not yet implemented, using KGB instead`, "blue");
                equip($slot`acc2`, $item`Kremlin's Greatest Briefcase`);
            } //Next, give 'em the finger
            else if (!get("_mafiaMiddleFingerRingUsed")) {
                useFamiliar($familiar`Left-Hand Man`);
                runAway.setAutoAttack();
                print(`The bird is the word, and it's time to give 'em the word.`, "blue");
                equip($slot`acc2`, $item`mafia middle finger ring`);
            } //Reflex hammer
            else if (get("_reflexHammerUsed") < 3) {
                useFamiliar($familiar`Left-Hand Man`);
                runAway.setAutoAttack();
                print(`Little doc, little doc of horrors`, "blue");
                equip($slot`acc2`, $item`Lil' Doctor™ bag`);
            } //Latte next
            else if (!get("_latteBanishUsed")) {
                useFamiliar($familiar`Left-Hand Man`);
                runAway.setAutoAttack();
                print(`I really like you a Latte`, "blue");
                equip($slot`off-hand`, $item`Latte lovers member's mug`); //Latte
            } else {
                print(`Nothing funny about it, just throwing LTBs`, "blue");
                runAway.setAutoAttack();
                useFamiliar($familiar`Left-Hand Man`);
            }
            while (haveEffect($effect`Coated in Slime`) === 0) {
                restoreHp(myMaxhp());
                adv1($location`the slime tube`, -1, () => {
                    return "";
                });
            }

            if (haveEffect($effect`Ode to Booze`) !== 0) {
                cliExecute("shrug ode to booze");
            }
            useSkill(1, $skill`Ur-Kel's Aria of Annoyance`);

            cliExecute("mcd 11");

            useFamiliar($familiar`Stocking Mimic`);
            outfit(slimeOutfit);

            stasisKill.setAutoAttack();

            hopBack();
        }

        if (haveEffect($effect`beaten up`) !== 0) {
            throw `I'm beaten up! That isn't supposed to happen.`;
        }

        restoreHp(myMaxhp());

        print(`It's time to slime!`, "blue");
        stasisKill.setAutoAttack();
        while (
            myAdventures() > saveTurns &&
            haveEffect($effect`coated in slime`) >= 6 &&
            get("questPAGhost") === "unstarted" &&
            getCounters("Digitize", 0, 0) === "" &&
            getCounters("Vote", 0, 0) === "" &&
            totalTurnsPlayed() - get("_lastSausageMonsterTurn") + 1 < kramcoNumber &&
            get("lastEncounter") !== "Showdown"
        ) {
            try {
                adv1($location`the slime tube`, -1, () => {
                    return "";
                });
            } catch (e) {
                if (get("lastEncounter") !== "Showdown") {
                    throw e;
                }
            }
        }
        if (get("lastEncounter") === "Showdown") {
            break;
        }
    }

    if (get("lastEncounter") === "Showdown") {
        if (target === "nomom") {
            print("Mom is waiting.", "red");
        } else {
            if (haveEffect($effect`coated in slime`) < 6) {
                hopAndWipe();
                hopBack();
            }
            print(`Mama said 'knock me out!' I'm gonna knock her out!`, "red");
            equip($slot`acc1`, $item`powerful glove`);
            useSkill(1, $skill`CHEAT CODE: TRIPLE SIZE`);
            outfit(freeFightOutfit);
            cliExecute("ccs " + momCcs);
            restoreHp(myMaxhp());
            set("choiceAdventure326", 1);
            adv1($location`the slime tube`, -1, () => {
                return "";
            });
            set("choiceAdventure326", 0);
            printRandFromArray(momSlainMessages, "red");
        }
    } else if (myAdventures() === saveTurns) {
        print(`Looks like you're low on adventures, babe.`, "red");
    } else {
        print(`I'm not sure why this happened. Uh oh.`, "red");
    }
    set("stopForFixedWanderer", originalFixed);
    set("choiceAdventure1387", originalSaber);
    set("autoAbortThreshold", originalAbort);
    const endTime = gametimeToInt();
    const duration = endTime - startTime;
    print("Time elapsed: " + duration + " milliseconds. Pretty good, eh?", "blue");
}
