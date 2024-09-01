// @ts-nocheck
import React from 'react';
import styled, { useTheme } from 'styled-components';
import Arkadash from '../../assets/final-logo-black.png';
import ArkadashWhite from '../../assets/final-logo-white.png';

import { useOutletContext } from 'react-router-dom';
import * as GiIcons from 'react-icons/gi';
import * as BsIcons from 'react-icons/bs';
import { FaHeart } from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5';

const StyledHeader = styled.div`
	height: 3rem;
	width: 100%;
	border-bottom: 1px solid var(--borders);
	margin-bottom: 1rem;
	display: flex;
	gap: 1rem;
	align-items: center;
`;
const StyledMain = styled.div`
	width: 100%;
`;
const StyledSubHeader = styled.div`
	width: 100%;
	margin-bottom: 0.9rem;
`;
const StyledContent = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;
const StyledStatement2 = styled.div`
	display: flex;
	gap: 1rem;
	padding: 0.5rem 0.7rem 0.5rem 0.7rem;
	font-weight: 100;
	border-radius: 6px;
	line-height: 1.5;
	background: ${({ theme }) => theme.body};
	align-items: center;
	font-size: 0.88rem;
`;
const StyledStatement = styled.div`
	display: flex;
	gap: 1rem;
	padding: 1.1rem;
	font-weight: 100;
	border-radius: 6px;
	line-height: 1.5;
	background: ${({ theme }) => theme.body};
	align-items: center;
	font-size: 0.88rem;
`;
const StyledEmoji = styled.div`
	font-size: 1.5rem;
`;

const StyledLogo = styled.div`
	min-width: 2rem;
	display: flex;
	border-radius: 10px;
	justify-content: ${({ sidebar }) => (sidebar ? '' : 'center')};
	align-items: center;
	gap: 0.5rem;
`;

const page_1 = () => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const props = useOutletContext();
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<StyledHeader>
				<StyledLogo>
					<img
						src={props.isDarkMode === 'light' ? Arkadash : ArkadashWhite}
						alt='logo'
						style={{
							width: '14rem',
							borderRadius: '5.5px',
							marginBottom: '0.5rem',
						}}
					/>
				</StyledLogo>
			</StyledHeader>
			<StyledMain>
				<StyledContent>
					<StyledStatement>
						<StyledEmoji>
							<FaHeart />
						</StyledEmoji>
						Thank you for your unwavering support. You make this possible.
					</StyledStatement>
					<StyledStatement>
						<StyledEmoji>
							<IoSettings />
						</StyledEmoji>
						TwoTensor OS Version 12.3.1 - 14/05/2024 Release
						<br /> Built by the Engineers at TwoTensor.
					</StyledStatement>
				</StyledContent>
			</StyledMain>
		</div>
	);
};

export default page_1;
