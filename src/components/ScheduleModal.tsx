import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ScheduleData } from "../routes/SetSchedule";

interface ScheduleModalProps {
	onClose: () => void;
	scheduleData: ScheduleData[];
	apiUrl: string;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ onClose, apiUrl }) => {
	const [scheduleData, setScheduleData] = useState<ScheduleData[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(apiUrl);
				const data = await response.json();

				if (data && data.dbs && Array.isArray(data.dbs.db)) {
					setScheduleData(data.dbs.db);
				} else {
					setScheduleData([]);
				}
			} catch (error) {
				console.error("오류:", error);
				setScheduleData([]);
			}
		};

		fetchData();
	}, []);

	return (
		<ModalOverlay onClick={onClose}>
			<Container onClick={(e) => e.stopPropagation()}>
				{scheduleData.length === 0 ? (
					<NoResultMessage>일치하는 공연이 없습니다.</NoResultMessage>
				) : (
					scheduleData.map((schedule, index) => (
						<ScheduleList key={index}>
							<img src={schedule.poster[0]} alt={schedule.prfnm[0]} />
							<ScheduleInfo>
								<ScheduleName>{schedule.prfnm[0]}</ScheduleName>
								<ScheduleHall>{schedule.fcltynm[0]}</ScheduleHall>
								<ScheduleDate>{schedule.prfpdfrom[0]}</ScheduleDate>
							</ScheduleInfo>
						</ScheduleList>
					))
				)}
			</Container>
		</ModalOverlay>
	);
};

const ModalOverlay = styled.div`
	display: flex;
	width: 390px;
	height: 100%;
	overflow-y: auto;
	padding: 20px 39px 0 29px;
	font-size: 14px;
	background-color: rgba(0, 0, 0, 0.5);
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	margin: 0 auto;
	z-index: 3;
`;

const Container = styled.div`
	background-color: white;
	width: 348px;
	height: 544px;
	margin: 113px auto;
	border-radius: 10px;
	padding: 17px 20px;
	overflow-y: auto;
	scrollbar-width: none;
	z-index: 100;
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
`;

const ScheduleInfo = styled.div`
	display: flex;
	flex-direction: column;
`;

const ScheduleList = styled.div`
	display: flex;
	border-bottom: 1px solid var(--color-disabled);

	img {
		width: 104px;
		height: 140px;
		margin: 17px 14px 17px 0%;
	}
`;

const ScheduleName = styled.h4`
	font-size: 12px;
	font-weight: 600;
	margin-top: 34px;
	margin-bottom: 14px;
	color: var(--color-dark);
`;

const ScheduleHall = styled.p`
	font-size: 11px;
	color: var(--color-dark);
	margin-bottom: 7px;
`;

const ScheduleDate = styled.p`
	font-size: 10px;
	color: var(--color-disabled);
`;

const NoResultMessage = styled.p`
	text-align: center;
	color: var(--color-dark);
	font-size: 14px;
	margin-top: 50px;
`;

export default ScheduleModal;
