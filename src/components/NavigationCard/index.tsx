// @ts-nocheck

import React from 'react';
import styled from 'styled-components';
import { useOutletContext } from 'react-router-dom';
import { BsStars } from 'react-icons/bs';

const StyledCard = styled.div`
	width: 100%;
	height: 8rem;
	min-height: 5rem;
	border-radius: 5.5px;
	background-color: ${({ theme }) => theme.background};
	display: flex;
	align-items: center;
	overflow: hidden;
`;
const StyledContainer = styled.div`
	display: flex;
	gap: 2rem;
	padding: 2rem;
	width: 100%;
	position: relative;
	display: flex;
`;

const StyledWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
`;

const SvgWrapper = styled.div`
	position: absolute;
	width: 14rem;
	height: 9rem;
	right: 20rem;
	bottom: 2rem;
	transform: scale(0.95) rotate(-45deg);
`;
interface NavigationCardInterface {
	showResurfacing: boolean;
	name?: string;
	description?: string;
}
const NavigationCard = ({
	name,
	description,
	showResurfacing,
	prefix = 'NEW',
}: NavigationCardInterface) => {
	const title = name
		? name
		: showResurfacing
		? 'Resurfacing Signals'
		: 'Strategic Deal Flow';

	const text = description
		? description
		: showResurfacing
		? 'Discover previously interacted projects, rated great or good by you or your team, that have recently sparked the interest of investment funds.'
		: 'Reimagine New and Passed Deals with Real-Time Intel on Expert Investment Funds and Corporate Power Brokers';
	const end = new Date();
	end.setUTCHours(23, 59, 59, 999);
	const props = useOutletContext();
	return (
		<StyledCard mode={props.isDarkMode}>
			<StyledContainer>
				<StyledWrapper>
					<h1 style={{ fontSize: '2em', fontWeight: '400' }}>
						{title}{' '}
						{showResurfacing && (
							<span
								style={{
									color: '#1cc6a4',
									fontSize: '11px',
									position: 'absolute',
									top: '1.85rem',
								}}>
								{prefix === 'AI' ? (
									<BsStars
										style={{ paddingLeft: '0.24rem', fontSize: '16px' }}
									/>
								) : (
									prefix
								)}
							</span>
						)}
					</h1>
					<p>{text}</p>
				</StyledWrapper>

				<SvgWrapper></SvgWrapper>
			</StyledContainer>
		</StyledCard>
	);
};

export default NavigationCard;
