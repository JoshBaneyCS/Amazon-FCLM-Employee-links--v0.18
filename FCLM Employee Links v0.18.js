// ==UserScript==
// @name         FCLM Employee Links v0.18
// @namespace    http://tampermonkey.net/
// @version      0.18.00
// @description  A script which substantially improves FCLM employee view page by adding the following features: Links to various other pages for the employee (Including: Adapt, FANS, Engage, Picking Console, Amazon Time, FcLearning, Umbrella, and Permissions), The Employee’s live location and activity status if they are picking, easy to use copy buttons for various pieces of employee information, and changes to the tab picture and title to make these elements match the Employee’s Login and Badge photo so tabs are easier to keep track of.
// @author       based on original code by habardal and trandrep, with modifications to improve the script made by khaniman and jnbaney
// @match        https://fclm-portal.amazon.com/employee/*
// @icon         https://fclm-portal.amazon.com/resources/images/icon.jpg
// @downloadURL  https://axzile.corp.amazon.com/-/carthamus/download_script/fclm-employee-links-(phl7-version).user.js
// @updateURL    https://axzile.corp.amazon.com/-/carthamus/download_script/fclm-employee-links-(phl7-version).user.js
// @grant        GM_addStyle
// @grant        GM_getElement
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==
// Changelog:
//Initial
//0.11 fixed for firefox
//0.12 updated. FCLM changed their table index.  11/18
//0.13 added Engage and LDAP links
// --Anything Past this point in the changelog is when the script was forked from the Original FCLM Links script by habardal and trandrep--
//0.13.01 forked version for PHL7 pick which includes links to picking console and fans direct message, and removed broken umbrella link
//0.13.02 update with lenels link (generic without user id)
//0.13.03 updated code to change the website title to be the associates login and badge photo
//0.13.04 updated documentation
//0.13.05 fixed compatibility issue with chrome and edge
//0.13.06 fixed an issue with something being one space off
//0.13.07 made forked version compatible with all FCs in the network by making picking console links unique
//0.14.00 added copy buttons for first name, logins, badge numbers, and employee IDs.
//0.15.00 added a line item for where a Picker's last pick is located, with a refresh button.
//0.16.00 added a line item for if the Picker is active or not in picking console.
//0.16.00 Added Umbrella link and renamed the transcript link to FCLearing
//0.18.0 Added extra buttons to copy first or last name or to copy both at the sametime - jnbaney
// ----
//Special thanks for habardal and trandrep for making the Original FCLM links script which this one was based upon.

function setFavicon(url) {
    const link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = url;

    if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
        // Chrome permission issue fix
        Object.defineProperty(link, 'crossOrigin', { value: 'anonymous', writable: false });
    }

    const existingFavLinks = document.querySelectorAll('link[rel="shortcut icon"]');
    existingFavLinks.forEach(link => link.remove());
    document.head.appendChild(link);
}

