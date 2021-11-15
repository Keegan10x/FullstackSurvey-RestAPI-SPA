import { db } from "./db.js";

export async function getUserId(user){
	const sql = `SELECT id FROM accounts WHERE user='${user}'`
	console.log(sql)
	const result = await db.query(sql)
	return result[0].id
}

export async function saveSurvey(data){
	const sql = `INSERT INTO surveys(name, description, usr, created)\
VALUES('${data.surveyName}', '${data.surveyDescription}', ${data.userid}, '${data.created}')`
	console.log(sql)
	await db.query(sql)
}


export async function getSurveys(){
	const sql = `SELECT id, usr, name, description, DATE_FORMAT(created, '%d-%M-%Y') AS created FROM surveys`
	const result = await db.query(sql)
	return result
}