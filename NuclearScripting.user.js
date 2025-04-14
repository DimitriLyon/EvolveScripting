// ==UserScript==
// @name         NuclearScripting
// @namespace    http://tampermonkey.net/
// @version      2025-03-03
// @description  try to take over the world!
// @author       NuclearWinterMan
// @match        http://localhost:4400/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// ==/UserScript==

// consider selenium

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
}

function getSubSubTab() {

}

function setSubSubTab(subSubTab) {

}

// Tech Functions
function researchTech(tech) {
    console.log(tech);
    console.log(window.myMaps);
}

function getAvailableTechs() {
    Array.from(document.getElementById("tech").childNodes);
}

function getTechCost(tech) {
    // Save current tab
    // Get check if tech is in available list
    // if not, return to previous tab,
    // otherwise, send a mouseover event
   let moose = new MouseEvent('mouseover', {
        'view':window,
        'bubbles':true,
        'cancelable':true
    });
    document.getElementById(tech).dispatchEvent(moose);

    let costList = document.getElementsByClassName("costList")[0];
    return costList;
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

function purchaseBuilding(building) {

}

function getBuildingCost(building) {
    mouseover(building);
    let costs = document.getElementsByClassName("costList")[0];
}

function powerBuilding(building, amt = 1) {
}

function depowerBuilding(building, amt = 1) {
}

// Civics
function assignWorker(job, n = 1) {
    //Function to assign a certain number of workers to a job
    let jobDiv = document.getElementById("civ-lumberjack");
    let button = jobDiv.children[1].children[1];
    for( let i = 0; i < n; i++) {
        button.click();
    }
}

function deassignWorker(job, n = 1) {
    let jobDiv = document.getElementById("civ-lumberjack");
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

function assignGovt(government) {

}

function assignGovernor(governor) {

}


// Misc Resources
function getAvailableResources() {
    let resourceElem = document.getElementById("resources");
    let availableResources = Array.from(resourceElem.childNodes).filter(entry=>entry.checkVisibility());
    return availableResources;
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
    defineTechs();
    defineBuildings();
}

function defineBuildings() {
    let myVars = window.myVars;
    myVars.sciBuildings = ["city-university","city-library","city-wardenclyffe","city-biolab"]
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
    myVars.criticalPath = [];
}

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
    // Buildings
    collectObj.getAvailableBuildings = getAvailableBuildings;
    collectObj.purchaseBuilding = purchaseBuilding;
    collectObj.getBuildingCost = getBuildingCost;
    collectObj.powerBuilding = powerBuilding;
    collectObj.depowerBuilding = depowerBuilding;
    // Civics
    collectObj.assignWorker = assignWorker;
    collectObj.deassignWorker = deassignWorker;
    collectObj.getWorkerCount = getWorkerCount;
    collectObj.assignGovt = assignGovt;
    collectObj.assignGovernor = assignGovernor;
    collectObj.getAvailableResources = getAvailableResources;
    // General
    collectObj.getMappings = getMappings;
    // Modifier keys
    collectObj.multKey = multKey;
    collectObj.releaseMultKey = releaseMultKey;
    collectObj.mouseover = mouseover;
}
