import {
    choiceFollowsFight,
    haveSkill,
    inMultiFight,
    myFamiliar,
    runCombat,
    visitUrl,
} from "kolmafia";
import { $familiar, $item, $monster, $skill, Macro } from "libram";
import { getNumber } from "libram/dist/property";

function multiFight() {
    while (inMultiFight()) runCombat();
    if (choiceFollowsFight()) visitUrl("choice.php");
}

export function main(initround: number, foe: Monster, pageText: string) {
    if (foe === $monster`LOV Enforcer`) {
        Macro.attack().repeat().submit();
        multiFight();
    }
    if (foe === $monster`LOV Engineer`) {
        Macro.skill($skill`saucegeyser`)
            .repeat()
            .submit();
        multiFight();
    }
    if (foe === $monster`LOV Equivocator`) {
        Macro.skill($skill`extract`)
            .skill($skill`sing along`)
            .skill($skill`Feel Pride`)
            .skill($skill`Army of Toddlers`)
            .attack()
            .repeat()
            .submit();
        multiFight();
    }
    if (foe === $monster`pygmy orderlies`) {
        Macro.trySkill($skill`snokebomb`)
            .trySkill($skill`Feel Hatred`)
            .item($item`Louder than Bomb`)
            .submit();
    }
    if (foe === $monster`eldritch tentacle` && myFamiliar() === $familiar`stocking mimic`) {
        Macro.skill($skill`curse of weaksauce`)
            .skill($skill`micrometeor`)
            .skill($skill`sing along`)
            .skill($skill`extract`)
            .skill($skill`love gnats`)
            .skill($skill`shell up`)
            .item([$item`time-spinner`, $item`hoa citation pad`])
            .item([$item`great wolf's lice`, $item`little red book`])
            .item([$item`mayor ghost's scissors`, $item`nasty-smelling moss`])
            .skill($skill`silent treatment`)
            .attack()
            .repeat()
            .submit();
    }
    if (myFamiliar() === $familiar`Pocket Professor`) {
        Macro.skill($skill`curse of weaksauce`)
            .externalIf(
                !haveSkill($skill`Lecture on Relativity`) && getNumber("_meteorShowerUses") === 0,
                Macro.skill($skill`meteor shower`)
            )
            .skill($skill`extract`)
            .skill($skill`sing along`)
            .if_("(!hasskill 7319) && (hasskill 7316)", Macro.skill($skill`Deliver Your Thesis`))
            .if_("hasskill 7319", Macro.skill($skill`Lecture on Relativity`))
            .attack()
            .repeat()
            .submit();
        multiFight();
    }
}
