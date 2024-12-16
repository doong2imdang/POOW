const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = 5000;
app.use(cors());

app.get("/api/kopis", async (req, res) => {
	const apiKey = process.env.REACT_APP_API_KEY;
	const todayDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
	const todayDatePlus31 = new Date();
	todayDatePlus31.setDate(todayDatePlus31.getDate() + 31);
	const formattedDatePlus31 = todayDatePlus31
		.toISOString()
		.slice(0, 10)
		.replace(/-/g, "");

	const searchQuery = req.query.shprfnm || "";
	const apiUrl = `http://www.kopis.or.kr/openApi/restful/pblprfr?service=${apiKey}&stdate=${todayDate}&eddate=${formattedDatePlus31}&cpage=1&rows=50&prfstate=01&prfstate=02&shprfnm=${encodeURIComponent(
		searchQuery
	)}`;

	try {
		const response = await axios.get(apiUrl);
		const parser = new xml2js.Parser();
		parser.parseString(response.data, (err, result) => {
			if (err) {
				console.error("XML 파싱 오류:", err);
				return res.status(500).send("Error parsing XML");
			}
			console.log("응답데이터:", result);
			res.json(result);
		});
	} catch (error) {
		console.error("데이터 가져오기 오류:", error);
		res.status(500).send("Error fetching data");
	}
});

app.get("/api/kopis/by-id/:mt20id", async (req, res) => {
	const apiKey = process.env.REACT_APP_API_KEY;
	const mt20id = req.params.mt20id;
	const apiUrl = `http://www.kopis.or.kr/openApi/restful/pblprfr/${mt20id}?service=${apiKey}`;
	try {
		const response = await axios.get(apiUrl);
		const parser = new xml2js.Parser();
		parser.parseString(response.data, (err, result) => {
			if (err) {
				console.error("XML 파싱 오류:", err);
				return res.status(500).send("Error parsing XML");
			}
			res.json(result);
		});
	} catch (error) {
		console.error("데이터 가져오기 오류:", error);
		res.status(500).send("Error fetching data");
	}
});

// 서버 시작
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
