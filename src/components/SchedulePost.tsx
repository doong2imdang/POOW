import React from "react";
import styled from "styled-components";
import iconEdit from "../assets/images/icon-edit.svg";
import iconDelete from "../assets/images/icon-delete.svg";

const Container = styled.div`
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
const ScheduleInfo = styled.div`
	width: 197px;
	height: 95px;
	margin: 4px 0 17px 10px;
	border: 1px solid black;
`;

const ModalWrap = styled.div`
	width: 178px;
	height: 46px;
	margin-left: 21px;
`;

const SchedulePost: React.FC = () => {
	return (
		<Container>
			<ButtonWrap>
				<Button>
					<Icon src={iconEdit} alt="Edit" />
				</Button>
				<Button>
					<Icon src={iconDelete} alt="Delete" />
				</Button>
			</ButtonWrap>
			<Date>2024. 10. 13. 일</Date>
			<ScheduleWrap>
				<img src="" alt="" />
				<ScheduleInfo></ScheduleInfo>
			</ScheduleWrap>
		</Container>
	);
};

export default SchedulePost;
