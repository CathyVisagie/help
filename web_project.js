const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 5000;
const items = require("./items.json");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "frontend/src")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "src", "index.html"));
	});
}
// base function - does nothing but greet

// utility function - gets person data, and creates the file if it doesn't exist
function getItems() {
	try {
		const content = fs.readFileSync("items.json");
		return JSON.parse(content);
	} catch (e) {
		// file non-existent
		fs.writeFileSync("items.json", "[]");
		return [];
	}
}

function addItems(newGame) {
	let items = getItems();
	console.log(newGame);
	items.push(newGame);
	fs.writeFileSync("items.json", JSON.stringify(items));
}

function deleteItems(id) {
	const items = getItems();
	console.log(items);
	const i = items.indexOf(id);
	items.splice(i, 1);
	fs.writeFileSync("items.json", JSON.stringify(items));
}

// create new person
app.post("/items/", (req, resp) => {
	let items = getItems();

	if (items.length < -1) {
		resp.send("Game already exists");
	} else {
		let newGame = req.body;

		addItems(newGame);
		resp.send("Success, added game");
	}
});

app.put("/items/", (req, resp) => {
	const oldId = req.query.id;
	const items = getItems();
	const i = items.indexOf(oldId);
	if (oldId > 0) {
		let newGame = req.body;
		items[i] = newGame;
		fs.writeFileSync("items.json", JSON.stringify(items));
		resp.send("Success, updated game");
	} else {
		resp.send("Game does not exist");
	}
});

// check whether person exists
app.get("/items", (req, resp) => {
	const title = req.query.title;
	const items = getItems();
	if (items.indexOf(title) > -1) {
		resp.send("Can confirm game exists");
	} else {
		resp.send("Game does not exist");
	}
});

// delete person
app.delete("/items", (req, resp) => {
	const id = req.query.id;
	const items = getItems();
	if (id > 0) {
		deleteItems(id);
		resp.send("Success, deleted game");
	} else {
		resp.send("Game does not exist");
	}
});

app.get("/api", function (req, res) {
	res.sendFile(__dirname + "/api");
	res.json(items);
});

app.listen(port, () => console.log(`Listening engaged on ${port}`));
