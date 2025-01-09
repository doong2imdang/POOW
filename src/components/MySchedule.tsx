import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function MySchedule() {
	const [schedules, setSchedules] = useState<any[]>([]);
	const userId = useSelector((state: RootState) => state.auth.uid);

	useEffect(() => {
		const fetchSchedules = async () => {
			if (!userId) {
				console.error("사용자 ID가 없습니다.");
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
		<MyScheduleStyle>
			<h2>일정</h2>
			<ScheduleList>
				{schedules.map((schedule) => (
					<li key={schedule.id}>
						<img src={schedule.poster} alt="일정사진" />
						<p>{schedule.prfnm}</p>
						<span>{formatDate(schedule.prfpdto)}</span>
					</li>
				))}
			</ScheduleList>
		</MyScheduleStyle>
	);
}

const formatDate = (dateString: string): string => {
	const [yearStr, monthStr, dayStr] = dateString.split("-");
	const year: number = Number(yearStr);
	const month: number = Number(monthStr) - 1;
	const day: number = Number(dayStr);

	const date = new globalThis.Date(year, month, day);
	const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
	const weekday = weekdays[date.getDay()];

	return `${year}. ${monthStr.padStart(2, "0")}. ${dayStr.padStart(
		2,
		"0"
	)} (${weekday})`;
};

const MyScheduleStyle = styled.div`
	background: #fff;
	padding: 19px 16px 0 16px;

	h2 {
		font-size: 16px;
		color: #000;
		font-weight: bold;
		padding-bottom: 9px;
	}
`;

const ScheduleList = styled.ul`
	display: flex;
	gap: 12px;
	width: 100%;
	overflow-x: scroll;

	&::-webkit-scrollbar {
		background-color: #fff;
	}

	&::-webkit-scrollbar-thumb {
		background-color: var(--color-disabled);
		height: 13px;
		border: 4px solid #fff;
		border-radius: 10px;
		cursor: pointer;
	}

	li {
		width: 87px;
		height: auto;
		border: 1px solid var(--color-disabled);
		border-radius: 5px;
		padding: 5px;
		margin-bottom: 9px;

		img {
			width: 77px;
			height: 106px;
			border-radius: 5px;
			display: block;
			overflow: hidden;
			border: 1px solid var(--color-disabled);
		}

		p {
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
			font-size: 10px;
			color: var(--color-dark);
			font-weight: bold;
			padding-top: 4px;
		}

		span {
			font-size: 8px;
			color: var(--color-main);
			display: block;
			padding-top: 3px;
			font-weight: bold;
		}
	}
`;
