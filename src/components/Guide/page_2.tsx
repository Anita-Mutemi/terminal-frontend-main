// @ts-nocheck

import React from 'react';
import styled from 'styled-components';
import * as GiIcons from 'react-icons/gi';
import * as AiIcons from 'react-icons/ai';
import Arkadash from '../../assets/final-logo-black.png';
import ArkadashWhite from '../../assets/final-logo-white.png';
import { useOutletContext } from 'react-router-dom';
import { VscSourceControl } from 'react-icons/vsc';

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

const page_2 = () => {
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
					<b>New: Data Sources</b>
				</StyledSubHeader>
				<StyledContent>
					<StyledStatement>
						<StyledEmoji>
							<VscSourceControl />
						</StyledEmoji>
						Gain insights into venture funds' deal-flow activities, track their
						performance against benchmarks, and identify strategic advantages
						and market trends.
					</StyledStatement>
				</StyledContent>
			</StyledMain>
		</div>
	);
};

export default page_2;
