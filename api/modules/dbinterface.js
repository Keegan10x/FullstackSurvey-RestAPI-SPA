//DB ORM

import { db } from "./db.js";


export async function getUserId(user){
	const sql = `SELECT id FROM accounts WHERE user='${user}'`
	console.log(sql)
	const result = await db.query(sql)
	return result[0].id
}


export async function saveSurvey(data){
	console.log(data.surveyDescription)
	
	const sql = `INSERT INTO surveys(name, description, usr, created)\
VALUES("${data.surveyName}", '${data.surveyDescription}', ${data.userid}, "${data.created}")`
	console.log(sql)
	await db.query(sql)
}


export async function getMySurveys(userid){
	const sql = `SELECT id, usr, name, description, DATE_FORMAT(created, '%d-%M-%Y') AS created FROM surveys WHERE usr=${userid}`
	const result = await db.query(sql)
	return result
}


export async function addQuestion(questionObj, surveyId, date){
	const sql = `INSERT INTO questions(survey, title, description, created)\
VALUES(${surveyId}, '${questionObj.title}', '${questionObj.description}', '${date}')`
	console.log(sql)
	await db.query(sql)
}


export async function getNumberOfQuestions(surveyid){
	const sql = `SELECT COUNT(*) FROM questions WHERE survey=${surveyid}`
	const result = await db.query(sql)
	//console.log(sql)
	return result.pop()[`COUNT(*)`]
}


export async function getAllFrom(table){
	const sql = `SELECT * FROM ${table}`
	const result = await db.query(sql)
	//console.log(result)
	return result
}


export async function getSurveyQuestions(surveyid){
	const sql = `SELECT id, title, description FROM questions WHERE survey=${surveyid}`
	const result = await db.query(sql)
	result.map(question => question.type = 'question')
	return result
}


export async function addResponse(userid, surveyid, rsp){
	const sql = `INSERT INTO responses(question, usr, survey, response)\
VALUES(${rsp.questionId}, ${userid}, ${surveyid}, ${rsp.response})`
	await db.query(sql)
	console.log(sql)
}


export async function hasUserDone(userid, surveyid){
	const sql = `SELECT response FROM responses WHERE usr=${userid} AND survey=${surveyid}`
	const result = await  db.query(sql)
	if(!result.length) return false
	return true
}


export async function getAverageScore(userid, surveyid){
	const sql = `SELECT AVG(response) 'avg' FROM responses WHERE usr=${userid} AND survey=${surveyid}`
	console.log(sql)
	const result = await db.query(sql)
	return result[0].avg
}