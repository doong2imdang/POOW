import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import iconHome from "../assets/images/icon-home.svg";
import iconHomeFill from "../assets/images/icon-home-fill.svg";
import iconChecklist from "../assets/images/icon-checklist.svg";
import iconChecklistFill from "../assets/images/icon-checklist-fill.svg";
import iconHeart from "../assets/images/icon-heart.svg";
import iconSchedule from "../assets/images/icon-schedule.svg";
import iconScheduleFill from "../assets/images/icon-schedule-fill.svg";
import iconUser from "../assets/images/icon-user.svg";
import iconUserFill from "../assets/images/icon-user-fill.svg";

const NavbarStyle = styled.nav`
	display: flex;
	width: 390px;
	height: 60px;
	justify-content: space-around;
	align-items: center;
	font-size: 10px;
	position: fixed;
	bottom: 0;
	background-color: #fff;
`;

interface NavItemProps {
	$active: boolean;
	$homeActive: boolean;
}

const NavItem = styled.div<NavItemProps & { id: string }>`
	display: flex;
	flex-direction: column;
	align-items: center;
	cursor: pointer;
	position: relative;
	z-index: 1;

	img {
		width: 24px;
		height: 24px;
	}

	span {
		margin-top: 4px;
		color: ${({ $active }) =>
			$active ? "var(--color-main)" : "var(--color-dark)"};
	}

	&::before {
		content: "";
		position: absolute;
		width: ${({ $homeActive, id }) =>
			$homeActive ? "56px" : id === "heart" ? "72px" : "0"};
		height: ${({ $homeActive, id }) =>
			$homeActive ? "56px" : id === "heart" ? "72px" : "0"};
		background-color: var(--color-bg);
		border-radius: 50%;
		top: ${({ $homeActive }) => ($homeActive ? "50%" : "31%")};
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: -1;
		transition: width 0.5s ease, height 0.5s ease;
		visibility: ${({ id }) => (id === "heart" ? "visible" : "hidden")};
	}
`;

interface Icon {
	id: string;
	icon: string;
	iconFill: string;
	label: string;
	path: string;
}

const icons: Icon[] = [
	{
		id: "home",
		icon: iconHome,
		iconFill: iconHomeFill,
		label: "홈",
		path: "/",
	},
	{
		id: "checklist",
		icon: iconChecklist,
		iconFill: iconChecklistFill,
		label: "체크리스트",
		path: "/checklist",
	},
	{
		id: "heart",
		icon: iconHeart,
		iconFill: iconHeart,
		label: "mood",
		path: "/setmood",
	},
	{
		id: "schedule",
		icon: iconSchedule,
		iconFill: iconScheduleFill,
		label: "일정",
		path: "/schedule",
	},
	{
		id: "user",
		icon: iconUser,
		iconFill: iconUserFill,
		label: "프로필",
		path: "/profile",
	},
];

const NavBar: React.FC = () => {
	const location = useLocation();
	const [activeId, setActiveId] = useState<string>("home");

	useEffect(() => {
		const currentPath = location.pathname;
		const activeIcon = icons.find((icon) => icon.path === currentPath);
		if (activeIcon) {
			setActiveId(activeIcon.id);
		}
	}, [location.pathname]);

	return (
		<NavbarStyle>
			{icons.map(({ id, icon, iconFill, label, path }) => (
				<Link to={path} key={id} style={{ textDecoration: "none" }}>
					<NavItem
						id={id}
						$active={activeId === id}
						$homeActive={activeId === "home"}
						onClick={() => setActiveId(id)}
					>
						<img src={activeId === id ? iconFill : icon} alt={label} />
						<span>{label}</span>
					</NavItem>
				</Link>
			))}
		</NavbarStyle>
	);
};

export default NavBar;
