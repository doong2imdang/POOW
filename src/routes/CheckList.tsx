import React, { useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import iconCheckListFill from "../assets/images/icon-checkbox-fill.svg";
import iconCheck from "../assets/images/icon-checkbox.svg";

interface Item {
	id: number;
	label: string;
	isChecked: boolean;
}

const initialItems: Item[] = [
	{ id: 1, label: "슬로건", isChecked: false },
	{ id: 2, label: "응원봉", isChecked: false },
	{ id: 3, label: "민증", isChecked: false },
];

const CheckList: React.FC = () => {
	const [isBottomSheet, setIsBottomSheet] = useState<boolean>(false);
	const [items, setItems] = useState<Item[]>(initialItems);

	const toggleBottomSheet = () => {
		setIsBottomSheet((prev) => !prev);
	};

	const handleCheck = (id: number) => {
		setItems((prevItems) =>
			prevItems.map((item) =>
				item.id === id ? { ...item, isChecked: !item.isChecked } : item
			)
		);
	};

	return (
		<>
			<Header
				text
				bottomSheetText="생성, 체크리스트 선택"
				isBottomSheet={isBottomSheet}
				toggleBottomSheet={toggleBottomSheet}
			/>
			<Main>
				<CheckListContent>
					<strong>어울림 누리 개관 20주년 기념 스페셜 콘서트 VOL.2</strong>
					<ul>
						{items.map(({ id, label, isChecked }) => (
							<li key={id} onClick={() => handleCheck(id)}>
								<img
									src={isChecked ? iconCheckListFill : iconCheck}
									alt="체크박스 아이콘"
								/>
								<input
									type="checkbox"
									id={`list-${id}`}
									checked={isChecked}
									readOnly
								/>
								<label htmlFor={`list-${id}`}>{label}</label>
							</li>
						))}
					</ul>
				</CheckListContent>
			</Main>
		</>
	);
};

const Main = styled.main`
	padding: 21px 31px;
	color: var(--color-dark);
	background: #fff6ff;
	height: calc(100vh - 60px);
`;

const CheckListContent = styled.div`
	strong {
		font-size: 12px;
	}

	& > ul {
		width: 336px;
		min-height: 60px;
		background: #fff;
		margin: 6px 0 18px 0;
		border-radius: 10px;
		padding: 12px 13px 4px 13px;

		> li {
			display: flex;
			align-items: center;
			gap: 6px;
			margin-bottom: 8px;

			input[type="checkbox"] {
				display: none;
			}

			label {
				font-size: 10px;
			}

			img {
				width: 10px;
				height: 10px;
			}
		}
	}
`;

export default CheckList;
