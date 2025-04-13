const Ziggy = {"url":"http:\/\/localhost","port":null,"defaults":{},"routes":{"ignition.":{"uri":"_ignition\/update-config","methods":["POST"]}}};

if (typeof window !== 'undefined' && typeof window.Ziggy !== 'undefined') {
    Object.assign(Ziggy.routes, window.Ziggy.routes);
}

export { Ziggy };
