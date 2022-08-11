Spells = {
    spells: [{
            id: 1,
            name: "时间隧道",
            tooltip: "加速时间流 30 秒",
            icon: "",
            cooldown: 120,
            duration: 30,
            energyCost: 0,
            start() {
                GameModel.gameSpeed = 2;
            },
            end() {
                GameModel.gameSpeed = 1;
            }
        },
        {
            id: 2,
            name: "能量激流",
            tooltip: "5x 能量增率持续 20 秒,消耗 50 能量",
            icon: "",
            cooldown: 180,
            duration: 20,
            energyCost: 50,
            start() {
                GameModel.energySpellMultiplier = 5;
            },
            end() {
                GameModel.energySpellMultiplier = 1;
            }
        },
        {
            id: 3,
            name: "引爆",
            tooltip: "引爆你的僵尸成为瘟疫云,消耗 69 能量...不错",
            icon: "",
            cooldown: 120,
            duration: 3,
            energyCost: 69,
            start() {
                Zombies.detonate = true;
            },
            end() {
                Zombies.detonate = false;
            }
        },
        {
            id: 4,
            name: "大地冻结",
            tooltip: "将所有人类冻结在原地,防止他们移动 15 秒,消耗 75 能量",
            icon: "",
            cooldown: 60,
            duration: 15,
            energyCost: 75,
            start() {
                Humans.frozen = true;
            },
            end() {
                Humans.frozen = false;
            }
        },
        {
            id: 5,
            name: "巨型僵尸",
            tooltip: "在 5 秒内出生的僵尸会变得巨大化,获得 10x 生命值和攻击伤害,消耗 100 能量",
            icon: "",
            cooldown: 360,
            duration: 5,
            energyCost: 100,
            start() {
                Zombies.super = true;
            },
            end() {
                Zombies.super = false;
            }
        }
    ],
    lockAllSpells() {
        for (var i = 0; i < this.spells.length; i++) {
            this.spells[i].unlocked = false;
        }
    },
    unlockSpell(spellId) {
        for (var i = 0; i < this.spells.length; i++) {
            if (spellId == this.spells[i].id) {
                this.spells[i].unlocked = true;
            }
        }
    },
    getSpell(spellId) {
        for (var i = 0; i < this.spells.length; i++) {
            if (spellId == this.spells[i].id) {
                return this.spells[i];
            }
        }
    },
    getUnlockedSpells() {
        return this.spells.filter(spell => spell.unlocked);
    },
    castSpell(spell) {
        if (spell.onCooldown || spell.active || !spell.unlocked)
            return false;

        if (spell.energyCost > GameModel.energy)
            return false;

        GameModel.energy -= spell.energyCost;
        spell.onCooldown = true;
        spell.cooldownLeft = spell.cooldown;
        spell.active = true;
        spell.timer = spell.duration;
        spell.start();
        GameModel.sendMessage(spell.name);
    },
    updateSpells(timeDiff) {
        for (var i = 0; i < this.spells.length; i++) {
            var spell = this.spells[i];

            if (spell.onCooldown) {
                spell.cooldownLeft -= timeDiff;
                if (spell.cooldownLeft <= 0) {
                    spell.onCooldown = false;
                }
            }

            if (spell.active) {
                spell.timer -= timeDiff;
                if (spell.timer <= 0) {
                    spell.active = false;
                    spell.end();
                }
            }
        }
    }
};

for (var i = 0; i < Spells.spells.length; i++) {
    Spells.spells[i].onCooldown = false;
    Spells.spells[i].active = false;
    Spells.spells[i].cooldownLeft = 0;
    Spells.spells[i].timer = 0;
}