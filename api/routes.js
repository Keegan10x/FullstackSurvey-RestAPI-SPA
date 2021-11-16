/* routes.js */

import { Router } from "https://deno.land/x/oak@v6.5.1/mod.ts";

import { extractCredentials, saveFile } from "./modules/util.js";
import { login, register } from "./modules/accounts.js";
import { getUserId, saveSurvey, getMySurveys, addQuestion, getNumberOfQuestions} from "./modules/dbinterface.js";
 
const router = new Router();

// assignment end-points

//Feature 1
//Creates survery and insert to DB
router.post("/api/surveys", async (context) => {
  console.log("POST /api/surveys");
  const token = context.request.headers.get("Authorization");
  console.log(`auth: ${token}`)
  //context.response.headers.set("Content-Type", "application/vnd.api+json")	
  try{
	  const body = await context.request.body();
	  let data = await body.value;
	  const credentials = extractCredentials(token);
	  const now = new Date().toISOString()
	  const date = now.slice(0,19).replace('T', ' ')
	  //console.log(date)
	  data.userid = await getUserId(credentials.user)
	  data.created = date
	  
	  console.log(data);
	  await saveSurvey(data)
	  
	  context.response.status = 201
	  context.response.body = JSON.stringify({ status: 'sucess' })
  }catch(err){
	  console.log(err)
	  context.response.status = 400
	  context.response.body = JSON.stringify({ status: 'failed' })
  }
});


//Feature 2
//Get my survey name, date and questions post link
router.get("/api/mysurveys", async (context) => {
  console.log("GET /api/surveys");
  const token = context.request.headers.get("Authorization");
  console.log(`auth: ${token}`)
  const credentials = extractCredentials(token);
  const userid = await getUserId(credentials.user)
  try{
	  let surveys = await getMySurveys(userid)
	  
	  for(const survey of surveys){
		  survey.questions = await getNumberOfQuestions(survey.id)
		  survey.href = `https://orange-martin-8080.codio-box.uk/api/mysurveys/${survey.id}`
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
router.post('/api/mysurveys/:id', async context => {
	console.log("GET /api/mysurveys/:id");
	const token = context.request.headers.get("Authorization");
	try{
		const body = await context.request.body()
		const questions = await body.value
		const now = new Date().toISOString()
		const date = now.slice(0,19).replace('T', ' ')
		console.log(questions)
		
		for(const question of questions){
			await addQuestion(question, context.params.id, date)
		}

		context.response.status = 201
		context.response.body = JSON.stringify({ status: 'questions sucessfully added' })
	}catch(err){
		console.log(err)
		context.response.status = 400
		context.response.body = JSON.stringify({ status: 'failed' })
	}
	
	
});


//Feature 3
//get all surveys and the number of questions

//Feature 4
//needs a get and post method for the survey questions

router.get("/", async (context) => {
  console.log("GET /");
  const data = await Deno.readTextFile("spa/index.html");
  context.response.body = data;
});

router.get("/api/accounts", async (context) => {
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

router.post("/api/accounts", async (context) => {
  console.log("POST /api/accounts");
  const body = await context.request.body();
  const data = await body.value;
  console.log(data);
  await register(data);
  context.response.status = 201;
  context.response.body = JSON.stringify({
    status: "success",
    msg: "account created",
  });
});

router.post("/api/files", async (context) => {
  console.log("POST /api/files");
  try {
    const token = context.request.headers.get("Authorization");
    console.log(`auth: ${token}`);
    const body = await context.request.body();
    const data = await body.value;
    console.log(data);
    saveFile(data.base64, data.user);
    context.response.status = 201;
    context.response.body = JSON.stringify(
      {
        data: {
          message: "file uploaded",
        },
      },
    );
  } catch (err) {
    context.response.status = 400;
    context.response.body = JSON.stringify(
      {
        errors: [
          {
            title: "a problem occurred",
            detail: err.message,
          },
        ],
      },
    );
  }
});

router.get("/(.*)", async (context) => {
  // 	const data = await Deno.readTextFile('static/404.html')
  // 	context.response.body = data
  const data = await Deno.readTextFile("spa/index.html");
  context.response.body = data;
});

export default router;
