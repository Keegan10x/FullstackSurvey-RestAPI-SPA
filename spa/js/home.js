/* home.js */

import { customiseNavbar } from "../util.js";

export async function setup(node) {
  console.log("HOME: setup");
  try {
    console.log(node);
    document.querySelector("header p").innerText = "Home";
    customiseNavbar(["home", "foo", "logout"]); // navbar if logged in
    const token = localStorage.getItem("authorization");
    console.log(token);
    if (token === null) customiseNavbar(["home", "register", "login"]); //navbar if logged out

    //call functions here
    console.log('SURVEYS')
    //await addContent(node)
    await addSurvey(node)
  } catch (err) {
    console.error(err);
  }
}

async function addSurvey(node){
	console.log('SHOWING SURVEYS')
	const uri = "/api/v1/surveys"
	//console.log(uri, JSON.stringify(options, null, 2))
	
	//IF AUTHORIZED
	if(localStorage.getItem("authorization")){
		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/vnd.api+json",
				"Authorization": localStorage.getItem("authorization"),
			},
		}
		const rsp = await fetch(uri, options)
		const surveyObj = await rsp.json()
		console.log(surveyObj)
		popSurveyFrags(node, surveyObj)
	}
	
	//IF UNAUTHORIZED
	if(!localStorage.getItem("authorization")){
		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/vnd.api+json",
			},
		}
		const rsp = await fetch(uri, options)
		const surveyObj = await rsp.json()
		console.log(surveyObj)
		popSurveyFrags(node, surveyObj)
	}
}

function popSurveyFrags(node, obj){
	const template = document.querySelector('template#surveys')
	for(const survey of obj.data){
		const fragment = template.content.cloneNode(true)
		fragment.querySelector('h2').innerText = survey.name
		fragment.querySelector('p').innerText = survey.description
		fragment.querySelector('time').innerText = survey.created
		fragment.querySelector('b').innerText = survey.questions
		if(survey.href){ fragment.querySelector('a').innerText = survey.href
		}else fragment.querySelector('a').innerText = survey.avgScore
		node.appendChild(fragment)
	}
}