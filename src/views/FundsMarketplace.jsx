import React from 'react';
import VentureFundCard from '../components/FundCard';
import NavigationCard from '../components/NavigationCard';
import { useTheme } from 'styled-components';
import { Oval } from 'react-loader-spinner';
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import axios from 'axios';
import { useSelector } from 'react-redux';
export const useFetchFunds = (query, debounceTime = 300) => {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const { access_token } = useSelector((state) => state.user);
	// const debouncedQuery = useDebounce(query, debounceTime);
	const [allFunds, setAllFunds] = useState([]);

	const fetchData = async () => {
		const config = {
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
		};

		try {
			// Initiate loading state for user-specific funds
			setIsLoading(true);
			const userFundsResponse = await axios.get(`/v1/user/funds`, config);
			let userFundsData = userFundsResponse.data;

			// Mark each user fund as available by default
			userFundsData = userFundsData.map((fund) => ({
				...fund,
				available: true, // Assuming you want to mark these as available
			}));

			// Update the UI with user funds and mark them as available
			setData(userFundsData);
			// Stop loading indication for user funds
			// setIsLoading(false);

			// Continue to fetch all published funds without affecting loading state
			const offset = 0;
			const limit = 100;
			const allFundsResponse = await axios.get(
				`/v1/fund/published?offset=${offset}&limit=${limit}`,
				config,
			);
			let allFundsData = allFundsResponse.data;

			// For each fund in allFundsData, check if it's also in userFundsData and mark as available accordingly
			allFundsData = allFundsData
				.map((fund) => ({
					...fund,
					available: userFundsData.some(
						(userFund) => userFund.uuid === fund.uuid,
					),
				}))
				.sort((a, b) => b.available - a.available);

			// Combine user funds with all funds, ensuring no duplicates and keeping the 'available' status
			const combinedData = [
				...userFundsData,
				...allFundsData.filter(
					(fund) =>
						!userFundsData.some((userFund) => userFund.uuid === fund.uuid),
				),
			];

			// Finally, update the UI with the complete set of funds including the 'available' status
			setData(combinedData);
			setAllFunds(combinedData); // Update allFunds if needed
		} catch (err) {
			setError(err);
			console.error('Error fetching data:', err);
		} finally {
			setIsLoading(false);
			// No need to set isLoading to false here as it's already done after loading user funds
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return { data, isLoading, error, setData };
};

// Custom debounce hook
function useDebounce(value, delay) {
	const [debouncedValue, setDebouncedValue] = useState(value);
	const timerRef = useRef(null);

	useEffect(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}

		timerRef.current = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(timerRef.current);
		};
	}, [value, delay]);

	return debouncedValue;
}

const MarketPlace = () => {
	const theme = useTheme();

	const [searchQuery, setSearchQuery] = useState('');
	const { data, isLoading, error, setData } = useFetchFunds(searchQuery);
	const [filteredData, setFilteredData] = useState([]); // New state for filtered data
	const { access_token } = useSelector((state) => state.user);

	useEffect(() => {
		// Filter data based on searchQuery and update filteredData
		const newFilteredData = data.filter((fund) =>
			fund.name.toLowerCase().includes(searchQuery.toLowerCase()),
		);
		setFilteredData(newFilteredData);
	}, [searchQuery, data]);

	if (error) {
		return <p>Error: {error.message}</p>;
	}

	return (
		<div
			style={{
				padding: '1.5rem',
				display: 'flex',
				flexDirection: 'column',
				gap: '1rem',
				background: theme.body,
				height: '100%',
				overflowY: 'auto',
			}}>
			<NavigationCard
				name='Data Sources'
				description='Obtain real-time insights into the proprietary deal-flow of leading funds, alongside a macro view on deal flow trends and granular access to individual deals.'
				showResurfacing={false}
			/>
			<TextField
				value={searchQuery}
				placeholder='Search for funds...'
				size='small'
				// disabled={true}
				id='input-with-icon-textfield'
				inputProps={{ style: { color: theme.text } }}
				sx={{
					'color': theme.text,
					'& .MuiInputBase-input.Mui-disabled': {
						WebkitTextFillColor: theme.text,
					},
					'-webkit-text-fill-color': theme.text,
					'cursor': 'not-allowed',
					'& .MuiInputBase-input.Mui-disabled, & .MuiOutlinedInput-input.Mui-disabled':
						{
							color: 'red', // Sets the text color to red when disabled
						},
					'& .MuiInputLabel-root': {}, //styles the label
					'& .MuiOutlinedInput-root': {
						'& > fieldset': {
							overflow: 'hidden',
							border: 'none',
						},
						'& .MuiInputBase-input.Mui-disabled, & .MuiOutlinedInput-input.Mui-disabled':
							{
								color: 'red', // Sets the text color to red when disabled
							},
					},
					'width': '18rem',
					'background': theme.background,
					'borderRadius': '6px',
					'& .MuiOutlinedInput-root.Mui-focused': {
						'& > fieldset': {
							border: `2px solid #4e5153`,
						},
					},
				}}
				onChange={(e) => setSearchQuery(e.target.value)}
				InputProps={{
					startAdornment: (
						<InputAdornment position='start'>
							<SearchRoundedIcon
								fontSize='small'
								sx={{ color: theme.text }}
							/>
							{/* <ShortcutIndicator >SHIFT SPACE</ShortcutIndicator> */}
						</InputAdornment>
					),
				}}
			/>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
					height: '100%',
					gap: '1.5rem',
					justifyContent: 'center',
					overflowY: 'auto',
				}}>
				{filteredData.map((fund) => (
					<VentureFundCard
						key={fund.uuid} // Ensure each card has a unique key for optimal rendering
						fund={fund}
						access_token={access_token}
						available={fund?.available ?? false}
					/>
				))}
				{isLoading && filteredData.length === 0 && (
					<Oval
						height={50}
						width={50}
						color='#484848'
						wrapperStyle={{}}
						wrapperClass=''
						visible={true}
						ariaLabel='oval-loading'
						secondaryColor='#222222'
						strokeWidth={2}
						strokeWidthSecondary={2}
					/>
				)}
				{isLoading && filteredData.length > 0 && (
					<div
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'column',
							// i need to stretch it in grid fully horizontally
							gridColumn: '1 / -1',
							justifyContent: 'center',
							alignItems: 'center',
							gap: '1rem',
						}}>
						<Oval
							height={50}
							width={50}
							color='#484848'
							wrapperStyle={{}}
							wrapperClass=''
							visible={true}
							ariaLabel='oval-loading'
							secondaryColor='#222222'
							strokeWidth={2}
							strokeWidthSecondary={2}
						/>
						<h5>Loading the rest of the deal sources...</h5>
					</div>
				)}
			</div>
		</div>
	);
};

const ShortcutIndicator = styled.div`
	cursor: pointer;
	color: ${({ theme, active }) => theme.subText};
	display: flex;
	position: absolute;
	font-size: 0.8rem;
	align-items: center;
	justify-content: center;
	text-align: center;
	right: 1rem;
	/* background-color: ${({ theme, active }) =>
		active ? '#2a4862' : theme.searchBar}; */
	cursor: pointer;
	text-decoration: none;
	border: 0.8px solid ${({ theme, active }) => theme.buttonBorder};
	border-radius: 5px;
	height: 0.8em;
	padding: 5px 5px;
`;

export default MarketPlace;