function exec() {
    const empInfoPane = document.getElementsByClassName("empDetailCard foldable unfolded")[0].children[0].children[1].children[1].children[1];
    const myDiv = document.createElement("div");
    const login = document.getElementsByClassName('employeeInfo')[0].children[0].childNodes[3].textContent.trim();
    const employeeID = document.getElementsByClassName('employeeInfo')[0].children[0].childNodes[7].textContent.trim();
    const adaptlink = "https://adapt-iad.amazon.com/#/employee-dashboard/" + employeeID;
    const engagelink = "https://na.engage.amazon.dev/team/employee/" + employeeID;
    const fanslink = "https://fans-iad.amazon.com/?to=" + login;
    const FCLearn = "https://fclearning.amazon.com/fcl/viewtranscript?employeeIds=" + employeeID;
    const Umbrellalink = "https://iad.umbrella.amazon.dev/portal/transcript/learner?learnerIds=%255B%2522" + login + "%2522%255D&currentTab=courses&currentProgram=training";
    const Ldap = "https://permissions.amazon.com/user.mhtml?lookup_user=" + login;
    const amazonTime = "https://weui.workevents.a2z.com/teams";
    document.querySelector('title').textContent = login + " FCLM";

    const warehouseElement = document.querySelector("body > table > tbody > tr.fold-row > td:nth-child(2) > div > dl:nth-child(1) > dd:nth-child(10)");
    const formattedWarehouseId = warehouseElement.textContent.trim();
    const warehouseId = formattedWarehouseId.split(' ')[0];
    const pickingconsole = "https://picking-console.na.picking.aft.a2z.com/fc/" + warehouseId + "/pick-workforce?tableFilters=%7B%22tokens%22%3A%5B%7B%22propertyKey%22%3A%22userId%22%2C%22propertyLabel%22%3A%22User+Id%22%2C%22value%22%3A%22" + login + "%22%2C%22label%22%3A%22" + login + "%22%2C%22negated%22%3Afalse%7D%5D%2C%22operation%22%3A%22or%22%7D";

    setFavicon('https://internal-cdn.amazon.com/badgephotos.amazon.com/?employeeid=' + employeeID);

    empInfoPane.appendChild(myDiv);

    myDiv.innerHTML = "<span class=\"line\"><span class=\"row-label\">Adapt</span><a href=\"" +
        adaptlink + "\">Adapt</a></span><span class=\"line\"><span class=\"row-label\">Fans</span><a href=\"" +
        fanslink + "\">Fans</a></span><span class=\"line\"><span class=\"row-label\">Engage</span><a href=\"" +
        engagelink + "\">Engage</a></span><span class=\"line\"><span class=\"row-label\">Console</span><a href=\"" +
        pickingconsole + "\">Picking Console</a></span><span class=\"line\"><span class=\"row-label\">Lenels</span><a href=\"" +
        amazonTime + "\">Amazon Time (Generic Link)</a></span><span class=\"line\"><span class=\"row-label\">Transcript</span><a href=\"" +
        FCLearn + "\">FC Learning</a></span><span class=\"line\"><span class=\"row-label\">Umbrella</span><a href=\"" +
        Umbrellalink + "\">Umbrella</a></span><span class=\"line\"><span class=\"row-label\">LDAP</span><a href=\"" +
        Ldap + "\">LDAP Permissions</a></span><span class=\"line\">";

    // Retrieve the user's picking location and append it to the FCLM page
    //if (incrementCounter < 5) { }
    retrieveUserLocation(login, warehouseId, document.querySelector("body > table > tbody > tr.fold-row > td:nth-child(2) > div > dl:nth-child(2)"));


    // Check if the current URL matches the FCLM portal
    if (window.location.href.includes('fclm-portal.amazon.com/employee/')) {
        // Increment the counter
        incrementCounter();
    }
}

