const treeStyleTabId = 'treestyletab@piro.sakura.ne.jp';

async function registerToTST() {
    var self = await browser.management.getSelf();

    console.log("Registering with TST");
    var success = await browser.runtime.sendMessage(treeStyleTabId, {
        type: 'register-self',
        name: self.id
    });

    console.log("Registered: " + success);
}

async function middleclickHandler(message) {
    if (!message.isMiddleClick)
        return false;
    
    console.log("MiddleClick");
        
    let sessions = await browser.sessions.getRecentlyClosed({ maxResults: 1 });
    if (sessions.length && sessions[0].tab)
        browser.sessions.restore(sessions[0].tab.sessionId);

    return true;
}

// Register on initialize
browser.runtime.onMessageExternal.addListener(async (message, sender) => {
    if (sender.id === treeStyleTabId) {
        switch(message.type){
            case 'ready':
                registerToTST();
                break;
            case 'tabbar-clicked':
                let eventHandled = await middleclickHandler(message);
                return Promise.resolve(eventHandled);
        }
    }
});

// Register on install
registerToTST();