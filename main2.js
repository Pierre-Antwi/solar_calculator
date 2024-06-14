/*jslint browser:true */
"use strict";

// Function to add months and calculate daily usage
function addMonths(elem) {
    var annualUseKw = 0, dailyUseKw = 0, i = 0, x = 0;
    var months = document.getElementById(elem).getElementsByTagName('input');
    for (i = 0; i < months.length; i++) {
        x = Number(months[i].value);
        if (isNaN(x) || x < 0) {
            return false;  // If invalid, return false
        }
        annualUseKw += x;
    }
    dailyUseKw = annualUseKw / 365;
    return dailyUseKw;
}

// Function to get sun hours based on the zone
function sunHours() {
    var hrs;
    var theZone = document.forms.solarForm.zone.selectedIndex;
    theZone += 1;
    switch (theZone) {
        case 1:
            hrs = 6;
            break;
        case 2:
            hrs = 5.5;
            break;
        case 3:
            hrs = 5;
            break;
        case 4:
            hrs = 4.5;
            break;
        case 5:
            hrs = 4.2;
            break;
        case 6:
            hrs = 3.5;
            break;
        default:
            hrs = 0;
    }
    return hrs;
}

// Function to calculate the selected panel's information
function calculatePanel() {
    var userChoice = document.forms.solarForm.panel.selectedIndex;
    var panelOptions = document.forms.solarForm.panel.options;
    var power = panelOptions[userChoice].value;
    var name = panelOptions[userChoice].text;
    var x = [power, name];
    return x;
}

// Function to validate the form
function validateForm() {
    var isValid = true;
    var message = "";

    // Check if all monthly kWh inputs are valid (numeric and non-negative)
    var months = document.getElementById('mpc').getElementsByTagName('input');
    for (var i = 0; i < months.length; i++) {
        var x = months[i].value;
        if (x === "" || isNaN(Number(x)) || Number(x) < 0) {
            isValid = false;
            message += "Please enter a valid monthly kWh usage (numbers greater than or equal to 0) for " + months[i].name + ".\n";
        }
    }

    // Check if zone is selected
    if (document.forms.solarForm.zone.selectedIndex === 0) {
        isValid = false;
        message += "Please select your sunshine zone.\n";
    }

    // Check if panel is selected
    if (document.forms.solarForm.panel.selectedIndex === 0) {
        isValid = false;
        message += "Please select a solar panel.\n";
    }

    // Display any validation errors
    if (!isValid) {
        alert(message);
    }

    return isValid;  // Return true if form is valid, false otherwise
}

// Function to calculate solar needs
function calculateSolar() {
    // Validate the form
    if (!validateForm()) {
        return;
    }

    // Show progress bar
    document.getElementById('progress').style.display = 'block';

    setTimeout(function () {
        var dailyUseKw = addMonths('mpc');
        if (dailyUseKw === false) {
            alert("Please enter valid monthly kWh usage.");
            document.getElementById('progress').style.display = 'none';
            return;
        }
        var sunHoursPerDay = sunHours();
        var minKwNeeds = dailyUseKw / sunHoursPerDay;
        var realKwNeeds = minKwNeeds * 1.25;
        var realWattNeeds = realKwNeeds * 1000;
        var panelInfo = calculatePanel();
        var panelOutput = panelInfo[0];
        var panelName = panelInfo[1];
        var panelsNeeded = Math.ceil(realWattNeeds / panelOutput);

        var feedback = "";
        feedback += "<p>Based on your average daily use of " + Math.round(dailyUseKw) + " kWh, you will need to purchase " + panelsNeeded + " " + panelName + " solar panels to offset 100% of your electricity bill.</p>";
        feedback += "<h2>Additional Details</h2>";
        feedback += "<p>Your average daily electricity consumption: " + Math.round(dailyUseKw) + " kWh per day.</p>";
        feedback += "<p>Average sunshine hours per day: " + sunHoursPerDay + " hours</p>";
        feedback += "<p>Realistic watts needed per hour: " + Math.round(realWattNeeds) + " watts/hour.</p>";
        feedback += "<p>The " + panelName + " panel you selected generates about " + panelOutput + " watts per day.</p>";

        document.getElementById('feedback').innerHTML = feedback;

        // Hide progress bar
        document.getElementById('progress').style.display = 'none';
    }, 2000); // Simulate processing delay
}
