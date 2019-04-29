const realDataKey = Symbol("realData");

mp.world[realDataKey] = {};

mp.world.data = new Proxy(mp.world[realDataKey], {
    set: function(target, property, value) {
        mp.players.call("__updateWorldData", [ property, false, Reflect.get(...arguments), value ]);
        return Reflect.set(...arguments);
    },

    deleteProperty: function(target, property) {
        mp.players.call("__updateWorldData", [ property, true ]);
        return Reflect.deleteProperty(...arguments);
    }
});

mp.world.setData = (updatedObject) => {
    const updatedObjectToClient = [];

    for (const property in updatedObject) {
        const oldValue = mp.world[realDataKey][property];
        const value = updatedObject[property];

        mp.world[realDataKey][property] = updatedObject[property];

        updatedObjectToClient.push([ property, false, oldValue, value ]);
    }

    mp.players.call("__updateWorldDatas", [ ...updatedObjectToClient ]);
};

mp.events.add("playerReady", (player) => {
    player.call("__syncWorldData", [ mp.world.data ]);
});