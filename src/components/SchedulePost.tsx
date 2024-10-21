import React from "react";
import styled from "styled-components";
import iconEdit from "../assets/images/icon-edit.svg";
import iconDelete from "../assets/images/icon-delete.svg";
import iconCrystalBall from "../assets/images/icon-fill-crystalball.svg";
import iconWeather from "../assets/images/icon-fill-weather.svg";
import iconChecklist from "../assets/images/icon-fill-checklist.svg";

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
				<RightPart>
					<ScheduleInfo>
						<ScheduleDetail>
							<h4>장소</h4>
							<p>고양어울림누리 어울림극장</p>
						</ScheduleDetail>
						<ScheduleDetail>
							<h4>관람명</h4>
							<p>어울림누리 개관 20주년 기념 스페셜 콘서트 VOL.2</p>
						</ScheduleDetail>
						<ScheduleDetail>
							<h4>관람시간</h4>
							<p>17:00 / 120분</p>
						</ScheduleDetail>
						<ScheduleDetail>
							<h4>출연진</h4>
							<p>나상현씨밴드, PL, 다린, 최인경</p>
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
	);
};

export default SchedulePost;
