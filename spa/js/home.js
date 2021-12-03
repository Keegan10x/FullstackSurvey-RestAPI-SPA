/* home.js */



import { customiseNavbar } from "../util.js";

export async function setup(node) {
  console.log("HOME: setup");
  try {
    let admin = await addSurvey(node)
    console.log("ADMIN IS", admin) 
    console.log(node);
    document.querySelector("header p").innerText = "Home";
    customiseNavbar(["home", "newsurvey", "logout", "surveyQuestions", "mySurveys"]); // navbar if logged in
    const token = localStorage.getItem("authorization");
    console.log(token);
    if (token === null) customiseNavbar(["home", "register", "login"]); //navbar if logged out

    if (!admin && token) customiseNavbar(["home", "logout", "surveyQuestions"]); //if not admin
	  
    //call functions here
    console.log('SURVEYS')
    //await addContent(node)
    //await addSurvey(node)
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
		return surveyObj.admin
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
		//return surveyObj.admin
		return false
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
		
		
		h2.innerText = survey.name
		time.innerText = `Date Created: ${survey.created}`
		descPara.innerHTML = survey.description
		questionPara.innerText = `Questions: ${survey.questions}`
		
		section.appendChild(h2)
		section.appendChild(time)
		section.appendChild(descPara)
		section.appendChild(questionPara)
		
		if(survey.href){
			const link = document.createElement('a')
			link.innerText = 'TAKE SURVEY'
			link.href = `/surveyQuestions?survey=${survey.id}`
			section.appendChild(link)
		}else{
			const score = document.createElement('p')
			score.innerText = `Average Score: ${survey.avgScore}`
			section.appendChild(score)
		}
		
		fragment.appendChild(section)
		node.appendChild(fragment)
	}
}