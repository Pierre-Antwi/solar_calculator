/*jslint browser:true */
"use strict";
function addMonths(elem)
{
	var annualUseKw = 0, dailyUseKw = 0, i = 0, x = 0;
	var months = document.getElementById(elem).getElementsByTagName('input');
	for(i=0;i<months.length;i++)
	{
		x = Number(months[i].value);
		annualUseKw += x;
	}
	dailyUseKw = annualUseKw/365;
	return dailyUseKw;
}

function sunHours()
{	
	var hrs;
	var theZone = document.forms.solarForm.zone.selectedIndex;
	theZone+=1;
	switch(theZone)
	{
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

function calculatePanel()
{
	var userChoice = document.forms.solarForm.panel.selectedIndex;
	var panelOptions = document.forms.solarForm.panel.options;
	var power = panelOptions[userChoice].value;
	var name = panelOptions[userChoice].text;
	var x = [power, name];
	return x;
}


function calculateSolar()
{

	var dailyUseKw = addMonths('mpc');
	var sunHoursPerDay = sunHours();
	var minKwNeeds = dailyUseKw/sunHoursPerDay;
	var realKwNeeds = minKwNeeds * 1.25;
	var realWattNeeds = realKwNeeds * 1000;
	var panelInfo = calculatePanel();
	var panelOutput = panelInfo[0];
	var panelName = panelInfo[1];
	var panelsNeeded = Math.ceil(realWattNeeds/panelOutput);
	
	var feedback = "";
	feedback += "<p>Based on your average daily use of "+Math.round(dailyUseKw)+" kWh you will need to purchase "+panelsNeeded+" "+panelName+" solar panels to offset 100% of your electricity bill</p>";
	feedback += "<h2>Additional Details</h2>";
	feedback += "<p>Your average daily electricity consumption: "+Math.round(dailyUseKw)+" Kwh per day.</p>";
	feedback += "<p>Average sunshine hours per day: "+sunHoursPerDay+" hours</p>";
	feedback += "<p>Realistic watts needed per hour: "+Math.round(realWattNeeds)+" watts/hour.</p>";
	feedback += "<p>The "+panelName+" panel you selected generates about "+panelOutput+" watts per day.</p>";
	
	document.getElementById('feedback').innerHTML = feedback;
}

/*
function validateForm() {
    var isValid = true;
    var message = "";
  
    // Check if all monthly kWh inputs are valid (numeric and non-negative)
    var months = document.getElementById('mpc').getElementsByTagName('input');
    for (var i = 0; i < months.length; i++) {
      var x = Number(months[i].value);
      if (isNaN(x) || x < 0) {
        isValid = false;
        message += "Please enter valid monthly kWh usage (numbers greater than or equal to 0).\n";
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
    */

  // Function to validate the form
function validateForm() {
    var months = document.getElementById('mpc').getElementsByTagName('input');
    for (var i = 0; i < months.length; i++) {
        if (months[i].value === "" || isNaN(months[i].value) || Number(months[i].value) < 0) {
            alert("Please enter a valid positive number for " + months[i].name);
            return false;
        }
    }
    return true;
}