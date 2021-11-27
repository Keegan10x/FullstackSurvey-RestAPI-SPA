/* mySurveys.js */

import {
  customiseNavbar,
  file2DataURI,
  loadPage,
  secureGet,
  showMessage,
} from "../util.js";


export async function setup(node) {
  console.log("mySurveys: setup");
  try {
    console.log(node);
    document.querySelector("header p").innerText = "My Surveys";
    customiseNavbar(["home", "logout", "newsurvey", "mySurveys"]);
    if (localStorage.getItem("authorization") === null) loadPage("login");
    // there is a token in localstorage
    
    //get my surveys <-----
    await getMySurveys(node)
  } catch (err) {
    console.error(err);
  }
}


async function getMySurveys(node){
	console.log("GETTING MY SURVEYS")
}