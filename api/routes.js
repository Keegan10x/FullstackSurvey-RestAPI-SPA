//https://jsonapi.org/format/

//https://github.coventry.ac.uk/agile/projects/blob/master/19%20Survey.md
/* routes.js */

import { Router } from "https://deno.land/x/oak@v6.5.1/mod.ts";

import { extractCredentials, saveFile } from "./modules/util.js";
import { login, register } from "./modules/accounts.js";
import { getUserId, saveSurvey, getMySurveys, addQuestion, getNumberOfQuestions, getAllFrom, getSurveyQuestions, addResponse, hasUserDone, getAverageScore} from "./modules/dbinterface.js";
import { survey, question, response, creds } from './modules/schema.js'
import { surveySch, mysurveySch, questionSch, accountsSch, mysurveyPostSch, myquestionsPostSch, myresponsesPostSch, myaccountsPostSch} from './modules/schema.js'
const router = new Router();

// assignment end-points

//Feature 1
//Creates survery and insert to DB
router.post("/api/v1/mysurveys", async (context) => {
  console.log("POST /api/surveys");
  const token = context.request.headers.get("Authorization");
  console.log(`auth: ${token}`)
  //context.response.headers.set("Content-Type", "application/vnd.api+json")
  
  const body = await context.request.body();
  const data = await body.value;
  console.log(data)
  
  const credentials = extractCredentials(token)
  const now = new Date().toISOString()
  const date = now.slice(0,19).replace('T', ' ')
  data.userid = await getUserId(credentials.user)
  data.created = date
  console.log(data);
  mysurveyPostSch.links.self = `https://${context.request.url.host}${context.request.url.pathname}`
  
  try{
	  const valid = survey(data)
	  console.log(valid)
	  if(valid === false) throw survey.errors
	  await saveSurvey(data)
	  mysurveyPostSch.status = 'SUCESS, VALID OBJECT'
	  mysurveyPostSch.data = data
	  context.response.status = 201
	  myquestionsPostSch.errors = null
	  context.response.body = JSON.stringify(mysurveyPostSch)
  }catch(err){
	  console.log(err)
	  context.response.status = 406
	  mysurveyPostSch.status = 406
	  mysurveyPostSch.errors = survey.errors
	  console.log(mysurveyPostSch)
	  context.response.body = JSON.stringify(mysurveyPostSch)
  }
});


//Feature 2
//Get my survey name, date and questions post link
router.get("/api/v1/mysurveys", async (context) => {
  console.log("GET /api/surveys");
  console.log(context.request.url.href)
  const token = context.request.headers.get("Authorization");
  console.log(`auth: ${token}`)
  const credentials = extractCredentials(token);
  const userid = await getUserId(credentials.user)
  mysurveySch.links.self = `https://${context.request.url.host}${context.request.url.pathname}`
  try{
	  let surveys = await getMySurveys(userid)
	  for(const survey of surveys){
		  survey.type = 'survey'
		  survey.questions = await getNumberOfQuestions(survey.id)
		  survey.href = `https://${context.request.url.host}${context.request.url.pathname}/${survey.id}`
	  }
	  
	  mysurveySch.data = surveys
	  //console.log(surveys)
	  context.response.status = 201
	  context.response.body = JSON.stringify(mysurveySch, null, 2)
	  
  }catch(err){
	  console.log(err)
	  context.response.status = 400
	  mysurveySch.status = 400
	  mysurveySch.response = 'failed'
	  context.response.body = JSON.stringify({ mysurveySch })
  }
});

//Feature 2
//Post my survey questions
router.post('/api/v1/mysurveys/:id', async context => {
	console.log("GET /api/mysurveys/:id");
	const token = context.request.headers.get("Authorization");
	const body = await context.request.body()
	const questions = await body.value
	const now = new Date().toISOString()
	const date = now.slice(0,19).replace('T', ' ')
	myquestionsPostSch.links.self = `https://${context.request.url.host}${context.request.url.pathname}`
	console.log(questions)
	try{	
		const valid = question(questions)
		if(valid === false) throw question.errors
		for(const question of questions){
			await addQuestion(question, context.params.id, date)
		}
		
		context.response.status = 201
		myquestionsPostSch.status = 201
		myquestionsPostSch.response = 'questions sucessfully added'
		myquestionsPostSch.errors = null
		myquestionsPostSch.data = questions
		
		context.response.body = JSON.stringify(myquestionsPostSch)
	}catch(err){
		console.log(err)
		context.response.status = 406
		myquestionsPostSch.status = 406
		myquestionsPostSch.errors = question.error
		myquestionsPostSch.response = 'INVALID OBJECT'
		context.response.body = JSON.stringify(myquestionsPostSch)
	}
	
	
});


