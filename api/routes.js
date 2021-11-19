//https://github.coventry.ac.uk/agile/projects/blob/master/19%20Survey.md
/* routes.js */

import { Router } from "https://deno.land/x/oak@v6.5.1/mod.ts";

import { extractCredentials, saveFile } from "./modules/util.js";
import { login, register } from "./modules/accounts.js";
import { getUserId, saveSurvey, getMySurveys, addQuestion, getNumberOfQuestions, getAllFrom, getSurveyQuestions, addResponse, hasUserDone, getAverageScore} from "./modules/dbinterface.js";
import { survey, question, response } from './modules/schema.js'
 
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
  let data = await body.value;
  const credentials = extractCredentials(token)
  const now = new Date().toISOString()
  const date = now.slice(0,19).replace('T', ' ')
  data.userid = await getUserId(credentials.user)
  data.created = date
  console.log(data);
	  
  try{
	  const valid = survey(data)
	  if(valid === false) throw survey.errors
	  await saveSurvey(data)
	  
	  context.response.status = 201
	  context.response.body = JSON.stringify({ status: 'SUCESS, VALID OBJECT' })
  }catch(err){
	  console.log(err)
	  context.response.status = 400
	  context.response.body = JSON.stringify({ status: 'INVALID OBJECT' })
  }
});


//Feature 2
//Get my survey name, date and questions post link
router.get("/api/v1/mysurveys", async (context) => {
  console.log("GET /api/surveys");
  const token = context.request.headers.get("Authorization");
  console.log(`auth: ${token}`)
  const credentials = extractCredentials(token);
  const userid = await getUserId(credentials.user)
  try{
	  let surveys = await getMySurveys(userid)
	  
	  for(const survey of surveys){
		  survey.questions = await getNumberOfQuestions(survey.id)
		  survey.href = `https://orange-martin-8080.codio-box.uk/api/v1/mysurveys/${survey.id}`
	  }

	  console.log(surveys)
	  context.response.status = 201
	  context.response.body = JSON.stringify(surveys, null, 2)
	  
  }catch(err){
	  console.log(err)
	  context.response.status = 400
	  context.response.body = JSON.stringify({ status: 'failed' })
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
	console.log(questions)
	try{	
		const valid = question(questions)
		if(valid === false) throw question.errors
		for(const question of questions){
			await addQuestion(question, context.params.id, date)
		}
		context.response.status = 201
		context.response.body = JSON.stringify({ status: 'questions sucessfully added' })
	}catch(err){
		console.log(err)
		context.response.status = 400
		context.response.body = JSON.stringify({ status: 'INVALID OBJECT' })
	}
	
	
});


//Feature 3
//get all existing surveys with completion links
router.get("/api/v1/surveys", async (context) => {
  console.log("GET /api/surveys");
  const token = context.request.headers.get("Authorization");
  console.log(`auth: ${token}`)
  const credentials = extractCredentials(token);
  const userid = await getUserId(credentials.user)
  try{
	  let surveys = await getAllFrom('surveys')
	  
	  for(const survey of surveys){
		  survey.questions = await getNumberOfQuestions(survey.id)
		  if(await hasUserDone(userid, survey.id)){
			  survey.avgScore = await getAverageScore(userid, survey.id)
		  }else{
			  survey.href = `https://orange-martin-8080.codio-box.uk/api/v1/surveys/${survey.id}`
		  }
	
	  }
	  
	  console.log(surveys)
	  context.response.status = 201
	  context.response.body = JSON.stringify(surveys, null, 2)
	  
  }catch(err){
	  console.log(err)
	  context.response.status = 400
	  context.response.body = JSON.stringify({ status: 'failed' })
  }
});


//Feature 4
//needs a get method for getting the questions
//needs a post method for submitting responses

//get survey questions
router.get('/api/v1/surveys/:id', async (context) => {
  console.log("GET /api/surveys/:id");
  const token = context.request.headers.get("Authorization");
  try{
	let data = { questions: await getSurveyQuestions(context.params.id) } 
	data.submit = `https://orange-martin-8080.codio-box.uk/api/v1/surveys/${context.params.id}`
	console.log(data)
	context.response.body = JSON.stringify(data, null, 2)
  }catch(err){
	console.log(err)
	context.response.status = 400
	context.response.body = JSON.stringify({ status: 'failed' })
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
	try{
		const valid = response(responses)
		if(valid === false) throw response.errors
		
		for(const response of responses){
			await addResponse(userid, surveyid, response)
		}
		context.response.status = 201
		context.response.body = JSON.stringify({ status: 'questions sucessfully added' })
	}catch(err){
		console.log(err)
		context.response.status = 400
		context.response.body = JSON.stringify({ status: 'INVALID OBJECT' })
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
    context.response.body = JSON.stringify(
      {
        data: { username },
      },
      null,
      2,
    );
  } catch (err) {
    context.response.status = 401;
    context.response.body = JSON.stringify(
      {
        errors: [
          {
            title: "401 Unauthorized.",
            detail: err.message,
          },
        ],
      },
      null,
      2,
    );
  }
});


//manages registering
router.post('/api/v1/accounts', async context => {
	console.log('POST /api/acc')
	const body  = await context.request.body()
	const data = await body.value
	console.log(data)
	try{
		await register(data)
		context.response.status = 201
		context.response.body = JSON.stringify({ status: 'success', msg: 'account created' })	
	}catch(err){
		console.log(err)
		context.response.status = 400
		context.response.body = JSON.stringify({ status: 'failed', msg: "couldnt create account" })
	}
	
})



router.get("/(.*)", async (context) => {
  // 	const data = await Deno.readTextFile('static/404.html')
  // 	context.response.body = data
  const data = await Deno.readTextFile("spa/index.html");
  context.response.body = data;
});

export default router;
