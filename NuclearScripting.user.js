// ==UserScript==
// @name         NuclearScripting
// @namespace    http://tampermonkey.net/
// @version      2025-03-03
// @description  Complete a MAD run as fast as possible
// @author       NuclearWinterMan
// @match        http://localhost:4400/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// ==/UserScript==

// consider selenium

// define global variable
var game = null;

// Navigation Functions
function getTab() {
    /*
    Tab is a number between 0 and 7 that corresponds to
    the numbered tab to swap to.
    Will use this coding everywhere.
    0 - evolution
    1 - city
    2 - civics
    3 - reearch
    4 - resources
    5 - ARPA
    6 - statistics
    7 - settings
    8 - Hell observations
    */
    let activeHeaders = document.getElementsByClassName("is-active");
    // activeHeadeers is regularly ordered, such that it's maintab, subtab, subsubtab, msgQueue.
    // To get maintab, take the first element
    let tabHeader = activeHeaders[0];
    // To get the label, can do one of two things,
    // 1 get child and read its id
    let tabId = tabHeader.firstChild.id;
    let idNumMap = {"5-label":1, "7-label":2, "9-label":3, "11-label":4, "13-label":5, "15-label":6, "17-label":7};
    return idNumMap[tabId];
}

function setTab(tab) {
    /*
    Tab is a number between 0 and 7 that corresponds to
    the numbered tab to swap to.
    Will use this coding everywhere.
    0 - evolution
    1 - city
    2 - civics
    3 - reearch
    4 - resources
    5 - ARPA
    6 - statistics
    7 - settings
    */

    let mappings = window.myMaps;

    // If there is no tab map, get the mappings
    if (!("tabMap" in mappings)) {
        getMappings();
    }
    if (tab == getTab()) {
        return;
    }

    let keyPress = mappings.tabMap[tab];
    document.dispatchEvent(new KeyboardEvent("keydown", {key:keyPress}));
    document.dispatchEvent(new KeyboardEvent("keyup", {key:keyPress}));
}

// Done
function getMappings() {
    let mappings = window.myMaps;
    if (!("tabMap" in mappings)) {
        mappings.tabMap = {};
        //document.getElementById("17-label").click();


        mappings.tabMap[1] = document.getElementById("showCivKey").value;
        mappings.tabMap[2] = document.getElementById("showCivicKey").value;
        mappings.tabMap[3] = document.getElementById("showResearchKey").value;
        mappings.tabMap[4] = document.getElementById("showResourcesKey").value;
        mappings.tabMap[5] = document.getElementById("showGeneticsKey").value;
        mappings.tabMap[6] = document.getElementById("showAchieveKey").value;
        mappings.tabMap[7] = document.getElementById("settingshKey").value;
    }
    if (!("modKey" in mappings)) {
        mappings.modKey = {};
        //document.getElementById("17-label").click();
        mappings.modKey[10] = document.getElementById("x10Key").value;
        mappings.modKey[25] = document.getElementById("x25Key").value;
        mappings.modKey[100] = document.getElementById("x100Key").value;
    }
}

function getSubTab() {
    /*Function that returns the current subtab.
    Subtabs are indexed from left to right.
    Determine if the menu has a subtab,
    Do this by checking if you aren't in settings.
    If there is subtabs, determine which one, indexed from left to right, starting at 0
    Return -1 if there is no subtabs
    */

    // Check if there is sub tabs
    let actives = document.getElementsByClassName("is-active");
    if (actives.length <= 2) {
        return -1;
    }
    let subTabLabel = actives[1];
    let subTabList = subTabLabel.parentElement.childNodes;
    let visibleSubTabs = Array.from(subTabList).filter(item => item.style.display != "none");
    let tabNum = 0;
    for(let i = 0; i<visibleSubTabs.length; i++) {
        if(visibleSubTabs[i].classList.contains("is-active")) {
            tabNum = i;
        }
    }
    return tabNum;
}

function setSubTab(subTab) {
    /*
    Function that sets the current subtab if subtabs exist
    */
    let actives = document.getElementsByClassName("is-active");
    if (actives.length <= 2) {
        return -1;
    }
    let subTabLabel = actives[1];
    let subTabList = subTabLabel.parentElement.childNodes;
    let visibleSubTabs = Array.from(subTabList).filter(item => item.style.display != "none");
    if(subTab < 0 || subTab >= visibleSubTabs.length) {
        return -1;
    }
    visibleSubTabs[subTab].firstChild.click();
    return subTab;
}