function retrieveUserLocation(userId, warehouseId, container) {
    let counter = GM_getValue('fclmPortalVisits', 0);
    if (counter >= 4) {
        // Create the new last pick elements
        const newListItem = document.createElement("dt");
        newListItem.id = "newListItemId"
        newListItem.textContent = "Last Pick";
        container.appendChild(newListItem);

        const locationElement = document.createElement('dd');
        locationElement.textContent = '(Error: Too many requests.)';
        container.appendChild(locationElement);

        const newListItemActive = document.createElement("dt");
        newListItemActive.id = "newListItemActiveId";
        newListItemActive.textContent = "Pick Activity";
        container.appendChild(newListItemActive);

        const locationElementActive = document.createElement('dd');
        locationElementActive.id ="locationElementActiveId";
        locationElementActive.textContent = '(Please refresh in a minute.)';
        container.appendChild(locationElementActive);
        // Logic to rate limit api requests to prevent overloading the picking console api.
    } else {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://picking-console.na.picking.aft.a2z.com/api/fcs/${warehouseId}/workforce`,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                const user = data.pickerStatusList.find(item => item.userId === userId);
                let locationElement;

                // Create the new last pick elements
                const newListItem = document.createElement("dt");
                newListItem.id ="newListItemId";
                //const newListItemActive = document.createElement("dt");
                newListItem.textContent = "Last Pick";
                //newListItemActive.textContent = "Pick Activity";
                //container.appendChild(newListItemActive);
                container.appendChild(newListItem);

                locationElement = document.createElement('dd');
                locationElement.id = "locationElementId";
                //locationElementActive = document.createElement('dd');
                if (user) {
                    locationElement.textContent = `${user.location}`;
                    //locationElementActive.textContent = `${user.active}`;
                } else {
                    locationElement.textContent = '--';
                    //locationElementActive.textContent = '--';
                }

                // Create the refresh button
                const refreshButton = document.createElement("button");
                refreshButton.innerHTML = '↻';
                refreshButton.classList.add('copy-button');
                refreshButton.style.marginLeft = '10px';
                refreshButton.style.fontSize = window.getComputedStyle(locationElement).getPropertyValue('font-size'); // Set the font size to match the target element
                refreshButton.style.lineHeight = '0.7em'; // Set the line height to 0.7 em
                refreshButton.addEventListener("click", () => {
                    document.getElementById("locationElementId").remove();
                    document.getElementById("newListItemActiveId").remove();
                    //document.querySelector("body > table > tbody > tr.fold-row > td:nth-child(2) > div > dl:nth-child(2) > dd:nth-child(8)").remove();
                    //document.querySelector("body > table > tbody > tr.fold-row > td:nth-child(2) > div > dl:nth-child(2) > dt:nth-child(7)").remove();
                    document.getElementById("newListItemId").remove();
                    document.getElementById("locationElementActiveId").remove();
                    retrieveUserLocation(userId, warehouseId, container);
                });

                //newListItemActive.appendChild(locationElementActive);
                locationElement.appendChild(refreshButton);
                container.appendChild(locationElement);

                //create the new activity element title
                const newListItemActive = document.createElement("dt");
                newListItemActive.id ="newListItemActiveId";
                newListItemActive.textContent = "Pick Activity";
                container.appendChild(newListItemActive);

                //create the new activity element dynamic element
                const locationElementActive = document.createElement('dd');
                if (user) {
                    if (user.active === true) {
                        locationElementActive.textContent = `Active`;
                        locationElementActive.id = "locationElementActiveId";
                    }
                    else {
                        locationElementActive.textContent = `Inactive`;
                        locationElementActive.id = "locationElementActiveId";
                    }
                    //locationElementActive.textContent = `${user.active}`;
                    //locationElementActive.textContent = `${user.active}`;
                } else {
                    locationElementActive.textContent = '--';
                    locationElementActive.id = "locationElementActiveId";
                    //locationElementActive.textContent = '--';
                }
                container.appendChild(locationElementActive);

            },
            onerror: function(error) {
                const newListItem = document.createElement("dt");
                newListItem.textContent = "Last Pick:";
                container.appendChild(newListItem);

                const locationElement = document.createElement('dd');
                locationElement.textContent = 'Error retrieving user location.';
                container.appendChild(locationElement);
            }
        });
    }
}

function incrementCounter() {
    let counter = GM_getValue('fclmPortalVisits', 0);
    counter++;
    GM_setValue('fclmPortalVisits', counter);
    console.log(`FCLM visits: ${counter}`);
}

function clearCounterOnMinute() {
    const now = new Date();
    if (now.getSeconds() === 0) {
        GM_setValue('fclmPortalVisits', 0);
        console.log('FCLM visit counter cleared.');
    }
}

(function() {
    exec();
    setInterval(clearCounterOnMinute, 1000);
})();

