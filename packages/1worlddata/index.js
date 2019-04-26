mp.world.data = new Proxy({}, {
    set: function(target, property, value) {
        mp.players.call("__updateWorldData", [ property, false, Reflect.get(...arguments), value ]);
        return Reflect.set(...arguments);
    },

    deleteProperty: function(target, property) {
        mp.players.call("__updateWorldData", [ property, true ]);
        return Reflect.deleteProperty(...arguments);
    }
});

mp.events.add("playerReady", (player) => {
    player.call("__syncWorldData", [ mp.world.data ]);
});