function getSubSubTab() {
    /*Function that returns the current subtab.
    Subtabs are indexed from left to right.
    Determine if the menu has a subtab,
    Do this by checking if you aren't in settings.
    If there is subtabs, determine which one, indexed from left to right, starting at 0
    Return -1 if there is no subtabs
    */

    // Check if there is sub tabs
    let actives = document.getElementsByClassName("is-active");
    if (actives.length <= 3) {
        return -1;
    }
    let subTabLabel = actives[2];
    let subTabList = subTabLabel.parentElement.childNodes;
    let visibleSubTabs = Array.from(subTabList).filter(item => item.style.display != "none");
    let tabNum = 0;
    for(let i = 0; i<visibleSubTabs.length; i++) {
        if(visibleSubTabs[i].classList.contains("is-active")) {
            tabNum = i;
        }
    }
    return tabNum;
}

function setSubSubTab(subSubTab) {
    /*
    Function that sets the current subtab if subtabs exist
    */
    let actives = document.getElementsByClassName("is-active");
    if (actives.length <= 2) {
        return -1;
    }
    let subTabLabel = actives[2];
    let subTabList = subTabLabel.parentElement.childNodes;
    let visibleSubTabs = Array.from(subTabList).filter(item => item.style.display != "none");
    if(subSubTab < 0 || subSubTab >= visibleSubTabs.length) {
        return -1;
    }
    visibleSubTabs[subSubTab].firstChild.click();
    return subSubTab;
}

// Tech Functions
function researchTech(tech) {
  let techButton = document.getElementById(tech).firstChild;
  let techName = tech.split("-")[1];
  let techObj = window.evolve.actions.tech[techName];
  if(window.evolve.checkAffordable(techObj)) {
   	techButton.click();
    return 0;
  } else {
    return -1;
  }
}

function getAvailableTechs() {
  let techList = Array.from(document.getElementById("tech").childNodes).filter((tech)=>tech.id);
  techList = techList.map((tech)=>tech.id);
    return techList;
}

function getOldTechs() {
    let oldTechDiv = document.getElementById("oldTech");
    let oldList = Array.from(oldTechDiv.childNodes);
    let purchasedTechs = oldList.filter((techDiv) => !techDiv.id.includes("dist-old"));
    purchasedTechs = purchasedTechs.map((techDiv) => techDiv.id);
    return purchasedTechs;
}

function getTechCost(tech) {
    let techIds = tech.split("-");
    let sector = techIds[0];
    let techName = techIds[1];
    let costCollection = window.evolve.actions[sector][techName].cost;
    let resNames = Object.keys(costCollection);
    let costObj = {};
    costObj.resList = [];
    for(let i = 0; i < resNames.length; i++) {
        let currRes = resNames[i];
        let currCost = costCollection[currRes]();
        if(currCost > 0) {
            costObj.resList.push(currRes);
            costObj[currRes] = currCost;
        }
    }
    return costObj;
}


// Building functions
function getAvailableBuildings() {
    // Hacky version.  Since MAD is only concerned about city, only consider city context
    // Will rewrite for full version
    // Needs to be on city view beforehand tab 1, subtab 0
    let bldgs = Array.from(document.getElementById("city").childNodes);
    let availBldgs = [];
    for (let i = 0; i < bldgs.length; i++) {
        let currBldg = bldgs[i];
        if(!currBldg.id.includes("dist")) {
            availBldgs.push(currBldg.id);
        }
    }
    return availBldgs;
}

function getBuildingCount(building) {
    // Hacky, since it uses debug obj
    let bldgIds = building.split("-");
    let sector = bldgIds[0];
    let bldg = bldgIds[1];
    let debugBldg = window.evolve.global[sector][bldg];
    if (debugBldg === undefined) {
        return 0;
    } else {
        return debugBldg.count;
    }
}

