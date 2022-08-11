Upgrades = {

    types: {
        energyRate: "energyRate",
        energyCap: "energyCap",
        damage: "damage",
        health: "health",
        speed: "speed",
        brainsRate: "brainsRate",
        bonesRate: "bonesRate",
        energyRate: "energyRate",
        bloodCap: "bloodCap",
        brainsCap: "brainsCap",
        brainRecoverChance: "brainRecoverChance",
        riseFromTheDeadChance: "riseFromTheDeadChance",
        boneCollectorCapacity: "boneCollectorCapacity",
        construction: "construction",
        infectedBite: "infectedBite",
        infectedBlast: "infectedBlast",
        plagueDamagePC: "plagueDamagePC",
        burningSpeedPC: "burningSpeedPC",
        unlockSpell: "unlockSpell",
        spitDistance: "spitDistance",
        blastHealing: "blastHealing",
        plagueArmor: "plagueArmor",
        monsterLimit: "monsterLimit",
        runicSyphon: "runicSyphon",
        gigazombies: "gigazombies",
        bulletproof: "bulletproof",
        harpySpeed: "harpySpeed",
        tankBuster: "tankBuster",
        harpyBombs: "harpyBombs",
        // prestige items
        bloodGainPC: "bloodGainPC",
        bloodStoragePC: "bloodStoragePC",
        brainsGainPC: "brainsGainPC",
        brainsStoragePC: "brainsStoragePC",
        bonesGainPC: "bonesGainPC",
        partsGainPC: "partsGainPC",
        zombieDmgPC: "zombieDmgPC",
        zombieHealthPC: "zombieHealthPC",
        startingPC: "startingPC",
        energyCost: "energyCost",
        autoconstruction: "autoconstruction",
        autoshop: "autoshop",
        graveyardHealth: "graveyardHealth"
    },

    costs: {
        energy: "energy",
        blood: "blood",
        brains: "brains",
        bones: "bones",
        prestigePoints: "prestigePoints",
        parts: "parts"
    },

    hasRequirement(upgrade) {
        if (upgrade.requires && GameModel.persistentData.constructions.filter(built => built.id == upgrade.requires).length == 0) {
            return false;
        }
        return true;
    },

    getUpgrades(type) {
        switch (type) {
            case this.costs.blood:
            case this.costs.brains:
            case this.costs.bones:
            case this.costs.parts:
                return this.upgrades.filter(upgrade => upgrade.costType == type && (upgrade.cap == 0 || this.currentRank(upgrade) < upgrade.cap) && this.hasRequirement(upgrade));
            case "completed":
                return this.upgrades.filter(upgrade => upgrade.cap > 0 && this.currentRank(upgrade) >= upgrade.cap);
        }
    },

    applyUpgrades() {
        GameModel.resetToBaseStats();
        Spells.lockAllSpells();
        for (var i = 0; i < GameModel.persistentData.upgrades.length; i++) {
            var upgrade = Upgrades.upgrades.filter(up => up.id == GameModel.persistentData.upgrades[i].id)[0];
            if (!upgrade) {
                upgrade = Upgrades.prestigeUpgrades.filter(up => up.id == GameModel.persistentData.upgrades[i].id)[0];
            }
            if (upgrade) {
                this.applyUpgrade(upgrade, GameModel.persistentData.upgrades[i].rank);
            }
        }
        for (var i = 0; i < GameModel.persistentData.constructions.length; i++) {
            this.applyConstructionUpgrade(GameModel.persistentData.constructions[i]);
        }
        var trophies = Trophies.getAquiredTrophyList();
        for (var i = 0; i < trophies.length; i++) {
            this.applyUpgrade(trophies[i], trophies[i].rank);
        }
        GameModel.bloodMax *= GameModel.bloodStorePCMod;
        GameModel.brainsMax *= GameModel.brainsStorePCMod;
        GameModel.zombieDamage *= GameModel.zombieDamagePCMod;
        GameModel.zombieHealth *= GameModel.zombieHealthPCMod;
        if (GameModel.persistentData.gigazombiesOn) {
            GameModel.zombieCost *= 5;
        }
    },

    applyUpgrade(upgrade, rank) {
        switch (upgrade.type) {
            case this.types.energyRate:
                GameModel.energyRate += upgrade.effect * rank;
                return;
            case this.types.brainsRate:
                GameModel.brainsRate += upgrade.effect * rank;
                return;
            case this.types.bonesRate:
                GameModel.bonesRate += upgrade.effect * rank;
                return;
            case this.types.energyCap:
                GameModel.energyMax += upgrade.effect * rank;
                return;
            case this.types.bloodCap:
                GameModel.bloodMax += upgrade.effect * rank;
                return;
            case this.types.brainsCap:
                GameModel.brainsMax += upgrade.effect * rank;
                return;
            case this.types.damage:
                GameModel.zombieDamage += upgrade.effect * rank;
                return;
            case this.types.speed:
                GameModel.zombieSpeed += upgrade.effect * rank;
                return;
            case this.types.health:
                GameModel.zombieHealth += upgrade.effect * rank;
                return;
            case this.types.brainRecoverChance:
                GameModel.brainRecoverChance += upgrade.effect * rank;
                return;
            case this.types.riseFromTheDeadChance:
                GameModel.riseFromTheDeadChance += upgrade.effect * rank;
                return;
            case this.types.infectedBite:
                GameModel.infectedBiteChance += upgrade.effect * rank;
                return;
            case this.types.infectedBlast:
                GameModel.infectedBlastChance += upgrade.effect * rank;
                return;
            case this.types.plagueDamagePC:
                GameModel.plagueDamagePCMod *= Math.pow(1 + upgrade.effect, rank);
                return;
            case this.types.burningSpeedPC:
                GameModel.burningSpeedMod += upgrade.effect * rank;
                return;
            case this.types.construction:
                GameModel.construction = 1;
                return;
            case this.types.boneCollectorCapacity:
                GameModel.boneCollectorCapacity += upgrade.effect * rank;
                return;
            case this.types.unlockSpell:
                Spells.unlockSpell(upgrade.effect);
                return;
            case this.types.spitDistance:
                GameModel.spitDistance = 30 + upgrade.effect * rank;
                return
            case this.types.blastHealing:
                GameModel.blastHealing += upgrade.effect * rank;
                return;
            case this.types.plagueArmor:
                GameModel.plagueDmgReduction -= upgrade.effect * rank;
                return;
            case this.types.monsterLimit:
                GameModel.creatureLimit += upgrade.effect * rank;
                return;
            case this.types.runicSyphon:
                GameModel.runicSyphon.percentage += upgrade.effect * rank;
                return;
            case this.types.gigazombies:
                GameModel.gigazombies = true;
                return;
            case this.types.bulletproof:
                GameModel.bulletproofChance += upgrade.effect * rank;
                return;
            case this.types.harpySpeed:
                GameModel.harpySpeed += upgrade.effect * rank;
                return;
            case this.types.tankBuster:
                GameModel.tankBuster = true;
                return;
            case this.types.harpyBombs:
                GameModel.harpyBombs += upgrade.effect * rank;
                return;
                // prestige items
            case this.types.bonesGainPC:
                GameModel.bonesPCMod *= Math.pow(1 + upgrade.effect, rank);
                return;
            case this.types.partsGainPC:
                GameModel.partsPCMod *= Math.pow(1 + upgrade.effect, rank);
                return;
            case this.types.bloodGainPC:
                GameModel.bloodPCMod *= Math.pow(1 + upgrade.effect, rank);
                return;
            case this.types.bloodStoragePC:
                GameModel.bloodStorePCMod *= Math.pow(1 + upgrade.effect, rank);
                return;
            case this.types.brainsGainPC:
                GameModel.brainsPCMod *= Math.pow(1 + upgrade.effect, rank);
                return;
            case this.types.brainsStoragePC:
                GameModel.brainsStorePCMod *= Math.pow(1 + upgrade.effect, rank);
                return;
            case this.types.zombieDmgPC:
                // GameModel.zombieDamagePCMod += upgrade.effect * upgrade.rank;
                GameModel.zombieDamagePCMod *= Math.pow(1 + upgrade.effect, rank);
                return;
            case this.types.zombieHealthPC:
                // GameModel.zombieHealthPCMod += upgrade.effect * upgrade.rank;
                GameModel.zombieHealthPCMod *= Math.pow(1 + upgrade.effect, rank);
                return;
            case this.types.startingPC:
                GameModel.startingResources += upgrade.effect * rank;
                return;
            case this.types.energyCost:
                GameModel.zombieCost -= upgrade.effect * rank;
                return;
            case this.types.autoconstruction:
                GameModel.autoconstructionUnlocked = true;
                return;
            case this.types.autoshop:
                GameModel.autoUpgrades = true;
                return;
            case this.types.graveyardHealth:
                GameModel.graveyardHealthMod *= Math.pow(1 + upgrade.effect, rank);
                return;
        }
    },

    applyConstructionUpgrade(upgrade) {
        switch (upgrade.type) {
            case this.constructionTypes.graveyard:
                GameModel.constructions.graveyard = 1;
                return;
            case this.constructionTypes.crypt:
                GameModel.constructions.crypt = 1;
                // GameModel.brainsStorePCMod += 0.5;
                // GameModel.bloodStorePCMod += 0.5;
                GameModel.brainsStorePCMod *= 1.5;
                GameModel.bloodStorePCMod *= 1.5;
                return;
            case this.constructionTypes.fort:
                GameModel.constructions.fort = 1;
                // GameModel.brainsStorePCMod += 0.6;
                // GameModel.bloodStorePCMod += 0.6;
                GameModel.brainsStorePCMod *= 1.6;
                GameModel.bloodStorePCMod *= 1.6;
                return;
            case this.constructionTypes.fortress:
                GameModel.constructions.fortress = 1;
                // GameModel.brainsStorePCMod += 0.7;
                // GameModel.bloodStorePCMod += 0.7;
                GameModel.brainsStorePCMod *= 1.7;
                GameModel.bloodStorePCMod *= 1.7;
                return;
            case this.constructionTypes.citadel:
                GameModel.constructions.citadel = 1;
                // GameModel.brainsStorePCMod += 0.8;
                // GameModel.bloodStorePCMod += 0.8;
                // GameModel.brainsStorePCMod *= 1.8;
                // GameModel.bloodStorePCMod *= 1.8;
                return;
            case this.constructionTypes.plagueSpikes:
                GameModel.constructions.plagueSpikes = 1;
                return;
            case this.constructionTypes.fence:
                GameModel.constructions.fence = 1;
                return;
            case this.constructionTypes.fenceSize:
                GameModel.fenceRadius += upgrade.effect * upgrade.rank;
                return;
            case this.constructionTypes.pit:
                GameModel.bloodMax += 1000000 * upgrade.rank;
                GameModel.brainsMax += 100000 * upgrade.rank;
                return;
            case this.constructionTypes.runesmith:
                GameModel.constructions.runesmith = 1;
                if (!GameModel.persistentData.runes) {
                    GameModel.persistentData.runes = {
                        life: {
                            blood: 0,
                            brains: 0,
                            bones: 0
                        },
                        death: {
                            blood: 0,
                            brains: 0,
                            bones: 0
                        }
                    }
                }
                return;
            case this.constructionTypes.aviary:
                GameModel.constructions.aviary = 1;
                return;
            case this.constructionTypes.zombieCage:
                GameModel.zombieCages += upgrade.effect * upgrade.rank;
                return;
            case this.constructionTypes.partFactory:
                GameModel.constructions.partFactory = true;
                GameModel.constructions.factory = true;
                return;
            case this.constructionTypes.monsterFactory:
                GameModel.constructions.monsterFactory = true;
                GameModel.constructions.factory = true;
                return;
        }
    },

    displayStatValue(upgrade) {
        switch (upgrade.type) {
            case this.types.energyRate:
                return "能量增率: " + format2Places(GameModel.energyRate) + " 每秒";
            case this.types.energyCap:
                return "能量上限: " + formatWhole(GameModel.energyMax);
            case this.types.bloodCap:
                return "血液上限: " + formatWhole(GameModel.bloodMax);
            case this.types.brainsCap:
                return "大脑上限: " + formatWhole(GameModel.brainsMax);
            case this.types.damage:
                return "僵尸伤害: " + formatWhole(GameModel.zombieDamage);
            case this.types.speed:
                return "僵尸速度: " + formatWhole(GameModel.zombieSpeed);
            case this.types.health:
                return "僵尸生命值上限: " + formatWhole(GameModel.zombieHealth);
            case this.types.brainRecoverChance:
                return Math.round(GameModel.brainRecoverChance * 100) + "% 几率回收大脑";
            case this.types.riseFromTheDeadChance:
                return Math.round(GameModel.riseFromTheDeadChance * 100) + "% 几率将尸体转化成僵尸";
            case this.types.infectedBite:
                return Math.round(GameModel.infectedBiteChance * 100) + "% 几率僵尸感染它们的目标";
            case this.types.infectedBlast:
                return Math.round(GameModel.infectedBlastChance * 100) + "% 几率僵尸在死亡时爆炸";
            case this.types.bulletproof:
                return Math.round(GameModel.bulletproofChance * 100) + "% 几率大地傀儡子弹反射";
            case this.types.construction:
                return GameModel.construction > 0 ? "你已经解锁了邪恶建筑" : "你还没解锁邪恶建筑";
            case this.types.boneCollectorCapacity:
                return "骨骼收集者携带量: " + formatWhole(GameModel.boneCollectorCapacity);
            case this.types.bonesGainPC:
                return "骨骼: " + Math.round(GameModel.bonesPCMod * 100) + "%";
            case this.types.partsGainPC:
                return "部件: " + Math.round(GameModel.partsPCMod * 100) + "%";
            case this.types.bloodGainPC:
                return "血液: " + Math.round(GameModel.bloodPCMod * 100) + "%";
            case this.types.bloodStoragePC:
                return "血液库存: " + formatWhole(GameModel.bloodStorePCMod * 100) + "%";
            case this.types.brainsGainPC:
                return "大脑: " + Math.round(GameModel.brainsPCMod * 100) + "%";
            case this.types.brainsStoragePC:
                return "大脑库存: " + formatWhole(GameModel.brainsStorePCMod * 100) + "%";
            case this.types.zombieDmgPC:
                return "僵尸伤害: " + Math.round(GameModel.zombieDamagePCMod * 100) + "%";
            case this.types.zombieHealthPC:
                return "僵尸生命值: " + Math.round(GameModel.zombieHealthPCMod * 100) + "%";
            case this.types.startingPC:
                return Math.round(GameModel.startingResources * 500) + " 血液, " + Math.round(GameModel.startingResources * 50) + " 大脑, " + Math.round(GameModel.startingResources * 200) + " 骨骼";
            case this.types.unlockSpell:
                return this.currentRank(upgrade) > 0 ? "你已经学会了这个法术" : "你还没学会了这个法术";
            case this.types.energyCost:
                return "僵尸花费: " + GameModel.zombieCost + " 能量";
            case this.types.burningSpeedPC:
                return "点燃僵尸速度: " + Math.round(GameModel.burningSpeedMod * 100) + "%";
            case this.types.blastHealing:
                return "瘟疫治疗: " + Math.round(GameModel.blastHealing * 100) + "%";
            case this.types.spitDistance:
                return "僵尸吐息范围: " + GameModel.spitDistance;
            case this.types.plagueArmor:
                return "受感染伤害削减: " + Math.round(100 - (GameModel.plagueDmgReduction * 100)) + "%";
            case this.types.monsterLimit:
                return "生物数量限制: " + GameModel.creatureLimit;
            case this.types.runicSyphon:
                return "虹吸数量: " + Math.round(GameModel.runicSyphon.percentage * 100) + "%";
            case this.types.autoconstruction:
                return this.currentRank(upgrade) > 0 ? "你已经解锁了自动建造" : "你还没解锁自动建造";
            case this.types.autoshop:
                return this.currentRank(upgrade) > 0 ? "你已经解锁了自动商店购买" : "你还没解锁自动商店购买";
            case this.types.graveyardHealth:
                return "墓地生命值: " + Math.round(GameModel.graveyardHealthMod * 100) + "%";
            case this.types.gigazombies:
                return this.currentRank(upgrade) > 0 ? "你已经解锁了更多巨型僵尸" : "你还没解锁更多巨型僵尸";
            case this.types.harpySpeed:
                return "鸟身女妖速度: " + formatWhole(GameModel.harpySpeed);
            case this.types.harpyBombs:
                return "鸟身女妖携带炸弹: " + formatWhole(GameModel.harpyBombs);
            case this.types.tankBuster:
                return this.currentRank(upgrade) > 0 ? "你已经解锁了坦克破坏" : "你还没解锁坦克破坏";
        }
    },

    currentRank(upgrade) {
        for (var i = 0; i < GameModel.persistentData.upgrades.length; i++) {
            var ownedUpgrade = GameModel.persistentData.upgrades[i];
            if (upgrade.id == ownedUpgrade.id) {
                return ownedUpgrade.rank;
            }
        }
        return 0;
    },

    currentRankConstruction(upgrade) {
        if (GameModel.persistentData.constructions)
            for (var i = 0; i < GameModel.persistentData.constructions.length; i++) {
                var ownedUpgrade = GameModel.persistentData.constructions[i];
                if (upgrade.id == ownedUpgrade.id) {
                    return ownedUpgrade.rank;
                }
            }
        return 0;
    },

    upgradePrice(upgrade) {
        return Math.round(upgrade.basePrice * Math.pow(upgrade.multiplier, this.currentRank(upgrade)));
    },

    upgradeMaxAffordable(upgrade) {
        var currentRank = this.currentRank(upgrade);
        var maxAffordable = 0;
        switch (upgrade.costType) {
            case this.costs.blood:
                maxAffordable = getMaxUpgrades(upgrade.basePrice, upgrade.multiplier, currentRank, GameModel.persistentData.blood);
                break;
            case this.costs.brains:
                maxAffordable = getMaxUpgrades(upgrade.basePrice, upgrade.multiplier, currentRank, GameModel.persistentData.brains);
                break;
            case this.costs.bones:
                maxAffordable = getMaxUpgrades(upgrade.basePrice, upgrade.multiplier, currentRank, GameModel.persistentData.bones);
                break;
            case this.costs.parts:
                maxAffordable = getMaxUpgrades(upgrade.basePrice, upgrade.multiplier, currentRank, GameModel.persistentData.parts);
                break;
            case this.costs.prestigePoints:
                maxAffordable = getMaxUpgrades(upgrade.basePrice, upgrade.multiplier, currentRank, GameModel.persistentData.prestigePointsToSpend);
                break;
        }
        if (upgrade.cap != 0) {
            return Math.min(maxAffordable, upgrade.cap - currentRank);
        }
        return maxAffordable;
    },

    upgradeMaxPrice(upgrade, number) {
        return getCostForUpgrades(upgrade.basePrice, upgrade.multiplier, this.currentRank(upgrade), number);
    },

    canAffordUpgrade(upgrade) {
        if (upgrade.cap > 0 && this.currentRank(upgrade) >= upgrade.cap) {
            upgrade.auto = false;
            return false;
        }
        switch (upgrade.costType) {
            case this.costs.energy:
                return GameModel.energy >= this.upgradePrice(upgrade);
            case this.costs.blood:
                return GameModel.persistentData.blood >= this.upgradePrice(upgrade);
            case this.costs.brains:
                return GameModel.persistentData.brains >= this.upgradePrice(upgrade);
            case this.costs.bones:
                return GameModel.persistentData.bones >= this.upgradePrice(upgrade);
            case this.costs.parts:
                return GameModel.persistentData.parts >= this.upgradePrice(upgrade);
            case this.costs.prestigePoints:
                return GameModel.persistentData.prestigePointsToSpend >= this.upgradePrice(upgrade);
        }
        return false;
    },

    constructionLeadsTo(construction) {
        return this.constructionUpgrades.filter(upgrade => upgrade.requires == construction.id)
            .concat(this.upgrades.filter(upgrade => upgrade.requires == construction.id))
            .map(upgrade => upgrade.name).join(", ");
    },

    purchaseMaxUpgrades(upgrade) {
        var amount = this.upgradeMaxAffordable(upgrade);
        for (var i = 0; i < amount; i++) {
            this.purchaseUpgrade(upgrade, false);
        }
        GameModel.saveData();
    },

    purchaseUpgrade(upgrade, save = true) {
        if (this.canAffordUpgrade(upgrade)) {
            var prestige = false;
            switch (upgrade.costType) {
                case this.costs.energy:
                    GameModel.energy -= this.upgradePrice(upgrade);
                    break;
                case this.costs.blood:
                    GameModel.persistentData.blood -= this.upgradePrice(upgrade);
                    break;
                case this.costs.brains:
                    GameModel.persistentData.brains -= this.upgradePrice(upgrade);
                    break;
                case this.costs.bones:
                    GameModel.persistentData.bones -= this.upgradePrice(upgrade);
                    break;
                case this.costs.prestigePoints:
                    prestige = true;
                    GameModel.persistentData.prestigePointsToSpend -= this.upgradePrice(upgrade);
                    break;
                case this.costs.parts:
                    GameModel.persistentData.parts -= this.upgradePrice(upgrade);
                    break;
            }
            var ownedUpgrade;
            for (var i = 0; i < GameModel.persistentData.upgrades.length; i++) {
                if (upgrade.id == GameModel.persistentData.upgrades[i].id) {
                    ownedUpgrade = true;
                    GameModel.persistentData.upgrades[i] = {
                        id: upgrade.id,
                        rank: GameModel.persistentData.upgrades[i].rank + 1
                    };
                    if (prestige) {
                        GameModel.persistentData.upgrades[i].costType = this.costs.prestigePoints;
                    }
                    break;
                }
            }
            if (!ownedUpgrade) {
                var persistUpgrade = {
                    id: upgrade.id,
                    rank: 1
                };
                if (prestige) {
                    persistUpgrade.costType = this.costs.prestigePoints;
                }
                GameModel.persistentData.upgrades.push(persistUpgrade);
            }


            if (save)
                GameModel.saveData();

            this.applyUpgrades();
            if (upgrade.purchaseMessage) {
                GameModel.sendMessage(upgrade.purchaseMessage);
            }
        }
    },

    constructionStates: {
        building: "building",
        paused: "paused",
        autoPaused: "autoPaused"
    },

    constructionTickTimer: 1,

    consumeResources(costPerTick) {
        // check for full availablity first
        var hasEnough = true;
        GameModel.persistentData.currentConstruction.shortfall = {};
        if (costPerTick.energy && costPerTick.energy > GameModel.energy) {
            hasEnough = false;
            GameModel.persistentData.currentConstruction.shortfall.energy = true;
        }
        if (costPerTick.blood && costPerTick.blood > GameModel.persistentData.blood) {
            hasEnough = false;
            GameModel.persistentData.currentConstruction.shortfall.blood = true;
        }
        if (costPerTick.brains && costPerTick.brains > GameModel.persistentData.brains) {
            hasEnough = false;
            GameModel.persistentData.currentConstruction.shortfall.brains = true;
        }
        if (costPerTick.bones && costPerTick.bones > GameModel.persistentData.bones) {
            hasEnough = false;
            GameModel.persistentData.currentConstruction.shortfall.bones = true;
        }
        if (costPerTick.parts && costPerTick.parts > GameModel.persistentData.parts) {
            hasEnough = false;
            GameModel.persistentData.currentConstruction.shortfall.parts = true;
        }
        if (!hasEnough)
            return false;

        GameModel.persistentData.currentConstruction.shortfall = false;
        // then consume
        if (costPerTick.energy)
            GameModel.energy -= costPerTick.energy;
        if (costPerTick.blood)
            GameModel.persistentData.blood -= costPerTick.blood;
        if (costPerTick.brains)
            GameModel.persistentData.brains -= costPerTick.brains;
        if (costPerTick.bones)
            GameModel.persistentData.bones -= costPerTick.bones;
        if (costPerTick.parts)
            GameModel.persistentData.parts -= costPerTick.parts;
        return true;
    },

    completeConstruction() {
        var upgrade = Upgrades.constructionUpgrades.filter(upgrade => upgrade.id == GameModel.persistentData.currentConstruction.id)[0];
        var ownedUpgrade;
        for (var i = 0; i < GameModel.persistentData.constructions.length; i++) {
            if (upgrade.id == GameModel.persistentData.constructions[i].id) {
                ownedUpgrade = GameModel.persistentData.constructions[i];
                ownedUpgrade.effect = upgrade.effect;
                ownedUpgrade.rank++;
            }
        }
        if (!ownedUpgrade)
            GameModel.persistentData.constructions.push({
                id: upgrade.id,
                name: upgrade.name,
                rank: 1,
                type: upgrade.type,
                effect: upgrade.effect
            });
        GameModel.persistentData.currentConstruction = false;
        GameModel.saveData();
        this.applyUpgrades();
        this.angularModel.updateConstructionUpgrades();
        GameModel.sendMessage("建造 " + upgrade.name + " 已完成!");
        if (upgrade.completeMessage) {
            GameModel.sendMessage(upgrade.completeMessage);
        }
    },

    updateAutoUpgrades() {
        if (GameModel.autoUpgrades) {
            for (var i = 0; i < this.upgrades.length; i++) {
                if (this.upgrades[i].auto) {
                    this.purchaseUpgrade(this.upgrades[i], false);
                }
            }
        }
    },

    updateConstruction(timeDiff) {
        if ((!GameModel.persistentData.currentConstruction && !GameModel.autoconstruction) || GameModel.persistentData.currentConstruction.state == this.constructionStates.paused)
            return false;

        if (GameModel.persistentData.currentConstruction) {
            this.constructionTickTimer -= timeDiff;
            if (this.constructionTickTimer < 0) {
                this.constructionTickTimer = 1;
                if (this.consumeResources(GameModel.persistentData.currentConstruction.costPerTick)) {
                    GameModel.persistentData.currentConstruction.state = this.constructionStates.building;
                    GameModel.persistentData.currentConstruction.timeRemaining -= 1;
                    if (GameModel.persistentData.currentConstruction.timeRemaining <= 0) {
                        this.completeConstruction();
                    }
                } else {
                    GameModel.persistentData.currentConstruction.state = this.constructionStates.autoPaused;
                }
            }
        } else if (GameModel.autoconstruction) {
            var upgrades = this.getAvailableConstructions();
            if (!upgrades || upgrades.length == 0) {
                GameModel.autoconstruction = false;
                return;
            }
            var cheapestUpgrade = false;
            var lowestCost = 0;
            for (var i = 0; i < upgrades.length; i++) {
                var cost = (upgrades[i].costs.energy || 0) + (upgrades[i].costs.blood || 0) + (upgrades[i].costs.brains || 0) + (upgrades[i].costs.bones || 0) + ((upgrades[i].costs.parts || 0) * 100);
                if (cost < lowestCost || !cheapestUpgrade) {
                    lowestCost = cost;
                    cheapestUpgrade = upgrades[i];
                }
            }
            if (cheapestUpgrade) {
                setTimeout(function() {
                    Upgrades.startConstruction(cheapestUpgrade);
                });
            }
        }
    },

    startConstruction(upgrade) {
        if (GameModel.persistentData.currentConstruction)
            return false;

        var fastMode = GameModel.persistentData.blood >= (upgrade.costs.blood || 0) &&
            GameModel.persistentData.brains >= (upgrade.costs.brains || 0) &&
            GameModel.persistentData.bones >= (upgrade.costs.bones || 0) &&
            GameModel.persistentData.parts >= (upgrade.costs.parts || 0) &&
            GameModel.energy >= (upgrade.costs.energy || 0);

        var costPerTick = {};
        if (upgrade.costs.energy)
            costPerTick.energy = upgrade.costs.energy / (fastMode ? 5 : upgrade.time);
        if (upgrade.costs.blood)
            costPerTick.blood = upgrade.costs.blood / (fastMode ? 5 : upgrade.time);
        if (upgrade.costs.brains)
            costPerTick.brains = upgrade.costs.brains / (fastMode ? 5 : upgrade.time);
        if (upgrade.costs.bones)
            costPerTick.bones = upgrade.costs.bones / (fastMode ? 5 : upgrade.time);
        if (upgrade.costs.parts)
            costPerTick.parts = upgrade.costs.parts / (fastMode ? 5 : upgrade.time);

        GameModel.persistentData.currentConstruction = {
            state: this.constructionStates.building,
            name: upgrade.name,
            id: upgrade.id,
            timeRemaining: (fastMode ? 5 : upgrade.time),
            time: (fastMode ? 5 : upgrade.time),
            costPerTick: costPerTick
        }
    },

    playPauseConstruction() {
        if (!GameModel.persistentData.currentConstruction)
            return false;

        if (GameModel.persistentData.currentConstruction.state == this.constructionStates.paused) {
            GameModel.persistentData.currentConstruction.state = this.constructionStates.building
        } else {
            GameModel.persistentData.currentConstruction.state = this.constructionStates.paused
        }
    },

    cancelConstruction() {
        GameModel.persistentData.currentConstruction = false;
    },

    constructionAvailable(construction) {
        if (GameModel.persistentData.currentConstruction && GameModel.persistentData.currentConstruction.id == construction.id)
            return false;

        if (this.currentRankConstruction(construction) >= construction.cap)
            return false;

        if (construction.requires && GameModel.persistentData.constructions.filter(built => built.id == construction.requires).length == 0)
            return false;

        return true;
    },

    constructionComplete(construction) {
        return this.currentRankConstruction(construction) >= construction.cap;
    },

    getAvailableConstructions() {
        return this.constructionUpgrades.filter(construction => this.constructionAvailable(construction));
    },

    getCompletedConstructions() {
        return this.constructionUpgrades.filter(construction => this.constructionComplete(construction));
    },

    upgradeIdCheck() {
        var ids = [];
        Upgrades.upgrades.forEach(function(upgrade) {
            if (ids[upgrade.id]) {
                console.error("ID " + upgrade.id + " already used");
            }
            ids[upgrade.id] = true;
        });
        Upgrades.prestigeUpgrades.forEach(function(upgrade) {
            if (ids[upgrade.id]) {
                console.error("ID " + upgrade.id + " already used");
            }
            ids[upgrade.id] = true;
        });
        Upgrades.constructionUpgrades.forEach(function(upgrade) {
            if (ids[upgrade.id]) {
                console.error("ID " + upgrade.id + " already used");
            }
            ids[upgrade.id] = true;
        });
    },

    runeCalculations: [{
            rune: "death",
            effect: "attackSpeed",
            cost: "blood",
            logBase: 1.6,
            adjustment: -13,
            subtract: true,
            cap: 0.8
        },
        {
            rune: "death",
            effect: "critChance",
            cost: "brains",
            logBase: 1.3,
            adjustment: -20,
            cap: 0.8
        },
        {
            rune: "death",
            effect: "critDamage",
            cost: "bones",
            logBase: 1.03,
            adjustment: -200,
            cap: false
        },
        {
            rune: "life",
            effect: "damageReduction",
            cost: "blood",
            logBase: 1.5,
            adjustment: -15,
            subtract: true,
            cap: 0.8
        },
        {
            rune: "life",
            effect: "healthRegen",
            cost: "brains",
            logBase: 2.9,
            adjustment: -5.5,
            cap: 0.5
        },
        {
            rune: "life",
            effect: "damageReflection",
            cost: "bones",
            logBase: 1.24,
            adjustment: -30,
            cap: 1
        }
    ],

    updateRunicSyphon(runicSyphon) {
        if (runicSyphon.percentage > 0) {
            GameModel.persistentData.runes.life.blood += runicSyphon.blood / 2;
            GameModel.persistentData.runes.death.blood += runicSyphon.blood / 2;
            GameModel.persistentData.runes.life.brains += runicSyphon.brains / 2;
            GameModel.persistentData.runes.death.brains += runicSyphon.brains / 2;
            GameModel.persistentData.runes.life.bones += runicSyphon.bones / 2;
            GameModel.persistentData.runes.death.bones += runicSyphon.bones / 2;
            runicSyphon.blood = 0;
            runicSyphon.brains = 0;
            runicSyphon.bones = 0;
            this.updateRuneEffects();
        }
    },

    infuseRune(runeType, costType, amount) {
        var rune = runeType == "life" ? GameModel.persistentData.runes.life : GameModel.persistentData.runes.death;
        switch (costType) {
            case "blood":
                if (GameModel.persistentData.blood >= amount) {
                    rune.blood += amount;
                    GameModel.persistentData.blood -= amount;
                }
                break;
            case "brains":
                if (GameModel.persistentData.brains >= amount) {
                    rune.brains += amount;
                    GameModel.persistentData.brains -= amount;
                }
                break;
            case "bones":
                if (GameModel.persistentData.bones >= amount) {
                    rune.bones += amount;
                    GameModel.persistentData.bones -= amount;
                }
                break;
        }
        this.updateRuneEffects();
    },

    updateRuneEffects() {
        if (!GameModel.persistentData.runes)
            return;

        var runeEffects = {
            attackSpeed: 1,
            critChance: 0,
            critDamage: 0,
            damageReduction: 1,
            healthRegen: 0,
            damageReflection: 0
        };

        for (var i = 0; i < this.runeCalculations.length; i++) {
            var calculation = this.runeCalculations[i];
            var infusionAmount = GameModel.persistentData.runes[calculation.rune][calculation.cost];
            if (infusionAmount > 0) {
                var result = (Math.log(infusionAmount) / Math.log(calculation.logBase) + calculation.adjustment) / 100;
                if (result > 0) {
                    if (calculation.cap && result > calculation.cap) {
                        result = calculation.cap;
                    }
                    if (calculation.subtract) {
                        runeEffects[calculation.effect] -= result;
                    } else {
                        runeEffects[calculation.effect] += result;
                    }
                }
            }
        }
        GameModel.runeEffects = runeEffects;
    },

    constructionTypes: {
        graveyard: "graveyard",
        crypt: "crypt",
        fort: "fort",
        fortress: "fortress",
        citadel: "citadel",
        fence: "fence",
        fenceSize: "fenceSize",
        plagueWorkshop: "plagueWorkshop",
        plagueLaboratory: "plagueLaboratory",
        plagueSpikes: "plagueSpikes",
        spellTower: "spellTower",
        runesmith: "runesmith",
        aviary: "aviary",
        zombieCage: "zombieCage",
        partFactory: "partFactory",
        monsterFactory: "monsterFactory",
        pit: "pit",
        harpy: "harpy"
    },

    Upgrade: function(id, name, type, costType, basePrice, multiplier, effect, cap, description, purchaseMessage, requires) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.costType = costType;
        this.basePrice = basePrice;
        this.multiplier = multiplier;
        this.effect = effect;
        this.cap = cap;
        this.description = description;
        this.rank = 1;
        this.purchaseMessage = purchaseMessage;
        this.requires = requires;
    },

    Construction: function(id, name, type, costs, time, multiplier, effect, cap, requires, description, completeMessage) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.costs = costs;
        this.time = time;
        this.multiplier = multiplier;
        this.effect = effect;
        this.cap = cap;
        this.requires = requires;
        this.description = description;
        this.completeMessage = completeMessage;
    }
};

