import { getClanId, getClanName, getPlayerId, print, visitUrl, xpath } from "kolmafia";
import { $item, $items } from "libram";

const skillGlands = $items`slime-soaked brain, slime-soaked hypophysis, slime-soaked sweat gland`;
const otherLoot = $items`squirming slime larva, caustic slime nodule, hardened slime belt, hardened slime hat, hardened slime pants`;

const clans = [2046990996, 2046994009, 2047007372, 2047007743, 2047008472];

function whitelist(clan: number) {
    visitUrl(`showclan.php?whichclan=` + clan.toString() + `&action=joinclan&confirm=on&pwd`);
}

function distro(client: string) {
    const pageText = visitUrl("clan_basement.php");
    const itemNames = xpath(pageText, "//tr/td[2]/b/text()");
    const whichLoots = xpath(
        pageText,
        '//form[@action="clan_basement.php"]//input[@type="hidden"][@name="whichloot"]/@value'
    );
    if (!pageText.match(client)) {
        throw `Uh oh buddy your client can't get loot from ` + getClanName();
    }
    itemNames.forEach((itemName, index) => {
        if (skillGlands.includes($item`${itemName}`)) {
            visitUrl(`clan_basement.php?whichloot=${whichLoots[index]}&recipient=${client}`);
        } else if (otherLoot.includes($item`${itemName}`)) {
            visitUrl(`clan_basement.php?whichloot=${whichLoots[index]}&recipient=1515124`);
        }
    });
}

export function main(clientName: string) {
    if (!clientName) {
        print("Who gets the slime skills, dumbass?", "red");
    } else {
        const clientId = getPlayerId(clientName).toString();
        const endMessages: string[] = [];
        for (const clan of clans) {
            if (getClanId() !== clan) {
                whitelist(clan);
            }
            if (/tube_empty.gif/.test(visitUrl("clan_slimetube.php"))) {
                distro(clientId);
                endMessages.push(`${getClanName()} distroed (and rolled)`);
                visitUrl("clan_basement.php?action=sealtube&confirm=true", true);
                visitUrl("clan_stash.php?action=contribute&howmuch=250000", true);
                visitUrl("clan_basement.php?action=cleanspot", true);
            } else {
                endMessages.push(`${getClanName()} is still in progress`);
            }
        }
        endMessages.forEach((msg) => {
            print(msg, "blue");
        });
    }
}
