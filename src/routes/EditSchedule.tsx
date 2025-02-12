import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import styled from "styled-components";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export interface ScheduleData {
	prfnm: string;
	prfpdto: string;
	dtguidance: string;
	fcltynm: string;
	prfcast: string;
	poster: string;
}

const EditSchedule: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const userId = useSelector((state: RootState) => state.auth.uid);
	const scheduleId = location.state?.id;

	const [formData, setFormData] = useState<ScheduleData>({
		prfnm: "",
		prfpdto: "",
		dtguidance: "",
		fcltynm: "",
		prfcast: "",
		poster: "",
	});

	useEffect(() => {
		const fetchSchedule = async () => {
			if (!userId) {
				console.error("사용자 ID가 없습니다.");
				return;
			}

			const scheduleRef = doc(db, "user", userId, "schedules", scheduleId);
			const scheduleSnap = await getDoc(scheduleRef);
			if (scheduleSnap.exists()) {
				const data = scheduleSnap.data() as ScheduleData;
				setFormData(data);
			} else {
				console.log("No such document!");
			}
		};

		fetchSchedule();
	}, [userId, scheduleId]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSave = async () => {
		if (!userId) {
			alert("사용자 ID가 없습니다. 수정할 수 없습니다.");
			return;
		}

		const scheduleRef = doc(db, "user", userId, "schedules", scheduleId);
		await updateDoc(scheduleRef, {
			prfnm: formData.prfnm,
			prfpdto: formData.prfpdto,
			dtguidance: formData.dtguidance,
			fcltynm: formData.fcltynm,
			prfcast: formData.prfcast,
			poster: formData.poster,
		});
		alert("일정이 수정되었습니다.");
		navigate("/schedule");
	};

	return (
		<>
			<Header set={true} buttonDisabled={false} onSave={handleSave} />{" "}
			<EditScheduleContainer>
				<Section>
					<Label htmlFor="name">관람명</Label>
					<Input
						type="text"
						id="name"
						name="prfnm"
						value={formData.prfnm}
						onChange={handleInputChange}
						required
					/>
				</Section>
				<Section>
					<Label htmlFor="image">이미지</Label>
					<Image
						style={{
							backgroundImage: `url(${formData.poster})`,
						}}
					></Image>
				</Section>
				<Section>
					<Label htmlFor="location">장소</Label>
					<Input
						type="text"
						id="location"
						name="fcltynm"
						value={formData.fcltynm}
						onChange={handleInputChange}
						required
					/>
				</Section>
				<Section>
					<Label htmlFor="date">관람날짜</Label>
					<Input
						type="date"
						id="date"
						name="prfpdto"
						value={formData.prfpdto}
						onChange={handleInputChange}
						required
					/>
				</Section>
				<Section>
					<Label htmlFor="time">관람시간</Label>
					<Input
						type="text"
						id="time"
						name="dtguidance"
						value={formData.dtguidance}
						onChange={handleInputChange}
						required
					/>
				</Section>
				<Section>
					<Label htmlFor="cast">출연진</Label>
					<Input
						type="text"
						id="cast"
						name="prfcast"
						value={formData.prfcast}
						onChange={handleInputChange}
						required
					/>
				</Section>
			</EditScheduleContainer>
		</>
	);
};

const EditScheduleContainer = styled.div`
	display: flex;
	height: calc(100vh - 108px);
	overflow-y: auto;
	padding: 20px 39px 0 29px;
	font-size: 14px;
	flex-direction: column;
`;

const Section = styled.div`
	display: flex;
	width: 100%;
	margin-bottom: 19px;
	align-items: flex-start;
	position: relative;
`;

const Label = styled.label`
	width: 70px;
	display: flex;
	align-items: center;
`;

const Input = styled.input`
	position: relative;
	border: none;
	border-bottom: 1px solid var(--color-disabled);
	width: 250px;
	padding: 0 0 5px 0;
	font-size: 14px;

	&#date {
		font: inherit;
	}
`;

const Image = styled.div`
	width: 250px;
	height: 360px;
	background-color: #f2f2f2;
	border-radius: 10px;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
`;

export default EditSchedule;