var million = 1000000;
var billion = 1000 * million;
var trillion = 1000 * billion;

Upgrades.constructionUpgrades = [
    new Upgrades.Construction(201, "被诅咒的墓地", Upgrades.constructionTypes.graveyard, {
        blood: 1800
    }, 30, 1, 1, 1, false, "在小镇中建造一个被诅咒的墓地,当你的能量满额时可以自动召唤僵尸!", "墓地菜单现在可用!"),
    new Upgrades.Construction(205, "地窖", Upgrades.constructionTypes.crypt, {
        blood: 21000,
        bones: 2220
    }, 60, 1, 1, 1, 201, "在你的墓地中建造一个地窖.这可以给你提供一个黑暗而安静的地方来思考.额外的空间也能让你多储存 50% 的血液和大脑!"),
    new Upgrades.Construction(206, "骨堡", Upgrades.constructionTypes.fort, {
        blood: 60000,
        bones: 6000,
        energy: 60
    }, 60, 1, 1, 1, 205, "把你的地穴变成地堡.额外的空间也能让你多储存 60% 的血液和大脑.", "商店里有新的升级可用!"),
    new Upgrades.Construction(207, "骨骼堡垒", Upgrades.constructionTypes.fortress, {
        blood: 100000,
        bones: 9000,
        energy: 90
    }, 60, 1, 1, 1, 206, "把你的地堡变成堡垒.额外的空间也能让你多储存 70% 的血液和大脑."),
    new Upgrades.Construction(211, "骨骼城堡", Upgrades.constructionTypes.citadel, {
        blood: 200000,
        bones: 12000,
        energy: 120
    }, 60, 1, 1, 1, 207, "把你的堡垒变成一座高耸入云的城堡.额外的空间也能让你多储存 80% 的血液和大脑.", "商店里有新的升级可用!"),
    new Upgrades.Construction(202, "围篱", Upgrades.constructionTypes.fence, {
        bones: 880,
        energy: 22
    }, 44, 1, 1, 1, 201, "在墓地周围筑一道防护栏,可以减少在里面的僵尸受到的伤害 50%."),
    new Upgrades.Construction(203, "大型篱笆", Upgrades.constructionTypes.fenceSize, {
        bones: 880,
        energy: 22
    }, 44, 1, 10, 4, 202, "扩大篱笆,使更多的地方受到保护."),
    new Upgrades.Construction(204, "瘟疫车间", Upgrades.constructionTypes.plagueWorkshop, {
        blood: 10200,
        brains: 600
    }, 60, 1, 1, 1, 205, "建立一个实验室来研究瘟疫的影响.这将解锁商店的新升级.", "瘟疫升级现在可用!"),
    new Upgrades.Construction(208, "瘟疫尖刺", Upgrades.constructionTypes.plagueSpikes, {
        brains: 3000,
        bones: 1000
    }, 30, 1, 1, 1, 204, "在墓地周围的区域布上刺钉,让侵入的人类感染瘟疫."),
    new Upgrades.Construction(209, "魔法塔", Upgrades.constructionTypes.spellTower, {
        brains: 3000,
        blood: 30000
    }, 30, 1, 1, 1, 206, "利用你堡垒中的一座塔来研究法术.也许你可以学习一些新的法术?", "商店里现在有法术可用!"),
    new Upgrades.Construction(210, "符文铁匠", Upgrades.constructionTypes.runesmith, {
        bones: 3000,
        blood: 120000,
        brains: 1000
    }, 30, 1, 1, 1, 207, "建造一个符文铁匠的工作室,用强大的符文来增强你的僵尸."),
    new Upgrades.Construction(212, "诅咒鸟舍", Upgrades.constructionTypes.aviary, {
        bones: 6000,
        blood: 220000,
        brains: 2000
    }, 60, 1, 1, 1, 211, "在你的城堡顶部建造一个鸟舍,这样你就可以释放邪恶的鸟身女妖来轰炸镇民.", "现在可在墓地菜单中雇佣鸟身女妖"),
    new Upgrades.Construction(213, "僵尸笼", Upgrades.constructionTypes.zombieCage, {
        bones: 600,
        blood: 900
    }, 30, 1, 5, 1, 201, "在消灭一个城镇后建造一个笼子来容纳多余的僵尸."),
    new Upgrades.Construction(214, "第二个僵尸笼", Upgrades.constructionTypes.zombieCage, {
        bones: 1200,
        blood: 1800
    }, 30, 1, 10, 1, 205, "在消灭一个城镇后再建造一个额外的笼子来容纳多余的僵尸."),
    new Upgrades.Construction(215, "第三个僵尸笼", Upgrades.constructionTypes.zombieCage, {
        bones: 1800,
        blood: 2700
    }, 30, 1, 10, 1, 206, "在消灭一个城镇后再建造一个额外的笼子来容纳多余的僵尸."),
    new Upgrades.Construction(216, "第四个僵尸笼", Upgrades.constructionTypes.zombieCage, {
        bones: 2400,
        blood: 3600
    }, 30, 1, 10, 1, 207, "在消灭一个城镇后再建造一个额外的笼子来容纳多余的僵尸."),
    new Upgrades.Construction(217, "第五个僵尸笼", Upgrades.constructionTypes.zombieCage, {
        bones: 3000,
        blood: 4500
    }, 30, 1, 15, 1, 211, "在消灭一个城镇后再建造一个额外的笼子来容纳多余的僵尸."),
    new Upgrades.Construction(218, "瘟疫实验室", Upgrades.constructionTypes.plagueLaboratory, {
        brains: 25000,
        blood: million
    }, 50, 1, 1, 1, 211, "将瘟疫车间扩张为一个设备精良的实验室,以解锁额外的瘟疫升级."),
    new Upgrades.Construction(219, "部件工厂", Upgrades.constructionTypes.partFactory, {
        brains: 35000,
        blood: 15000000
    }, 50, 1, 1, 1, 218, "建造一个工厂来制造部件,可以用来为你的军队建造更强大的生物.", "工厂菜单现在可用!"),
    new Upgrades.Construction(220, "生物工厂", Upgrades.constructionTypes.monsterFactory, {
        brains: 45000,
        blood: 40 * million
    }, 50, 1, 1, 1, 219, "建造一个工厂,把生物的部件变成热衷毁灭的生命体", "现在在工厂菜单可以制造生物!"),
    new Upgrades.Construction(221, "无底洞", Upgrades.constructionTypes.pit, {
        bones: 75000,
        parts: 5 * million
    }, 50, 1, 1, 5, 219, "一个无底洞,墙壁由生物部件组成.大大增加你储存血液和大脑的能力."),
    new Upgrades.Construction(222, "女妖装备", Upgrades.constructionTypes.harpy, {
        bones: 75000,
        brains: 75000,
        blood: 80 * million
    }, 50, 1, 1, 1, 220, "建造一个装备店来升级你的鸟身女妖的能力.", "现在在商店中可以升级女妖!"),
];

