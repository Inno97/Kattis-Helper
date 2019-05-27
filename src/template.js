import "./css/default.scss";
import "./css/index.scss";

import Axios from "axios";
import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en');

//render all the questions from questions.json

function onload(){
	console.log("loaded template.html");
}
window.addEventListener("load", onload);
