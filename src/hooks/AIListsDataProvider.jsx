import React, { createContext, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { notification } from 'antd';

const AIListsContext = createContext();

export const AIListsDataProvider = ({ children }) => {
	const { access_token } = useSelector((state) => state.user);
	const [aiLists, setAILists] = useState([]);
	const [selectedListId, setSelectedListId] = useState(null); // State for selected list ID
	const [selectedList, setSelectedList] = useState(null); // State for
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

	// Function to show notificationsа
	const showNotification = (type, message, description) => {
		notification[type]({
			message: message,
			description: description,
		});
	};

	const fetchAILists = async () => {
		try {
			const response = await axios.get('/v1/user/autolists', {
				headers: { Authorization: `Bearer ${access_token}` },
			});
			setAILists(response.data);
			// showNotification('success', 'Success', 'AI lists fetched successfully');
		} catch (error) {
			console.error('Error fetching AI lists:', error);
			showNotification('error', 'Error', 'Failed to fetch AI lists');
		}
	};

	const createAIList = async (data) => {
		try {
			const createResponse = await axios.post('/v1/user/autolists', data, {
				headers: { Authorization: `Bearer ${access_token}` },
			});
			await fetchAILists(); // Fetch the updated list of AI lists

			// Assuming the newly created list is returned in the response
			// Alternatively, find the new list from the updated aiLists if necessary
			const newList = createResponse.data;

			// Set the newly created list as the selected one
			setSelectedListId(newList.id);
			setSelectedList(newList);

			showNotification(
				'success',
				'Success',
				'AI list created and selected successfully',
			);
		} catch (error) {
			console.error('Error creating AI list:', error);
			showNotification('error', 'Error', 'Failed to create AI list');
		}
	};

	const deleteAIList = async (listId) => {
		try {
			await axios.delete(`/v1/user/autolists/${listId}`, {
				headers: { Authorization: `Bearer ${access_token}` },
			});
			fetchAILists();
			showNotification('success', 'Success', 'Agent was deleted');
		} catch (error) {
			console.error('Error deleting AI list:', error);
			showNotification('error', 'Error', 'Failed to delete AI list');
		}
	};

	const updateAIList = async (listId, data) => {
		try {
			await axios.patch(`/v1/user/autolists/${listId}`, data, {
				headers: { Authorization: `Bearer ${access_token}` },
			});
			fetchAILists();
			showNotification('success', 'Success', 'AI list updated successfully');
		} catch (error) {
			console.error('Error updating AI list:', error);
			showNotification(
				'error',
				'Error',
				error?.response.data.detail ?? 'Failed to update AI list',
			);
		}
	};

	const selectList = async (listId) => {
		setSelectedListId(listId);
		try {
			const response = await axios.get(`/v1/user/autolists/${listId}`, {
				headers: { Authorization: `Bearer ${access_token}` },
			});
			setSelectedList(response.data);
		} catch (error) {
			console.error('Error fetching details for AI list:', error);
		}
	};

	return (
		<AIListsContext.Provider
			value={{
				aiLists,
				selectedListId, // Expose selectedListId in the context
				selectList, // Expose selectList function
				fetchAILists,
				selectedList,
				isCreateModalVisible,
				setIsCreateModalVisible,
				createAIList,
				deleteAIList,
				updateAIList,
			}}>
			{children}
		</AIListsContext.Provider>
	);
};

export const useAILists = () => {
	return useContext(AIListsContext);
};
