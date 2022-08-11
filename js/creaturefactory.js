CreatureFactory = {

    spawnedSavedCreatures: false,

    types: {
        earthGolem: 1,
        airGolem: 2,
        fireGolem: 3,
        waterGolem: 4
    },

    creatureScaling: 1.75,
    creatureCostScaling: 2,

    update(timeDiff) {
        var creatureCount = Creatures.creatureCount;
        for (var i = 0; i < this.creatures.length; i++) {
            if (this.creatures[i].building) {
                this.creatures[i].timeLeft -= timeDiff;
                if (this.creatures[i].timeLeft < 0) {
                    this.spawnCreature(this.creatures[i]);
                    this.creatures[i].building = false;
                }
            } else {
                if (typeof creatureCount[this.creatures[i].type] !== 'undefined' && creatureCount[this.creatures[i].type] < this.creatures[i].autobuild) {
                    this.startBuilding(this.creatures[i]);
                }
            }
            if (GameModel.persistentData.creatureLevels[this.creatures[i].id])
                this.creatures[i].level = GameModel.persistentData.creatureLevels[this.creatures[i].id];
        }
    },

    purchasePrice(creature) {
        return creature.baseCost * Math.pow(this.creatureCostScaling, creature.level - 1);
    },

    levelPrice(creature) {
        return creature.baseCost * Math.pow(this.creatureCostScaling, creature.level) * 5;
    },

    levelCreature(creature) {
        if (this.levelPrice(creature) < GameModel.persistentData.parts) {
            GameModel.persistentData.parts -= this.levelPrice(creature);
            creature.level++;
            GameModel.persistentData.creatureLevels[creature.id] = creature.level;
        }
    },

    canAffordCreature(creature) {
        return this.purchasePrice(creature) < GameModel.persistentData.parts;
    },

    creaturesBuildingCount() {
        var count = 0;
        for (var i = 0; i < CreatureFactory.creatures.length; i++) {
            if (CreatureFactory.creatures[i].building) {
                count++;
            }
        }
        return count;
    },

    startBuilding(creature) {
        if (creature.building) {
            return;
        }
        if (!this.canAffordCreature(creature)) {
            return;
        }
        if (this.creaturesBuildingCount() + GameModel.creatureCount >= GameModel.creatureLimit) {
            return;
        }
        creature.building = true;
        creature.timeLeft = creature.time;
        GameModel.persistentData.parts -= this.purchasePrice(creature);
    },

    creatureAutoBuildNumber(creature, number) {
        if (creature.autobuild + number >= 0) {
            creature.autobuild += number;
            GameModel.persistentData.creatureAutobuild[creature.id] = creature.autobuild;
        }
    },

    updateAutoBuild() {
        for (var i = 0; i < this.creatures.length; i++) {
            this.creatures[i].autobuild = GameModel.persistentData.creatureAutobuild[this.creatures[i].id] || 0;
        }
    },

    resetLevels() {
        for (var i = 0; i < this.creatures.length; i++) {
            this.creatures[i].level = 1;
        }
    },

    spawnCreature(creature) {
        var health = creature.baseHealth * Math.pow(this.creatureScaling, creature.level - 1);
        var damage = creature.baseDamage * Math.pow(this.creatureScaling, creature.level - 1);
        Creatures.spawnCreature(health, damage, creature.speed, creature.type, creature.level);
    },

    spawnSavedCreatures() {
        if (!this.spawnedSavedCreatures) {
            var creaturesSpawned = 0;
            for (var i = 0; i < GameModel.persistentData.savedCreatures.length; i++) {
                creaturesSpawned++
                if (creaturesSpawned <= GameModel.creatureLimit) {
                    var savedCreature = GameModel.persistentData.savedCreatures[i];
                    var creature = this.creatures.filter(c => c.type == savedCreature.t)[0];
                    creature.level = savedCreature.l;
                    this.spawnCreature(creature);
                }
            }
            this.spawnedSavedCreatures = true;
        }
    },

    creatureStats(creature) {
        return {
            thisLevel: {
                level: creature.level,
                health: creature.baseHealth * Math.pow(this.creatureScaling, creature.level - 1),
                damage: creature.baseDamage * Math.pow(this.creatureScaling, creature.level - 1),
                cost: creature.baseCost * Math.pow(this.creatureCostScaling, creature.level - 1)
            },
            nextLevel: {
                level: creature.level + 1,
                health: creature.baseHealth * Math.pow(this.creatureScaling, creature.level),
                damage: creature.baseDamage * Math.pow(this.creatureScaling, creature.level),
                cost: creature.baseCost * Math.pow(this.creatureCostScaling, creature.level)
            }
        }
    },

    Creature: function(id, type, name, baseHealth, baseDamage, speed, baseCost, description) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.baseHealth = baseHealth;
        this.baseDamage = baseDamage;
        this.speed = speed;
        this.baseCost = baseCost;
        this.description = description;
        this.time = 3;
        this.building = false;
        this.timeLeft = 10;
        this.autobuild = 0;
        this.level = 1;
    }
}

CreatureFactory.creatures = [
    new CreatureFactory.Creature(1, CreatureFactory.types.earthGolem, "大地傀儡", 3000, 75, 25, 800, "一个从岩石和泥土中诞生的傀儡,能够承受很多攻击并嘲讽吸引敌人来攻击它"),
    new CreatureFactory.Creature(2, CreatureFactory.types.airGolem, "空气傀儡", 1200, 110, 45, 900, "一个快速移动的傀儡,能够覆盖很远的距离并追捕目标"),
    new CreatureFactory.Creature(3, CreatureFactory.types.fireGolem, "火焰傀儡", 1200, 130, 32, 1000, "一个喷火的傀儡,点燃它所接触的一切"),
    new CreatureFactory.Creature(4, CreatureFactory.types.waterGolem, "流水傀儡", 1500, 90, 30, 1100, "可以使附近单位恢复生命值的平静傀儡")
];