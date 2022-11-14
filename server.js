const express = require("express")
const { initializeApp } =  require("firebase/app");
const { getDatabase, ref, child, get, update } =  require("firebase/database");

const app = express()
const bodyParser = require("body-parser");
const cors = require("cors")

app.use(cors({
	origin: "*",
	credentials: true,
	optionSuccessStatus: 200
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const firebaseConfig = {
	apiKey: "AIzaSyCIPnycnppmhjS9E5EK2kLPVQ0xqdpSH0M",
	authDomain: "bpoints-web.firebaseapp.com",
	databaseURL: "https://bpoints-web-default-rtdb.firebaseio.com",
	projectId: "bpoints-web",
	storageBucket: "bpoints-web.appspot.com",
	messagingSenderId: "292695892145",
	appId: "1:292695892145:web:05fff733b0694d2bc28290"
};

// Initialize Firebase
const fb = initializeApp(firebaseConfig);

const dbRef = ref(getDatabase());

app.get("/", (req, res) => {
	res.redirect("https://points.avner.sg")
})

app.get("/users/:name/data", (req, res) => {
	get(child(dbRef, `users/${req.params.name}`)).then((snapshot) => {
		if (snapshot.exists()) {
			res.json(snapshot.val())
		} else {
			console.log("No data available");
		}
	}).catch((error) => {
		console.error(error);
	});
})

app.post("/users/:name/add-points/", (req, res) => {
	get(child(dbRef, `users/${req.params.name}`)).then((snapshot) => {
		if (snapshot.exists()) {
			let points = parseInt(snapshot.val().points)
			points += parseInt(req.body.add)
			
			update(ref(getDatabase(), `users/${req.params.name}`), {
				points: points
			})
			
			res.sendStatus(200)
		} else {
			res.sendStatus(400)
		}
	}).catch((error) => {
		console.error(error);
	});
})

app.post("/users/:name/deduct-points/", (req, res) => {
	get(child(dbRef, `users/${req.params.name}`)).then((snapshot) => {
		if (snapshot.exists()) {
			let points = parseInt(snapshot.val().points)
			points -= parseInt(req.body.deduct)
			
			res.send("Not Enough Points")
			update(ref(getDatabase(), `users/${req.params.name}`), {
				points: points
			})
			res.sendStatus(200)
		} else {
			res.sendStatus(400)
		}
	}).catch((error) => {
		console.error(error);
	});
})

app.post("/login", (req, res) => {
    const name = req.body.name
    get(child(dbRef, `users/${name}`)).then((snapshot) => {
		if (snapshot.exists()) {
			res.sendStatus(200)
		} else {
			res.sendStatus(400)
		}
	}).catch((error) => {
		console.error(error);
	});
})

app.listen(3000)