function getAllBuildingCounts() {
    let cityList = Array.from(document.getElementById("city").childNodes);
    let residenceSlice = 0;
    for(let i = 0; i < cityList.length; i++) {
        if (cityList[i].id == "city-dist-residential") {
            residenceSlice = i;
        }
    }
    cityList = cityList.slice(residenceSlice);
    let buildList = cityList.filter((building)=> !building.id.includes("-dist-"));
    let allCounts = {};
    for (let i = 0; i< buildList.length; i++) {
        allCounts[buildList[i].id] = getBuildingCount(buildList[i].id);
    }
    return allCounts;
}

function purchaseBuilding(building) {
    let bldgButton = document.getElementById(building).firstChild;
    let bldgName = building.split("-")[1];
    let bldgObj = window.evolve.actions.city[bldgName];
    if(window.evolve.checkAffordable(bldgObj)) {
        bldgButton.click();
        return 0;
    } else {
        return -1;
    }
}

function getBuildingCost(building) {
    let bldgIds = building.split("-");
    let sector = bldgIds[0];
    let bldgName = bldgIds[1];
    let costCollection = window.evolve.actions[sector][bldgName].cost;
    let resNames = Object.keys(costCollection);
    let costObj = {};
    costObj.resList = [];
    for(let i = 0; i < resNames.length; i++) {
        let currRes = resNames[i];
        let currCost = costCollection[currRes]();
        if(currCost > 0) {
            costObj.resList.push(currRes);
            costObj[currRes] = currCost;
        }
    }
    return costObj;
}

function powerBuilding(building, amt = 1) {
    let childrenOfDiv = Array.from(document.getElementById(building).childNodes);
    let onButton = childrenOfDiv.filter((child) => child.className == "on")[0];
    for(let i = 0; i < amt; i++) {
        onButton.click();
    }
}

function depowerBuilding(building, amt = 1) {
    let childrenOfDiv = Array.from(document.getElementById(building).childNodes);
    let onButton = childrenOfDiv.filter((child) => child.className == "off")[0];
    for(let i = 0; i < amt; i++) {
        onButton.click();
    }
}

// Civics
function assignWorker(job, n = 1) {
    //Function to assign a certain number of workers to a job
    let jobDiv = document.getElementById(job);
    let button = jobDiv.children[1].children[1];
    for( let i = 0; i < n; i++) {
        button.click();
    }
}

function deassignWorker(job, n = 1) {
    let jobDiv = document.getElementById(job);
    let button = jobDiv.children[1].children[0];
    for( let i = 0; i < n; i++) {
        button.click();
    }
}

function isBasicJob(job) {
    let basicJobList = ["civ-hunter","civ-forager","civ-farmer","civ-lumberjack","civ-quarry_worker", "civ-crystal_miner", "civ-scavenger", "civ-teamster", "civ-meditator"];
    return basicJobList.includes(job);
}

function getWorkerCount(job) {
    let jobDiv = document.getElementById(job);
    let countString = jobDiv.childNodes[0].childNodes[1].textContent;
    if (isBasicJob(job)) {
        countString = countString.split("/")[0].trim();
    }
    let count = Number(countString);
    return count;
}

function getWorkerLimit(job) {
    let jobDiv = document.getElementById(job);
    let countString = jobDiv.childNodes[0].childNodes[1].textContent;
    if (isBasicJob(job)) {
        countString = countString.split("/")[0].trim();
    }
    let count = Number(countString);
    return count;
}

function getAllJobs() {
    let jobList = Object.keys(evolve.global.civic).filter((entry)=>Object.keys(window.evolve.global.civic[entry]).includes("job"));
    let availableJobs = jobList.filter((entry)=>window.evolve.global.civic[entry].display);
    availableJobs = availableJobs.filter((job) => job!="craftsman");
    return availableJobs.map((job)=>"civ-"+job);
}

function assignGovt(government) {
    // This function isn't even necessary in the current version because synth
    document.getElementById("govType").childNodes[1].childNodes[0].firstChild.click();
    setTimeout(assignGovt2, 100, government);
}

function assignGovt2(govTarget) {
    let govs = document.getElementById("govModal").childNodes;
    for(let i = 0; i < govs.length; i++) {
        if(govTarget == govs[i].dataset.gov) {
            // UPDATE THIS
            console.log(i)
        }
    }
}

function assignGovernor(governor) {
    
    let governorDivs = document.getElementsByClassName(governor);
    if (governorDivs.length == 0) {
        return -1;
    }
    let govDiv = governorDivs[0];
    govDiv.childNodes[2].firstChild.click();
}