//Feature 3
//get all existing surveys with completion links
router.get("/api/v1/surveys", async (context) => {
  console.log("GET /api/surveys");
  surveySch.links.self = `https://${context.request.url.host}${context.request.url.pathname}`
  const token = context.request.headers.get("Authorization");
  console.log(`auth: ${token}`)

  //if not logged in
  if(!token){
	  let surveys = await getAllFrom('surveys')
	  for(const survey of surveys){
		  survey.created = survey.created.toString().slice(4, 15)
		  survey.type = 'survey'
		  survey.questions = await getNumberOfQuestions(survey.id)
		  survey.href = `https://${context.request.url.host}${context.request.url.pathname}/${survey.id}`
	  }
	  surveySch.data = surveys
	  context.response.status = 201
	  context.response.body = JSON.stringify(surveySch, null, 2)
		  
  } else if(token){
	  const credentials = extractCredentials(token);
	  const userid = await getUserId(credentials.user)
	  let surveys = await getAllFrom('surveys')
	  try{
		  //console.log(surveys)
		  for(const survey of surveys){
			  survey.created = survey.created.toString().slice(4, 15)
			  survey.type = 'survey'
			  survey.questions = await getNumberOfQuestions(survey.id)
			  if(await hasUserDone(userid, survey.id)){
				  survey.avgScore = await getAverageScore(userid, survey.id)
			  }else{
				  survey.href = `https://${context.request.url.host}${context.request.url.pathname}/${survey.id}`
			  }
	
		  }
		  //console.log(surveys)
		  surveySch.data = surveys
		  context.response.status = 201
		  context.response.body = JSON.stringify(surveySch, null, 2)
	  
	  }catch(err){
		  console.log(err)
		  context.response.status = 400
		  surveySch.response = 400
		  surveySch.status = 'failed'
		  context.response.body = JSON.stringify(surveySch)
	  }
  }  
});


//Feature 4
//needs a get method for getting the questions
//needs a post method for submitting responses

//get survey questions
router.get('/api/v1/surveys/:id', async (context) => {
  console.log("GET /api/surveys/:id");
  const token = context.request.headers.get("Authorization");
  questionSch.links.self = `https://${context.request.url.host}${context.request.url.pathname}`
  try{
	let data = { questions: await getSurveyQuestions(context.params.id) } 
	questionSch.links.submit = `https://${context.request.url.host}${context.request.url.pathname}`
	  
	questionSch.data = data
	questionSch.errors = null
	context.response.body = JSON.stringify(questionSch, null, 2)
  }catch(err){
	console.log(err)
	context.response.status = 400
	questionSch.errorCode = 400
	questionSch.error = err
	questionSch.response = 'failed'
	context.response.body = JSON.stringify(questionSch)
  }
});

//submit survey questions
router.post('/api/v1/surveys/:id', async context => {
	console.log("GET /api/mysurveys/:id");
	const token = context.request.headers.get("Authorization");
	const body = await context.request.body()
	const responses = await body.value
	const credentials = extractCredentials(token);
	const userid = await getUserId(credentials.user)
	const surveyid = context.params.id
	myresponsesPostSch.links.self = `https://${context.request.url.host}${context.request.url.pathname}`
	try{
		const valid = response(responses)
		if(valid === false) throw response.errors
		
		for(const response of responses){
			await addResponse(userid, surveyid, response)
		}
		
		
		myresponsesPostSch.data = responses
		myresponsesPostSch.status = 201
		myresponsesPostSch.response = 'Responses added sucessfully added'
		myresponsesPostSch.errors = null
		context.response.status = 201
		context.response.body = JSON.stringify(myresponsesPostSch)
	}catch(err){
		console.log(err)
		context.response.status = 406
		myresponsesPostSch.response = 406
		myresponsesPostSch.errors = response.errors
		context.response.body = JSON.stringify(myresponsesPostSch)
	}
	
});


router.get("/", async (context) => {
  console.log("GET /");
  const data = await Deno.readTextFile("spa/index.html");
  context.response.body = data;
});


router.get("/api/v1/accounts", async (context) => {
  console.log("GET /api/accounts");
  const token = context.request.headers.get("Authorization");
  console.log(`auth: ${token}`);
  try {
    const credentials = extractCredentials(token);
    console.log(credentials);
    const username = await login(credentials);
    console.log(`username: ${username}`);
    
    accountsSch.links.self = `https://${context.request.url.host}${context.request.url.pathname}`
    accountsSch.data = username
	  
    context.response.body = JSON.stringify(accountsSch,null,2,);
  } catch (err) {
    context.response.status = 401;
    context.response.body = JSON.stringify({ errors:[{
            title: "401 Unauthorized.",
            detail: err.message,
          },],},null,2,);
  }
});


//manages registering
router.post('/api/v1/accounts', async context => {
	console.log('POST /api/acc')
	const body  = await context.request.body()
	const data = await body.value
	console.log(data)
	myaccountsPostSch.links.self = `https://${context.request.url.host}${context.request.url.pathname}`
	try{
		const valid = creds(data)
		if(valid === false) throw creds.errors
		
		await register(data)
		myaccountsPostSch.data = data
		myaccountsPostSch.status = 201
	        myaccountsPostSch.response = 'Account created'
	        myaccountsPostSch.errors = null
		context.response.status = 201
		console.log(myaccountsPostSch)
		context.response.body = JSON.stringify(myaccountsPostSch, null, 2)	
	}catch(err){
		console.log(err)
		myaccountsPostSch.status = 406
		myaccountsPostSch.response = 'Couldnt create account'
		myaccountsPostSch.errors = creds.errors
		context.response.status = 406
		console.log(myaccountsPostSch)
		context.response.body = JSON.stringify(myaccountsPostSch, null, 2)
	}
})



router.get("/(.*)", async (context) => {
  // 	const data = await Deno.readTextFile('static/404.html')
  // 	context.response.body = data
  const data = await Deno.readTextFile("spa/index.html");
  context.response.body = data;
});

export default router;


