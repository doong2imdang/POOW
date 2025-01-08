import React, { useEffect, useState } from "react";
import styled from "styled-components";
import iconEdit from "../assets/images/icon-edit.svg";
import iconDelete from "../assets/images/icon-delete.svg";
import iconCrystalBall from "../assets/images/icon-fill-crystalball.svg";
import iconWeather from "../assets/images/icon-fill-weather.svg";
import iconChecklist from "../assets/images/icon-fill-checklist.svg";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Container = styled.div`
	margin: 20px 0 0 0;
	width: 355px;
	height: 230px;
	border: 1px var(--color-disabled) solid;
	border-radius: 10px;
	padding: 7px 10px 17px 14px;
	color: var(--color-dark);
`;

const ButtonWrap = styled.div`
	display: flex;
	justify-content: flex-end;
`;

const Button = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	display: flex;
	width: 22px;
	height: 22px;
`;

const Icon = styled.img`
	width: 22px;
	height: 22px;
	margin-left: 5px;
`;

const Date = styled.h4`
	font-weight: 700;
	font-size: 14px;
	margin-bottom: 11px;
`;

const ScheduleWrap = styled.div`
	width: 100%;
	height: 162px;
	display: flex;

	img {
		width: 120px;
		height: 100%;
	}
`;

const RightPart = styled.div`
	display: flex;
	flex-direction: column;
`;

const ScheduleInfo = styled.div`
	width: 197px;
	height: 95px;
	margin: 4px 0 17px 10px;
	font-size: 10px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const ScheduleDetail = styled.div`
	display: flex;
	justify-content: space-between;

	h4 {
		width: 40px;
	}
	p {
		width: 140px;
	}
`;

const ContentsWrap = styled.div`
	width: 178px;
	height: 46px;
	margin-left: 21px;
	display: flex;
	justify-content: space-between;
`;

const BtnContents = styled.button`
	width: 46px;
	height: 46px;

	img {
		width: 46px;
		height: 46px;
	}
`;

const SchedulePost: React.FC = () => {
	const [schedules, setSchedules] = useState<any[]>([]); // 상태 초기화
	const userId = useSelector((state: RootState) => state.auth.uid);

	useEffect(() => {
		const fetchSchedules = async () => {
			if (!userId) {
				console.error("사용자 ID가 없습니다."); // 사용자 ID가 없을 경우 처리
				return;
			}

			const schedulesRef = collection(db, "user", userId, "schedules");
			const scheduleSnapshot = await getDocs(schedulesRef);
			const scheduleList = scheduleSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setSchedules(scheduleList);
		};

		fetchSchedules();
	}, [userId]);

	return (
		<>
			{schedules.map((schedule) => (
				<Container key={schedule.id}>
					<ButtonWrap>
						<Button>
							<Icon src={iconEdit} alt="Edit" />
						</Button>
						<Button>
							<Icon src={iconDelete} alt="Delete" />
						</Button>
					</ButtonWrap>
					<Date>{schedule.prfpdto}</Date>
					<ScheduleWrap>
						<img src={schedule.poster} alt={schedule.prfnm} />
						<RightPart>
							<ScheduleInfo>
								<ScheduleDetail>
									<h4>장소</h4>
									<p>{schedule.fcltynm}</p>
								</ScheduleDetail>
								<ScheduleDetail>
									<h4>관람명</h4>
									<p>{schedule.prfnm}</p>
								</ScheduleDetail>
								<ScheduleDetail>
									<h4>관람시간</h4>
									<p>
										{schedule.dtguidance} / {schedule.prfruntime}
									</p>
								</ScheduleDetail>
								<ScheduleDetail>
									<h4>출연진</h4>
									<p>{schedule.prfcast}</p>
								</ScheduleDetail>
							</ScheduleInfo>
							<ContentsWrap>
								<BtnContents>
									<img src={iconCrystalBall} alt="CrystalBall" />
								</BtnContents>
								<BtnContents>
									<img src={iconWeather} alt="Weather" />
								</BtnContents>
								<BtnContents>
									<img src={iconChecklist} alt="Checklist" />
								</BtnContents>
							</ContentsWrap>
						</RightPart>
					</ScheduleWrap>
				</Container>
			))}
		</>
	);
};

export default SchedulePost;