function assignGovernorTasks() {
    // Hardcoded to set 2 tasks, crate construction and management
    // TODO remake for full game script
    // Everything else isn't really necessary in MAD (maybe maybe maybe an assemble citizens)
    // Crate/Container Management
    // Crate/Container Construction
    let taskList = document.getElementsByClassName("govTask");
    if (taskList.length == 0) {
        return -1;
    }
    let task1 = taskList[0];
    let taskAssigned = false;
    let optionList1 = task1.childNodes[1].childNodes[2].childNodes[0].childNodes;
    for(let i = 0; i < optionList1.length; i++) {
        let candidate = optionList1[i];
        if(candidate.innerText == "Crate/Container Management") {
            taskAssigned = true;
            candidate.click();
            break;
        }
    }
    //If Crate/Container Management hasn't been assigned, escape, as crates must not be available
    if (!taskAssigned) {
        return -1;
    }

    let task2 = taskList[1];
    taskAssigned = false;
    let optionList2 = task2.childNodes[1].childNodes[2].childNodes[0].childNodes;
    for (let i = 0; i < optionList2.length; i++) {
        let candidate = optionList2[i];
        if(candidate.innerText == "Crate/Container Construction") {
            taskAssigned = true;
            candidate.click();
            break;
        }
    }
    if (!taskAssigned) {
        return -1;
    }

    return 0;
}

// Market
function setBuy(resource, amt) {
    let marketDiv = document.getElementById("market-"+resource);
    let panel = marketDiv.lastChild;
    let currAmt = window.evolve.global.resource[resource].trade;
    let amtDiff = amt - currAmt;
    if (amtDiff == 0) {
        return 0;
    }
    if (amtDiff < 0) {
        let button = panel.childNodes[1].lastChild.lastChild;
        for (let i = 0; i > amtDiff;i--) {
            let currAmt = window.evolve.global.resource[resource].trade;
            button.click();
            if (currAmt != window.evolve.global.resource[resource].trade) {
                return -1;
            }
        }
        return 0;
    } else if (amtDiff > 0) {
        let button = panel.childNodes[3].lastChild.lastChild;
        for (let i = 0; i < amtDiff; i++) {
            let currAmt = window.evolve.global.resource[resource].trade;
            button.click();
            if (currAmt != window.evolve.global.resource[resource].trade) {
                return -1;
            }
        }
        return 0;
    }
}

function getTrade(resource) {
    return window.evolve.global.resource[resource].trade;
}


// Misc Resources
function getAvailableResources() {
    let resourceElem = document.getElementById("resources");
    let availableResourcesDOM = Array.from(resourceElem.childNodes).filter(entry=>entry.checkVisibility());
    let recNames = [];
    for(let i = 0; i < availableResourcesDOM.length; i++) {
        let currId = availableResourcesDOM[i].id;
        if(currId.substring(0,3)=="res") {
            recNames.push(currId.substring(3));
        }
    }
    return recNames;
}

function getResourceAmt(res) {
    return window.evolve.global.resource[res].amount;
}

function getResourceCap(res) {
    return window.evolve.global.resource[res].max;
}

function incSmelt(res, amt=1) {
    let panel = document.getElementsByClassName("steel")[0].parentNode;
    if (res == "Iron") {
        let button = panel.children[2];
        for(let i = 0; i< amt; i++) {
            button.click();
        }
    } else {
        let button = panel.children[5];
        for(let i = 0; i < amt; i++) {
            button.click();
        }
    }
}

function decSmelt(res, amt=1) {
    let panel = document.getElementsByClassName("steel")[0].parentNode;
    if (res == "Iron") {
        let button = panel.children[0];
        for(let i = 0; i< amt; i++) {
            button.click();
        }
    } else {
        let button = panel.children[3];
        for(let i = 0; i < amt; i++) {
            button.click();
        }
    }
}

function craftResource(resource, amt) {
    for(let i = 0; i<amt; i++) {
        document.getElementById("inc"+resource+"1").click();
    }
}

function getPower() {
    // Returns a pair of actual power and power from environmentalist
    let power = window.evolve.city.power;
    if (window.evolve.actions.city.oil_power.effect() == "+8MW") {
        return [power, getBuildingCount("city-oil_power") * 2];
    } else {
        return [power, 0];
    }
}

