import { getProperty } from "kolmafia";
import { $item, $monster, get, Macro } from "libram";

export const stasis = Macro.skill("curse of weaksauce")
    .skill("micrometeor")
    .skill("shadow noodles")
    .skill("sing along")
    .skill("extract")
    .skill("summon love gnats")
    .skill("shell up")
    .item("time-spinner", "HOA citation pad")
    .item("little red book")
    .item("nasty-smelling moss")
    .item("great wolf's lice")
    .item("mayor ghost's scissors");

export const stasisKill = Macro.step(stasis)
    .skill("silent treatment")
    .trySkillRepeat("shieldbutt")
    .trySkillRepeat("kneebutt")
    .attack()
    .repeat();

export const ghostStasis = Macro.step(stasis)
    .skill("shoot ghost")
    .skill("shoot ghost")
    .skill("shoot ghost")
    .skill("trap ghost");

const digitizeName = getProperty("_sourceTerminalDigitizeMonster");
export const reDigitize = Macro.if_(
    `monsterid ${$monster`${digitizeName !== "" ? digitizeName : "none"}`.id}`,
    Macro.skill("digitize")
);

export const runAway = Macro.trySkill("Spring-Loaded Front Bumper")
    .trySkill("Show them your ring")
    .trySkill("throw latte")
    .trySkill("KGB tranquilizer dart")
    .trySkill("reflex hammer")
    .trySkill("snokebomb")
    .trySkill("use the force")
    .trySkill("feel hatred")
    .tryItem($item`louder than bomb`)
    .tryItem($item`tennis ball`)
    .tryItem($item`divine champagne popper`)
    .tryItem($item`tattered scrap of paper`)
    .abort();

export const banderRun = Macro.skill("extract").step("runaway");