Upgrades.prestigeUpgrades = [
    new Upgrades.Upgrade(108, "小型投资", Upgrades.types.startingPC, Upgrades.costs.prestigePoints, 10, 1.25, 1, 0, "当你开始一个新的关卡时,每个等阶会给你提供额外的 500 血液, 50 大脑和 200 骨骼."),
    new Upgrades.Upgrade(109, "时间隧道", Upgrades.types.unlockSpell, Upgrades.costs.prestigePoints, 50, 1, 1, 1, "解锁时间隧道法术以加速时间流."),
    new Upgrades.Upgrade(110, "死亡大师", Upgrades.types.energyCost, Upgrades.costs.prestigePoints, 1000, 1, 1, 5, "每个等阶降低召唤僵尸的能量消耗 1"),
    new Upgrades.Upgrade(101, "血液存储", Upgrades.types.bloodStoragePC, Upgrades.costs.prestigePoints, 10, 1.25, 0.2, 0, "每个等阶额外增加 20% 血液存储上限."),
    new Upgrades.Upgrade(102, "血液增量", Upgrades.types.bloodGainPC, Upgrades.costs.prestigePoints, 10, 1.25, 0.2, 0, "每个等阶额外增加 20% 血液收益."),
    new Upgrades.Upgrade(103, "大脑存储", Upgrades.types.brainsStoragePC, Upgrades.costs.prestigePoints, 10, 1.25, 0.2, 0, "每个等阶额外增加 20% 大脑存储上限."),
    new Upgrades.Upgrade(104, "大脑增量", Upgrades.types.brainsGainPC, Upgrades.costs.prestigePoints, 10, 1.25, 0.2, 0, "每个等阶额外增加 20% 大脑收益."),
    new Upgrades.Upgrade(105, "骨骼增量", Upgrades.types.bonesGainPC, Upgrades.costs.prestigePoints, 10, 1.25, 0.2, 0, "每个等阶额外增加 20% 骨骼收益."),
    new Upgrades.Upgrade(106, "僵尸伤害", Upgrades.types.zombieHealthPC, Upgrades.costs.prestigePoints, 10, 1.25, 0.2, 0, "每个等阶额外增加 20% 僵尸伤害."),
    new Upgrades.Upgrade(107, "僵尸生命值", Upgrades.types.zombieDmgPC, Upgrades.costs.prestigePoints, 10, 1.25, 0.2, 0, "每个等阶额外增加 20% 僵尸生命值."),
    new Upgrades.Upgrade(111, "部件增量", Upgrades.types.partsGainPC, Upgrades.costs.prestigePoints, 10, 1.25, 0.2, 0, "每个等阶额外增加 20% 生物部件收益."),
    new Upgrades.Upgrade(112, "自动建造", Upgrades.types.autoconstruction, Upgrades.costs.prestigePoints, 250, 1, 1, 1, "解锁自动开始建造最便宜的可用建筑的选项."),
    new Upgrades.Upgrade(114, "自动商店", Upgrades.types.autoshop, Upgrades.costs.prestigePoints, 250, 1, 1, 1, "解锁从商店自动购买物品."),
    new Upgrades.Upgrade(113, "墓地生命值", Upgrades.types.graveyardHealth, Upgrades.costs.prestigePoints, 10, 1.25, 0.1, 0, "在首领关卡中每个等阶提升墓地生命值 10%."),
    //new Upgrades.Upgrade(200, "作弊", -1000000, Upgrades.costs.prestigePoints, -1000000, 1, 0, 0, "作弊"),
];