function multKey(amt, mappings) {
    // Implement some thing to get settings from settings
    // scroll to settings and save it as some global

    // Will use my personal config of z: x10, x: x25, c: x100
    let map = {"10": 'z', "25": 'x', "100": 'c'};
    // TODO implement some function to parse amt and split string if necesary
    let keyChar=map[amt];
    let modPress = new KeyboardEvent("keydown", {key:keyChar});
    document.dispatchEvent(modPress);
}

function releaseMultKey(amt, mappings) {
    // Implement some thing to get settings from settings
    // Will use my personal config of z: x10, x: x25, c: x100
    let map = {"10": 'z', "25": 'x', "100": 'c'};
    // TODO implement some function to parse amt and split string if necesary
    let keyChar=map[amt];
    let modPress = new KeyboardEvent("keyup", {key:keyChar});
    document.dispatchEvent(modPress);
}

function mouseover(item) {
    let moose = new MouseEvent('mouseover', {
        'view':window,
        'bubbles':true,
        'cancelable':true
    });
    document.getElementById(item).dispatchEvent(moose);
}


function baseLine() {
    let allBLDG = getAvailableBuildings();
    let allTech = getAvailableTechs();
    let allJobs = getAllJobs();
    let availRes = getAvailableResources();
    let smeltable = ["Iron", "Steel"];
    let craftable = window.myVars.craftedResources.filter((res) => availRes.includes(res));
    let adjusts = [];
    let counts = [];
    let maxRange = 5;
    for(let i = 1; i <= maxRange; i++) {
        adjusts.push(-i);
        adjusts.push(i);
        counts.push(i);
    }
    
    //console.log(craftable);
    
    // First, try to build.
    let amtBuilds = Math.rand(0,6);
    for (let i = 0; i <amtBuilds; i++) {
        let build = allBLDG[Math.rand(0,allBLDG.length)];
        let targetAmt = Math.rand(1, maxRange+1);
        for (let j = 0; j<targetAmt; j++) {
            purchaseBuilding(build);
        }
    }
    
    // Next, try to research techs
    let amtTechs = Math.rand(0,6);
    for (let i = 0; i < amtTechs; i++) {
        let techName = allTech[Math.rand(0, allTech.length)];
        researchTech(techName);
    }
    
    //check if citizens
    if(getResourceAmt("custom") > 0) {
        let amtAdjusts = Math.rand(0,6);
        for(let i = 0; i< amtAdjusts; i++) {
            let jobTarget = allJobs[Math.rand(0, allJobs.length)];
            let adjustSize = Math.rand(1,6);
            if(Math.random() > .5) {
                assignWorker(jobTarget, adjustSize);
            } else {
                deassignWorker(jobTarget, adjustSize);
            }
        }
    }
    
    // check if smelting
    if(getBuildingCount("city-smelter") > 0) {
        if(Math.random() > .5) {
            incSmelt("Iron", Math.rand(0,6));
        } else {
            incSmelt("Steel", Math.rand(0,6));
        }
    }
    
    //craft a random mat
    let craftRes = craftable[Math.rand(0,craftable.length)];
    craftResource(craftRes, Math.rand(0,25));
    
    
    let purchasedBuildings = getAllBuildingCounts();
    let researchedTechs = getOldTechs();
    //Throw bone here, if somehow manage to research governors
    
    if (researchedTechs.includes("tech-governor") && !window.myVars.assignedGov) {
        assignGovernor("entrepreneur");
    }
    
    if(researchedTechs.includes("tech-mad")) {
        console.log("MAD researched at day: " + window.evolve.global.stats.days);
        return;
    }
    
    let delay = 5000;
    if(document.getElementsByClassName("atime")[0].checkVisibility()) {
        delay /= 2;
    }
    setTimeout(baseLine, delay);
    
}

function mainRunner() {

}

function scheduler() {
}

(function() {
    'use strict';
    // Your code here...
    var myMaps = window.myMaps = {};
    let myFunctions = window.myFunctions = {};
    var myVars = window.myVars = {};
    getMappings();
    defineAPI(myFunctions);
    defineVars();
    console.log("Initialization complete");
})();


function defineVars() {
    game = window.evolve;
    window.myVars.assignedGov = false;
    defineTechs();
    defineBuildings();
    defineResources();
}

class Resource{
}

