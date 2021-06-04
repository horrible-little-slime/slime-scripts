import { numericModifier, effectModifier, print } from "kolmafia";

const itemList = new Set(
    Item.all()
        .filter((item) => {
            return (
                item.fullness + item.spleen + item.inebriety === 0 &&
                item.tradeable &&
                (numericModifier(effectModifier(item, "Effect"), "Monster Level") > 0 ||
                    numericModifier(effectModifier(item, "Effect"), "Familiar Weight"))
            );
        })
        .map((item) => effectModifier(item, "Effect"))
);
const effectList = new Set(
    Effect.all().filter(
        (effect) =>
            !effect.attributes.includes("nohookah") &&
            (numericModifier(effect, "Monster Level") > 0 ||
                numericModifier(effect, "Familiar Weight"))
    )
);
const totalEffectList = new Set([...effectList, ...itemList]);
totalEffectList.forEach((effect) => print(effect.name, "blue"));
let sum = 0;
totalEffectList.forEach((effect) => {
    sum += numericModifier(effect, "Monster Level");
    sum += (1 / 2) * numericModifier(effect, "Familiar Weight");
});

print(sum.toString(), "green");
