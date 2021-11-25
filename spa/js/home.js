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
		
		const section = document.createElement('section')
		const h2 = document.createElement('h2')
		const time = document.createElement('time')
		const descPara = document.createElement('p')
		const questionPara = document.createElement('p')
		const link = document.createElement('a')
		link.innerText = 'TAKE SURVEY'
		
		h2.innerText = survey.name
		time.innerText = `Date Created: ${survey.created}`
		descPara.innerText = survey.description
		questionPara.innerText = `Questions: ${survey.questions}`
		if(survey.href){ link.href = survey.href
		}else link.innerText = survey.avgScore
		
		section.appendChild(h2)
		section.appendChild(time)
		section.appendChild(descPara)
		section.appendChild(questionPara)
		section.appendChild(link)
		fragment.appendChild(section)
		node.appendChild(fragment)
	}
}