Upgrades.upgrades = [
    // blood upgrades
    new Upgrades.Upgrade(1, "嗜血", Upgrades.types.damage, Upgrades.costs.blood, 50, 1.2, 1, 40, "你的僵尸渴望鲜血,每次升级伤害 +1."),
    new Upgrades.Upgrade(9, "尖锐牙齿", Upgrades.types.damage, Upgrades.costs.blood, 3000, 1.23, 3, 50, "你的僵尸学会啃噬,每次升级伤害 +3 .", false, 206),
    new Upgrades.Upgrade(11, "锋刃钩爪", Upgrades.types.damage, Upgrades.costs.blood, 28000, 1.25, 5, 0, "你的僵尸攻击更加强力,每次升级伤害 +5 .", false, 211),
    new Upgrades.Upgrade(16, "杀手本能", Upgrades.types.damage, Upgrades.costs.blood, 1000000, 1.27, 8, 0, "你的僵尸攻击更加强力,每次升级伤害 +8.", false, 220),
    new Upgrades.Upgrade(2, "皮如老革", Upgrades.types.health, Upgrades.costs.blood, 100, 1.2, 10, 40, "你的僵尸皮肤变得更硬,每次升级生命值 +10."),
    new Upgrades.Upgrade(10, "头脑迟钝", Upgrades.types.health, Upgrades.costs.blood, 5000, 1.23, 25, 50, "你的僵尸得到加强,每次升级生命值 +25.", false, 206),
    new Upgrades.Upgrade(12, "身经百战", Upgrades.types.health, Upgrades.costs.blood, 32000, 1.25, 40, 0, "你的僵尸得到加强,每次升级生命值 +40.", false, 211),
    new Upgrades.Upgrade(17, "铁石心肠", Upgrades.types.health, Upgrades.costs.blood, 1000000, 1.27, 100, 0, "你的僵尸得到加强,每次升级生命值 +100.", false, 220),
    new Upgrades.Upgrade(3, "冷冻储藏", Upgrades.types.brainsCap, Upgrades.costs.blood, 150, 1.2, 50, 20, "事实证明,你可以用多余的血液来储存大脑并保持它们的新鲜度.每个等阶增加你的大脑储量上限 50."),
    new Upgrades.Upgrade(4, "回收利用", Upgrades.types.brainRecoverChance, Upgrades.costs.blood, 1000, 1.2, 0.1, 10, "我们为什么要在这个项目上浪费这么多优秀的大脑呢?每个等阶提升你从死亡僵尸身上回收大脑的几率 10%"),
    new Upgrades.Upgrade(5, "灵魂归属!", Upgrades.types.riseFromTheDeadChance, Upgrades.costs.blood, 1500, 1.4, 0.1, 10, "使用你最强大的血魔法,你命令死者作为你的仆人复活!每个等阶有 10% 的几率使死者转化为僵尸."),
    new Upgrades.Upgrade(6, "感染咬伤", Upgrades.types.infectedBite, Upgrades.costs.blood, 3500, 1.4, 0.1, 10, "你的僵尸现在感染瘟疫,并可能会感染他们的受害者.在僵尸攻击一个目标时,每个等阶增加 10% 的几率造成感染伤害.", false, 204),
    new Upgrades.Upgrade(7, "引爆", Upgrades.types.unlockSpell, Upgrades.costs.blood, 25000, 1, 3, 1, "学习引爆法术,可以使你所有的僵尸爆炸形成一朵瘟疫云.不确定这会不会很实用.", "学会新的法术,引爆术!", 209),
    new Upgrades.Upgrade(8, "巨型僵尸?", Upgrades.types.unlockSpell, Upgrades.costs.blood, 50000, 1, 5, 1, "学习巨型僵尸法术,它会把你的一些僵尸变成巨大的怪物,增加生命值和伤害.", "学会新的法术,巨型僵尸!", 209),
    new Upgrades.Upgrade(13, "炽烈迅捷", Upgrades.types.burningSpeedPC, Upgrades.costs.blood, 30000, 1.25, 0.05, 10, "人类正在用火把点燃你的僵尸.也许我们能扭转局势?每个等阶提升被点燃的僵尸的移动和攻击速度 5%", false, 207),
    new Upgrades.Upgrade(14, "口吐芬芳", Upgrades.types.spitDistance, Upgrades.costs.blood, 500000, 1.6, 5, 10, "第一个等阶使你的僵尸有能力向超过正常攻击范围的敌人吐瘟疫.吐息攻击造成 50% 的僵尸伤害,并用瘟疫感染受害者.后续的等阶将增加吐痰攻击的范围.", false, 218),
    new Upgrades.Upgrade(15, "符文虹吸", Upgrades.types.runicSyphon, Upgrades.costs.blood, 34000, 1.9, 0.01, 10, "免费注入你的符文!每个等阶可以让你的符文铁匠注入你的资源收益的 1%,但并不产生实际消耗", false, 210),
    new Upgrades.Upgrade(18, "更多巨型僵尸", Upgrades.types.gigazombies, Upgrades.costs.blood, 100000000, 1.27, 1, 1, "我们需要更多巨型僵尸!这将解锁所有僵尸成为巨型僵尸的能力.他们获得生命值和伤害提升,但是能量消耗也增加了.可以在墓地中切换开关.", false, 220),
    new Upgrades.Upgrade(19, "高速女妖", Upgrades.types.harpySpeed, Upgrades.costs.blood, 100 * million, 1.07, 2, 20, "这些鸟身女妖太慢了!我们必须让她们更快.每个等阶提升鸟身女妖的速度 2", false, 222),

    // brain upgrades
    new Upgrades.Upgrade(20, "能量冲击", Upgrades.types.energyRate, Upgrades.costs.brains, 20, 1.8, 0.5, 20, "在你的坩埚里融化大脑来制作冰沙,这对你的健康有益.每个等阶能增加你每秒能量增率 0.5."),
    new Upgrades.Upgrade(21, "召唤大师", Upgrades.types.energyCap, Upgrades.costs.brains, 10, 1.5, 5, 20, "你收获的所有大脑在你的实验中都证明是富有成效的.每个等阶能提升你的能量上限 5."),
    new Upgrades.Upgrade(22, "原始反射", Upgrades.types.speed, Upgrades.costs.brains, 5, 1.6, 1, 20, "僵尸保留了更多人类时的敏捷性,每个等阶增加 1 移动速度."),
    new Upgrades.Upgrade(23, "血腥收获", Upgrades.types.bloodStoragePC, Upgrades.costs.brains, 50, 1.12, 0.1, 0, "所有这些大脑使你能够设计出一种更好的血液储存方法.每个等阶增加你的血液储量上限 10%."),
    new Upgrades.Upgrade(24, "邪恶建筑", Upgrades.types.construction, Upgrades.costs.brains, 50, 1, 1, 1, "学习邪恶建筑的艺术,来建造建筑,这可以巩固你在城镇的立足点.", "建筑物菜单现在可用!"),
    new Upgrades.Upgrade(25, "感染尸体", Upgrades.types.infectedBlast, Upgrades.costs.brains, 500, 1.4, 0.1, 10, "用大量的瘟疫气体充满你的僵尸,他们随时准备好爆炸!每个等阶增加 10% 的几率僵尸死后爆炸成瘟疫云.", false, 204),
    new Upgrades.Upgrade(26, "能量激流", Upgrades.types.unlockSpell, Upgrades.costs.brains, 2000, 1, 2, 1, "学习能量激流法术,可以在短时间内大幅度提高你的能量增率.", "学会新的法术,能量激流!", 209),
    new Upgrades.Upgrade(27, "好汉不死", Upgrades.types.blastHealing, Upgrades.costs.brains, 10000, 1.3, 0.1, 20, "来自僵尸和女妖的瘟疫爆炸也会治疗附近的僵尸 10% 爆炸伤害(每个等阶提升 10%).", false, 218),
    new Upgrades.Upgrade(28, "一个永远不够", Upgrades.types.monsterLimit, Upgrades.costs.brains, 20000, 1.2, 1, 15, "我们肯定需要不止一个傀儡来完成任务.每个等阶提升你的生物上限数量 1", false, 220),
    new Upgrades.Upgrade(29, "坦克破坏", Upgrades.types.tankBuster, Upgrades.costs.brains, 400000, 1.2, 1, 1, "教你的女妖一些新把戏.一旦购买了这个升级，你的女妖将在首领关卡向坦克投掷火焰炸弹.", false, 222),

    // bone upgrades
    new Upgrades.Upgrade(40, "骨骼宝座", Upgrades.types.energyCap, Upgrades.costs.bones, 50, 1.55, 10, 15, "坐在你的骨骼宝座上,你终于可以清晰地思考了.每个等阶提升能量上限 10."),
    new Upgrades.Upgrade(41, "骨骼皇冠", Upgrades.types.energyRate, Upgrades.costs.bones, 200, 1.5, 0.2, 25, "不仅仅是因为好看,这些长钉还能引导你的能量.每个等阶提升每秒能量增率 0.2."),
    new Upgrades.Upgrade(42, "骨骼手推车", Upgrades.types.boneCollectorCapacity, Upgrades.costs.bones, 300, 1.2, 5, 20, "你的骨骼收集者正努力收集骨骼.也许是时候给他们升级了?每个等阶提升它们的携带量 5."),
    new Upgrades.Upgrade(43, "骨骼加固", Upgrades.types.bloodCap, Upgrades.costs.bones, 500, 1.07, 2000, 0, "终于!既然我们有了坚实的建筑材料,我们就可以开始工作,为我们的其他资源建造更好的仓库.每个等阶提升血液库存容量 2000."),
    new Upgrades.Upgrade(44, "笼中大脑", Upgrades.types.brainsCap, Upgrades.costs.bones, 650, 1.07, 500, 0, "没有什么比被奴役的心灵更让我爱的了.现在我们可以把这些大脑放在它们应该在的地方.在笼子里!每个等阶提升大脑库存容量 500."),
    new Upgrades.Upgrade(45, "大地冻结", Upgrades.types.unlockSpell, Upgrades.costs.bones, 5000, 1, 4, 1, "学习大地冻结法术,它能在短时间内冻结所有人类.", "学会新的法术,大地冻结!", 209),
    new Upgrades.Upgrade(46, "瘟疫护甲", Upgrades.types.plagueArmor, Upgrades.costs.bones, 15000, 1.6, 0.02, 10, "进攻是最好的防御?在拥有瘟疫护甲的情况下是正确的,每个等阶减少被感染的人所造成的伤害 2%.", false, 218),
    new Upgrades.Upgrade(47, "防弹", Upgrades.types.bulletproof, Upgrades.costs.bones, 60000, 1.6, 0.05, 5, "用更坚硬的石头制造你的大地傀儡.每个等阶给予它们 5% 的几率将子弹反射回其源头.", false, 220),
    new Upgrades.Upgrade(48, "投弹完毕", Upgrades.types.harpyBombs, Upgrades.costs.bones, 500000, 1.6, 1, 3, "升级你的鸟身女妖,这样它们可以一次携带多个炸弹.", false, 222),

    // parts upgrades
    new Upgrades.Upgrade(60, "额外肢体", Upgrades.types.zombieDmgPC, Upgrades.costs.parts, 900, 1.3, 0.02, 0, "你的僵尸得到加强,每次升级伤害 +2%.", false, 220),
    new Upgrades.Upgrade(61, "宽大骨架", Upgrades.types.zombieHealthPC, Upgrades.costs.parts, 1000, 1.31, 0.02, 0, "你的僵尸得到加强,每次升级生命值 +2%.", false, 220),
];