function defineResources() {
    //TODO Update this with new version if anything changes
    // Subject to change depending on Version and if new crafteds or advanced resources are added
    let myVars = window.myVars;
    let resources = document.getElementById("resources");
    let allResources = myVars.allResources = Array.from(resources.children).filter((x)=>x.id).map(entry=>entry.id.substring(3));
    myVars.prestigeResources = allResources.slice(allResources.findIndex((element)=>element=="Blood_Stone"))
    myVars.basicResources = allResources.slice(allResources.indexOf("Food"), allResources.indexOf("Helium_3")+1);
    myVars.craftedResources = allResources.slice(allResources.indexOf("Plywood"),allResources.indexOf("Quantium")+1);
    myVars.advResources = allResources.slice(allResources.indexOf("Water"), allResources.indexOf("Soul_Gem")+1);
    myVars.specialResources = allResources.slice(allResources.indexOf("Money"), allResources.indexOf("Containers")+1);
    myVars.currency = ["Money","Knowledge"];
    // Not gonna model the special stuff (codexes and such)
}

function defineBuildings() {
    let myVars = window.myVars;
    myVars.sciBuildings = ["city-university","city-library","city-wardenclyffe","city-biolab"];
}

function defineTechs() {
    let myVars = window.myVars;
    // TODO: Update this whenever a version changes
    myVars.techLists = [
        ["tech-club", "tech-bone_tools", "tech-wooden_tools", "tech-sundial", "tech-wheel"],
        ["tech-housing", "tech-soul_well", "tech-compost", "tech-agriculture", "tech-captive_housing", "tech-psychic_energy", "tech-storage", "tech-currency", "tech-torture", "tech-mana", "tech-ley_lines", "tech-conjuring", "tech-res_conjuring", "tech-mining", "tech-reclaimer", "tech-stone_axe", "tech-secret_society", "tech-minor_wish", "tech-irrigation", "tech-ceremonial_dagger", "tech-garrison", "tech-science", "tech-smokehouse", "tech-silo", "tech-banking", "tech-psychic_attack", "tech-hot_compost", "tech-spear", "tech-slave_pens", "tech-farm_house", "tech-wagon", "tech-bows", "tech-armor", "tech-metal_working", "tech-dowsing_rod", "tech-cement", "tech-bronze_spear", "tech-shovel", "tech-copper_axes", "tech-copper_sledgehammer", "tech-foundry", "tech-copper_pickaxe", "tech-copper_hoe", "tech-theatre", "tech-government", "tech-rituals", "tech-library", "tech-investing", "tech-theology", "tech-governor", "tech-last_rites", "tech-playwright", "tech-theocracy", "tech-spy", "tech-thesis", "tech-artisans", "tech-market", "tech-clerics", "tech-cultists", "tech-iron_mining", "tech-urban_planning", "tech-alt_fanaticism", "tech-alt_anthropology", "tech-reinforced_shed", "tech-containerization", "tech-iron_shovel", "tech-iron_axes", "tech-iron_sledgehammer", "tech-mulching", "tech-apprentices", "tech-iron_pickaxe", "tech-rebar", "tech-iron_spear", "tech-tax_rates", "tech-iron_saw", "tech-plate_armor", "tech-cottage", "tech-vault", "tech-iron_hoe", "tech-research_grant", "tech-smelting", "tech-coal_mining", "tech-aphrodisiac", "tech-bayer_process", "tech-trade", "tech-mercs", "tech-black_powder", "tech-dynamite", "tech-steel", "tech-assistant", "tech-bonds", "tech-hospital", "tech-indoctrination", "tech-mythology", "tech-carpentry", "tech-mill", "tech-flintlock_rifle", "tech-reinforced_crates", "tech-large_trades", "tech-steel_vault", "tech-steel_rebar", "tech-mind_break", "tech-alt_lodge", "tech-psychic_stun", "tech-psychic_finance", "tech-metal_detector", "tech-thrall_quarters", "tech-major_wish"],
        ["tech-steel_sledgehammer", "tech-espionage", "tech-mad_science", "tech-magic", "tech-home_safe", "tech-slave_market", "tech-boot_camp", "tech-conceal_ward", "tech-steel_containers", "tech-steel_shovel", "tech-steel_axes", "tech-steel_pickaxe", "tech-spy_training", "tech-missionary", "tech-archaeology", "tech-alchemy", "tech-steel_saw", "tech-steel_beams", "tech-master_craftsman", "tech-steel_hoe", "tech-blast_furnace", "tech-steam_engine", "tech-spy_gadgets", "tech-crafting_ritual", "tech-subtle_rituals", "tech-electricity", "tech-apartment", "tech-barns", "tech-adv_mulching", "tech-windmill", "tech-radio", "tech-diplomacy", "tech-mine_conveyor", "tech-republic", "tech-socialist", "tech-cranes", "tech-eebonds", "tech-brickworks", "tech-banquet", "tech-bessemer_process", "tech-gantry_crane", "tech-jackhammer", "tech-matter_replicator", "tech-zealotry", "tech-merchandising"],
        ["tech-corpocracy", "tech-technocracy", "tech-magocracy", "tech-oil_well", "tech-zoning_permits", "tech-osha", "tech-industrialization", "tech-vocational_training", "tech-pylon_camouflage", "tech-scientific_journal", "tech-oil_depot", "tech-signing_bonus", "tech-portland_cement", "tech-machine_gun", "tech-corruption", "tech-freight", "tech-titanium_shovel", "tech-titanium_axes", "tech-titanium_sledgehammer", "tech-warehouse", "tech-blackmarket", "tech-adjunct_professor", "tech-anfo", "tech-wharf", "tech-oil_power", "tech-titanium_hoe", "tech-swiss_banking", "tech-hunter_process", "tech-combustion_engine", "tech-oxygen_converter", "tech-alloy_containers", "tech-titanium_drills", "tech-code_breakers", "tech-rotary_kiln", "tech-electronics", "tech-tesla_coil", "tech-thermomechanics", "tech-fake_tech"],
        ["tech-cameras", "tech-windturbine", "tech-wind_plant", "tech-machinery", "tech-tv", "tech-titanium_crates", "tech-safety_deposit", "tech-bioscience", "tech-alloy_shovel", "tech-jackhammer_mk2", "tech-internet", "tech-assembly_line", "tech-uranium", "tech-screw_conveyor", "tech-uranium_storage", "tech-bunk_beds", "tech-alloy_drills", "tech-kroll_process", "tech-polymer", "tech-electric_arc_furnace", "tech-kevlar", "tech-fission", "tech-pipelines", "tech-gmfood", "tech-casino", "tech-urbanization", "tech-fluidized_bed_reactor", "tech-synthetic_fur", "tech-arpa", "tech-massive_trades", "tech-stock_market", "tech-genetics", "tech-monument", "tech-mad", "tech-uranium_ash", "tech-dazzle", "tech-crispr", "tech-rocketry", "tech-cnc_machine", "tech-fracking", "tech-robotics"]
    ];
    let techListFlat = [];
    techListFlat = myVars.techLists.reduce((accumulator, currentValue) => accumulator.concat(currentValue), techListFlat);
    myVars.techListFlat = techListFlat;
    myVars.criticalPath = [ "tech-club", "tech-bone_tools", "tech-copper_sledgehammer", "tech-iron_sledgehammer", "tech-steel_sledgehammer", "tech-sundial", "tech-science", "tech-library", "tech-thesis", "tech-research_grant", "tech-scientific_journal", "tech-adjunct_professor", "tech-tesla_coil", "tech-internet", "tech-bioscience", "tech-mad_science", "tech-archaeology", "tech-housing", "tech-cottage", "tech-apartment", "tech-steel_beams", "tech-alt_lodge", "tech-wind_plant", "tech-coal_mining", "tech-electricity", "tech-uranium", "tech-oil_well", "tech-oil_power", "tech-foundry", "tech-artisans", "tech-apprentices", "tech-carpentry", "tech-master_craftsman", "tech-brickworks", "tech-machinery", "tech-assembly_line", "tech-thermomechanics", "tech-theatre", "tech-playwright", "tech-magic", "tech-radio", "tech-tv", "tech-mining", "tech-bayer_process", "tech-smelting", "tech-steel", "tech-blast_furnace", "tech-bessemer_process", "tech-rotary_kiln", "tech-metal_working", "tech-iron_mining", "tech-mine_conveyor", "tech-copper_pickaxe", "tech-iron_pickaxe", "tech-dynamite", "tech-anfo", "tech-hunter_process", "tech-storage", "tech-reinforced_shed", "tech-barns", "tech-warehouse", "tech-cameras", "tech-containerization", "tech-reinforced_crates", "tech-cranes", "tech-titanium_crates", "tech-steel_containers", "tech-gantry_crane", "tech-alloy_containers", "tech-uranium_storage", "tech-oil_depot", "tech-urban_planning", "tech-assistant", "tech-government", "tech-republic", "tech-technocracy", "tech-governor", "tech-spy", "tech-espionage", "tech-spy_training", "tech-spy_gadgets", "tech-code_breakers", "tech-currency", "tech-market", "tech-tax_rates", "tech-corruption", "tech-banking", "tech-investing", "tech-vault", "tech-bonds", "tech-steel_vault", "tech-eebonds", "tech-home_safe", "tech-merchandising", "tech-large_trades", "tech-massive_trades", "tech-trade", "tech-diplomacy", "tech-freight", "tech-industrialization", "tech-electronics", "tech-fission", "tech-black_powder", "tech-arpa", "tech-rocketry", "tech-stone_axe", "tech-copper_axes", "tech-iron_saw", "tech-steel_saw", "tech-iron_axes", "tech-steel_axes", "tech-garrison", "tech-boot_camp", "tech-bows", "tech-flintlock_rifle", "tech-machine_gun", "tech-bunk_beds", "tech-mad", "tech-cement", "tech-rebar", "tech-steel_rebar", "tech-portland_cement", "tech-screw_conveyor", "tech-theology", "tech-alt_fanaticism", "tech-indoctrination", "tech-missionary", "tech-alt_anthropology", "tech-mythology"];
    let techObjs = [];

    for(let i = 0; i < myVars.techListFlat.length; i++) {
        let techName = techListFlat[i].replace("tech-","");
        techObjs.push(game.actions.tech[techName]);
    }
    
}

