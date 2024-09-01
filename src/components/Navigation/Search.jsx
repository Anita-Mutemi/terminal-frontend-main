import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useSearchProjects } from '../../hooks/useSearch';
import { useNavigate } from 'react-router-dom'; // Step 1
import { cleanUrl } from './clearUrl';

const SearchComponent = ({
	inputRef,
	searchQuery,
	searchHandler,
	theme,
	ShortcutIndicator,
}) => {
	const handleFocus = () => {
		if (inputRef.current) {
			inputRef.current.style.borderColor = 'blue';
		}
	};

	const { debouncedLoadSuggestions } = useSearchProjects();

	const handleBlur = () => {
		if (inputRef.current) {
			inputRef.current.style.borderColor = 'grey';
		}
		searchHandler(cleanUrl(searchQuery));
	};

	const validateWebsite = (string) => {
		// Regular expression pattern to match website URLs
		const urlPattern =
			/^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\:[0-9]+)?)(?:[\/\?#][^\s]*)?$/;
		return urlPattern.test(string);
	};

	const navigate = useNavigate(); // Step 2

	// Your existing code

	const navigateToSearch = () => {
		debouncedLoadSuggestions(cleanUrl(searchQuery)); // Step 4
		navigate('/signals-search'); // Navigate on certain condition
	};

	return (
		<TextField
			value={searchQuery}
			placeholder='Website URL'
			size='small'
			id='input-with-icon-textfield'
			inputProps={{ style: { color: theme.text } }}
			inputRef={inputRef}
			onFocus={handleFocus}
			onBlur={handleBlur}
			sx={{
				'height': '2.290rem',
				'& .MuiInputBase-input::placeholder': {
					fontSize: '13px',
				},
				'& .MuiInputLabel-root': {}, //styles the label
				'& .MuiOutlinedInput-root': {
					'& > fieldset': {
						// borderRadius: '50px',
						overflow: 'hidden',
						border: 'none',
					},
				},
				'width': '16.4rem',
				'background': theme.searchBar,
				'borderRadius': '6px',
				'& .MuiOutlinedInput-root.Mui-focused': {
					'& > fieldset': {
						border: `2px solid #3280c5`,
					},
				},
			}}
			onChange={(e) => {
				// debouncedLoadSuggestions(e.target.value);
				searchHandler(e.target.value);
			}}
			variant='outlined'
			InputProps={{
				startAdornment: (
					<InputAdornment position='start'>
						<SearchRoundedIcon
							fontSize='small'
							sx={{ color: theme.text }}
						/>
						{searchQuery.length > 5 && validateWebsite(searchQuery) ? (
							<ShortcutIndicator
								onClick={navigateToSearch} // Step 3
								style={{
									background: 'rgba(70, 208, 194, 0.507)',
									color: 'black',
								}}>
								SEARCH
							</ShortcutIndicator>
						) : (
							<ShortcutIndicator>SEARCH SIGNALS</ShortcutIndicator>
						)}
					</InputAdornment>
				),
			}}
		/>
	);
};

export default SearchComponent;
