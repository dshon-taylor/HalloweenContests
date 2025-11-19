import { introduceCreepyCrawly } from "./creepyCrawly.js";

function createOptionPicker(options) {
    let available = options.slice();
    return function () {
        if (available.length === 0) {
        available = options.slice();
        }
        const idx = Math.floor(Math.random() * available.length);
        const option = available[idx];
        available.splice(idx, 1);
        console.log(option, available);
        return option;
    };
}

const bugButtonLabelOptions = [
    "Happy Halloween!",
    "Beware the Bugs!",
    "Trick or Treat?",
    "Creep It Real",
    "Click If You Dare",
    "Stay Spooky!",
    "Witching You a Happy Halloween!",
    "#SpookySzn",
    "Infestation Mode: OFF",
    "You're Bugging out!",
    "Ghouls just wanna have fun!",
    "You're So Boo-tiful!",
    "Gourd Vibes Only",
    "Monster Mash Mode!",
    "The First Rule of Fright Club...",
    "Creep, Crawl, Repeat.",
    "Bat's All Folks!"
];

const bugButtonHoverOptions = [
    "Something's crawling…",
    "Do you feel that?",
    "It's getting buggy in here…",
    "They're waiting…",
    "Click… if you dare",
    "A little chaos never hurt…",
    "Unseen… but not for long",
    "The swarm is restless",
    "The infestation begins…",
    "A click awakens them",
    "You really want more?",
    "Are bugs, like, your thing? Or...",
    "Prepare for company…",
    "You must really like crawlers.",
    "Again? Bold move.",
    "Bug lover, huh?",
    "This is how infestations start",
    "They're not even cute...",
    "You're feeding their power!",
    "You sure about this?",
    "Living dangerously, I see",
    "They're not pets, you know.",
    "You really like this, huh?",
    "You're really leaning into this...",
    "You're not scared… impressive.",
    "You do know what happens, right?"
];

const killSwitchLabels = [
    "Kill Switch",
    "Terminate The Creepy Crawlies!",
    "Pest Control Protocol",
    "Exterminate",
    "Purge The Pests",
    "Bugged Out - Hit The Switch!",
    "Click To Cleanse!",
    "End The Infestation",
    "Squash The Swarm",
    "Evict The Invaders",
    "Burn it all down! (Metaphorically)",
    "Send Them Back!"
];

const pickLabelOption = createOptionPicker(bugButtonLabelOptions);
const pickHoverOption = createOptionPicker(bugButtonHoverOptions);
const pickKillSwitchLabel = createOptionPicker(killSwitchLabels);

export function addBugButton() {

    const backBar = document.getElementById('back-bar');
    if (!backBar) return;

    const bugButton = document.createElement('div');
        bugButton.classList.add('bugButton');
        const labelDiv = document.createElement('div');
        labelDiv.classList.add('button-label');
        labelDiv.textContent = "This button is haunted...";
        bugButton.appendChild(labelDiv);
    backBar.appendChild(bugButton);

    let clickCount = 0;
    let bugsActive = false;
    let insectInstances = [];
    let hoverOption = pickHoverOption();
    let labelOption = pickLabelOption();
    const bugButtonPadding = 30;
    let totalButtonWidth;
    
    bugButton.addEventListener('mouseenter', () => {
        if (clickCount === 0 && !bugsActive) {
            labelDiv.textContent = "Okay... But we warned you";
        } else if (clickCount > 0 && !bugsActive) {
            labelDiv.textContent = hoverOption;
        }

        // Set Clickable Area Width
        totalButtonWidth = labelDiv.offsetWidth + bugButton.offsetWidth + bugButtonPadding;
        console.log('Total Button Width on mouseenter:', totalButtonWidth);
        bugButton.style.setProperty('--before-width', `${totalButtonWidth}px`);
    });
    
    bugButton.addEventListener('mouseleave', () => {
        if (clickCount === 0 && !bugsActive) {
            labelDiv.textContent = "This button is haunted...";
        } else if (clickCount > 0 && !bugsActive) {
            labelDiv.textContent = labelOption;
        }

        // Set Clickable Area Width
        totalButtonWidth = labelDiv.offsetWidth + bugButton.offsetWidth + bugButtonPadding;
        console.log('Total Button Width on mouseleave:', totalButtonWidth);
        bugButton.style.setProperty('--before-width', `${totalButtonWidth}px`);
    });
    
    bugButton.addEventListener('click', () => {

        if (!bugsActive) { // Turn bugs ON.
            clickCount++;
            labelDiv.textContent = (clickCount === 1) ? "Kill Switch" : pickKillSwitchLabel();
            insectInstances = introduceCreepyCrawly();
            bugButton.classList.add('active');
            bugsActive = true;

            // Set Clickable Area Width
            totalButtonWidth = labelDiv.offsetWidth + bugButton.offsetWidth + bugButtonPadding;
            console.log('Total Button Width on click:', totalButtonWidth);
            bugButton.style.setProperty('--before-width', `${totalButtonWidth}px`);
        }
        
        else { // Turn bugs OFF.
            clickCount++;
            insectInstances.forEach(instance => {
                instance.killAll();
                document.querySelectorAll('.bug').forEach(bugElem => {
                    bugElem.classList.add('bug-fade-out');
                });
                setTimeout(() => {
                    instance.end();
                }, 4000);
            });
            
            bugsActive = false;
            bugButton.classList.remove('active');
            insectInstances = [];
            hoverOption = pickHoverOption();
            labelOption = pickLabelOption();
        }

    });
}