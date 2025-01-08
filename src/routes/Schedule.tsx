import React from "react";
import Header from "../components/Header";
import SchedulePost from "../components/SchedulePost";
import styled from "styled-components";

const ScheduleContainer = styled.div`
	display: flex;
	height: calc(100vh - 108px);
	max-height: calc(100vh - 108px);
	flex-direction: column;
	align-items: center;
	overflow-y: auto;
	padding-bottom: 20px;

	&::-webkit-scrollbar {
		width: 7px;
		display: none;
	}

	&::-webkit-scrollbar-thumb {
		background-color: var(--color-disabled);
		border-radius: 10px;
		height: 30%;
	}
`;

const Schedule: React.FC = () => {
	return (
		<>
			<Header text />
			<ScheduleContainer>
				<SchedulePost />
			</ScheduleContainer>
		</>
	);
};

export default Schedule;