// Rest of the script remains the same
(function() {
    'use strict';

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Get the target elements
        const targetElements = [
            document.querySelector("body > table > tbody > tr.fold-row > td:nth-child(2) > div > dl:nth-child(1) > dd:nth-child(2)"),
            document.querySelector("body > table > tbody > tr.fold-row > td:nth-child(2) > div > dl:nth-child(1) > dd:nth-child(4)"),
            document.querySelector("body > table > tbody > tr.fold-row > td:nth-child(2) > div > dl:nth-child(1) > dd:nth-child(6)")
        ];

        // Loop through the target elements and add copy buttons
        targetElements.forEach(targetElement => {
            // Get the computed font size of the target element
            const targetFontSize = window.getComputedStyle(targetElement).getPropertyValue('font-size');

            // Create the copy button
        // Extract the last name and full name
        const lastName = targetText.substring(0, targetText.indexOf(',')).trim();
        const fullName = firstName + ' ' + lastName;

        // Create the copy button for Last Name
        const lastNameButton = document.createElement('button');
        lastNameButton.innerHTML = '<svg viewBox="0 0 24 24" width="0.7em" height="0.7em"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c-1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg> Last Name';
        lastNameButton.classList.add('copy-button');
        lastNameButton.style.marginLeft = '10px';
        lastNameButton.style.fontSize = window.getComputedStyle(targetElement).getPropertyValue('font-size');
        lastNameButton.style.lineHeight = '0.7em';

        lastNameButton.addEventListener('click', function() {
            navigator.clipboard.writeText(lastName);
        });

        targetElementSubheader.appendChild(lastNameButton);

        // Create the copy button for Full Name
        const fullNameButton = document.createElement('button');
        fullNameButton.innerHTML = '<svg viewBox="0 0 24 24" width="0.7em" height="0.7em"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c-1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg> Full Name';
        fullNameButton.classList.add('copy-button');
        fullNameButton.style.marginLeft = '10px';
        fullNameButton.style.fontSize = window.getComputedStyle(targetElement).getPropertyValue('font-size');
        fullNameButton.style.lineHeight = '0.7em';

        fullNameButton.addEventListener('click', function() {
            navigator.clipboard.writeText(fullName);
        });

        targetElementSubheader.appendChild(fullNameButton);

            const copyButton = document.createElement('button');
            copyButton.innerHTML = '<svg viewBox="0 0 24 24" width="0.7em" height="0.7em"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>';
            copyButton.classList.add('copy-button');
            copyButton.style.marginLeft = '10px';
            copyButton.style.fontSize = targetFontSize; // Set the font size to match the target element
            copyButton.style.lineHeight = '0.7em'; // Set the line height to 1 em

            // Add the click event listener
            copyButton.addEventListener('click', function(event) {
                event.stopPropagation();
                const textToCopy = targetElement.textContent;
                navigator.clipboard.writeText(textToCopy);
            });

            // Insert the copy button inside the target element
            targetElement.appendChild(copyButton);
        });
    });
})();

(function() {
    'use strict';

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Get the target elements
        const targetElement = document.querySelector("body > table > tbody > tr:nth-child(1) > td > span");
        const targetElementSubheader = document.querySelector("body > table > tbody > tr.fold-row > td:nth-child(2) > span > span")

        // Get the text content of the target element
        const targetText = targetElement.textContent;

        // Extract the first name from the target text
        const firstNameIndex = targetText.indexOf(',') + 1;
        const spaceIndex = targetText.indexOf(' ', firstNameIndex);
        const firstName = targetText.substring(firstNameIndex, spaceIndex).trim();

        // Create the copy button
        // Extract the last name and full name
        const lastName = targetText.substring(0, targetText.indexOf(',')).trim();
        const fullName = firstName + ' ' + lastName;

        // Create the copy button for Last Name
        const lastNameButton = document.createElement('button');
        lastNameButton.innerHTML = '<svg viewBox="0 0 24 24" width="0.7em" height="0.7em"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c-1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg> Last Name';
        lastNameButton.classList.add('copy-button');
        lastNameButton.style.marginLeft = '10px';
        lastNameButton.style.fontSize = window.getComputedStyle(targetElement).getPropertyValue('font-size');
        lastNameButton.style.lineHeight = '0.7em';

        lastNameButton.addEventListener('click', function() {
            navigator.clipboard.writeText(lastName);
        });

        targetElementSubheader.appendChild(lastNameButton);

        // Create the copy button for Full Name
        const fullNameButton = document.createElement('button');
        fullNameButton.innerHTML = '<svg viewBox="0 0 24 24" width="0.7em" height="0.7em"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c-1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg> Full Name';
        fullNameButton.classList.add('copy-button');
        fullNameButton.style.marginLeft = '10px';
        fullNameButton.style.fontSize = window.getComputedStyle(targetElement).getPropertyValue('font-size');
        fullNameButton.style.lineHeight = '0.7em';

        fullNameButton.addEventListener('click', function() {
            navigator.clipboard.writeText(fullName);
        });

        targetElementSubheader.appendChild(fullNameButton);

        const copyButton = document.createElement('button');
        copyButton.innerHTML = '<svg viewBox="0 0 24 24" width="0.7em" height="0.7em"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg> First Name';
        copyButton.classList.add('copy-button');
        copyButton.style.marginLeft = '10px';
        copyButton.style.fontSize = window.getComputedStyle(targetElement).getPropertyValue('font-size'); // Set the font size to match the target element
        copyButton.style.lineHeight = '0.7em'; // Set the line height to 0.7 em

        // Add the click event listener
        copyButton.addEventListener('click', function() {
            navigator.clipboard.writeText(firstName);
        });

        // Insert the copy button inside the target element
        targetElementSubheader.appendChild(copyButton);
    });
})();
