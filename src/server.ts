import express, { Request, Response } from "express";
import axios from "axios";
import xml2js from "xml2js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/kopis", async (req: Request, res: Response) => {
	const apiKey: string = process.env.REACT_APP_API_KEY || "";
	const todayDate: string = new Date()
		.toISOString()
		.slice(0, 10)
		.replace(/-/g, "");
	const searchQuery: string = (req.query.shprfnm as string) || "";

	const apiUrl: string = `http://www.kopis.or.kr/openApi/restful/pblprfr?service=${apiKey}&stdate=${todayDate}&cpage=1&rows=50&prfstate=01&prfstate=02&shprfnm=${encodeURIComponent(
		searchQuery
	)}`;

	try {
		const response = await axios.get(apiUrl);
		const parser = new xml2js.Parser();
		parser.parseString(response.data, (err: Error | null, result: any) => {
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

app.get("/api/kopis/by-id/:mt20id", async (req: Request, res: Response) => {
	const apiKey: string = process.env.REACT_APP_API_KEY || "";
	const mt20id: string = req.params.mt20id;

	const apiUrl: string = `http://www.kopis.or.kr/openApi/restful/pblprfr/${mt20id}?service=${apiKey}`;

	try {
		const response = await axios.get(apiUrl);
		const parser = new xml2js.Parser();
		parser.parseString(response.data, (err: Error | null, result: any) => {
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
