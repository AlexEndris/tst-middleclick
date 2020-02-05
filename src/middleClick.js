const treeStyleTabId = 'treestyletab@piro.sakura.ne.jp';

async function registerToTST() {
    var self = await browser.management.getSelf();

    console.log("Registering with TST");
    var success = await browser.runtime.sendMessage(treeStyleTabId, {
        type: 'register-self',
        name: self.id
    });

    console.log("Registered: " + success);

    if (success)
        clearInterval(registrationTimer);
}


async function middleclickHandler(message) {
    async function closeActiveTabs() {
        let activeTabs = await browser.tabs.query({ active: true });

        for (let tab of activeTabs) {
            browser.tabs.remove(tab.id);
        }
    }

    async function restorePreviousTab() {
        let sessions = await browser.sessions.getRecentlyClosed({ maxResults: 1 });
        if (sessions.length && sessions[0].tab)
            browser.sessions.restore(sessions[0].tab.sessionId);
    }

    if (!message.isMiddleClick)
        return false;
    
    console.log("MiddleClick");

    if (closeActive) {
        await closeActiveTabs();
    } else {
        await restorePreviousTab();
    }

    return true;
}

function storageOnChanged(changes, areaName) {
    if (areaName !== 'sync')
        return;

    if (changes.closeActive) {
        closeActive = changes.closeActive.newValue || false;
        console.log("Changed to " + changes.closeActive.newValue);
    }
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

let registrationTimer = setInterval(registerToTST, 2000);
let closeActive = false;
browser.storage.sync.get('closeActive')
    .then((res => closeActive = res.closeActive || false));

browser.storage.onChanged.addListener(storageOnChanged);