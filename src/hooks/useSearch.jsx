import { useState } from 'react';
import axios from 'axios';
import { useSearch } from './UrlSearchContext'; // Import the context
import { useSelector } from 'react-redux';

export const useSearchProjects = () => {
	const { updateSearchResults, setLoading } = useSearch();
	const { access_token } = useSelector((state) => state.user); // Assuming you have a way to access global state

	const debouncedLoadSuggestions = async (inputValue) => {
		setLoading(true);
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			};
			const response = await axios.post(
				`/v1/search/search/project?project_query=${inputValue}&include_data=true&by_website=true&full_search=true`,
				null,
				config,
			);
			const { data } = response;
			updateSearchResults(data); // Update context with new results
		} catch (error) {
			console.error('Error loading suggestions', error);
		} finally {
			setLoading(false);
		}
	};

	return { debouncedLoadSuggestions };
};