function derefTechName(tech) {
    let techName = tech.replace("tech-","")
    return window.evolve.actions.tech[techName];
}

function derefBuildName(bldg) {
    // ONLY GETS THE BUILDINGS FROM CITY TAB
    let buildName = bldg.replace("city-","");
    return window.evolve.actions.city[buildName];
}

// Note: when using

function defineAPI(collectObj) {
    // Navigation
    collectObj.getTab = getTab;
    collectObj.setTab = setTab;
    collectObj.getSubTab = getSubTab;
    collectObj.setSubTab = setSubTab;
    collectObj.getSubSubTab = getSubSubTab;
    collectObj.setSubSubTab = setSubSubTab;
    // Researches
    collectObj.researchTech = researchTech;
    collectObj.getTechCost = getTechCost;
    collectObj.getAvailableTechs = getAvailableTechs;
    collectObj.derefTechName = derefTechName;
    collectObj.getOldTechs = getOldTechs;
    // Buildings
    collectObj.getAvailableBuildings = getAvailableBuildings;
    collectObj.purchaseBuilding = purchaseBuilding;
    collectObj.getBuildingCost = getBuildingCost;
    collectObj.getBuildingCount = getBuildingCount;
    collectObj.getAllBuildingCounts = getAllBuildingCounts;
    collectObj.powerBuilding = powerBuilding;
    collectObj.depowerBuilding = depowerBuilding;
    collectObj.derefBuildName = derefBuildName;
    // Civics
    collectObj.assignWorker = assignWorker;
    collectObj.deassignWorker = deassignWorker;
    collectObj.getWorkerCount = getWorkerCount;
    collectObj.getAllJobs = getAllJobs;
    collectObj.assignGovt = assignGovt;
    collectObj.assignGovernor = assignGovernor;
    collectObj.assignGovernorTasks = assignGovernorTasks;
    
    collectObj.getPower = getPower;
    collectObj.getResourceAmt = getResourceAmt;
    collectObj.getResourceCap = getResourceCap;
    collectObj.getAvailableResources = getAvailableResources;
    collectObj.setBuy = setBuy;
    // General
    collectObj.getMappings = getMappings;
    // Modifier keys
    collectObj.multKey = multKey;
    collectObj.releaseMultKey = releaseMultKey;
    collectObj.mouseover = mouseover;
    
    // Test code
    collectObj.baseLine = baseLine;
}