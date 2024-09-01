// @ts-nocheck

import React from 'react';
import * as GiIcons from 'react-icons/gi';
import * as BsiIcons from 'react-icons/bs';
import * as AiIcons from 'react-icons/ai';
import * as MdIcons from 'react-icons/md';
import styled from 'styled-components';
import Arkadash from '../../assets/final-logo-black.png';
import ArkadashWhite from '../../assets/final-logo-white.png';
import { useOutletContext } from 'react-router-dom';

const StyledHeader = styled.div`
	height: 3rem;
	width: 100%;
	border-bottom: 1px solid var(--borders);
	margin-bottom: 1rem;
	display: flex;
	gap: 0.5rem;
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
	align-items: center;
	gap: 1rem;
`;
const StyledLogo = styled.div`
	min-width: 2rem;
	display: flex;
	border-radius: 10px;
	justify-content: ${({ sidebar }) => (sidebar ? '' : 'center')};
	align-items: center;
	gap: 0.5rem;
`;
const StyledStatement = styled.div`
	display: flex;
	gap: 1rem;
	padding: 1.1rem;
	font-weight: 100;
	border-radius: 6px;
	background: ${({ theme }) => theme.body};
	align-items: center;
	font-size: 0.88rem;
`;
const StyledEmoji = styled.div`
	font-size: 1.6rem;
`;

const page_3 = () => {
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
				<StyledSubHeader>
					<b>New: Source Report</b>
				</StyledSubHeader>
				<StyledContent>
					<StyledStatement>
						<StyledEmoji>
							<GiIcons.GiScrollQuill />
						</StyledEmoji>
						Gain an edge in the market by tracking real-time intent signals from
						chosen venture funds. Anticipate market shifts by monitoring
						incoming deals for a specific fund. Eliminate informational
						disparities in deal flow to achieve competitive parity.
					</StyledStatement>
				</StyledContent>
			</StyledMain>
		</div>
	);
};

export default page_3;
